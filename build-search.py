#!/usr/bin/env python3
"""Build search-index.js from every page. Run after any content change:
       python3 build-search.py
Indexes each section separately so results can point at the right part of a page."""
import re, glob, json, os

SKIP = {'terms-and-privacy.html'}

def clean(html):
    html = re.sub(r'<script.*?</script>', ' ', html, flags=re.S)
    html = re.sub(r'<style.*?</style>', ' ', html, flags=re.S)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = (html.replace('&mdash;', '—').replace('&amp;', '&')
                .replace('&lt;', '<').replace('&gt;', '>')
                .replace('&nbsp;', ' ').replace('&#39;', "'").replace('&quot;', '"'))
    return re.sub(r'\s+', ' ', html).strip()

STOP = set('''a an and the of to in for on with is are was were be been being it its this that
these those as at by from or if not no nor but so than then there here when where which who whom
whose what how why all any both each few more most other some such only own same too very can will
just do does did doing done have has had having would should could may might must shall you your
yours they them their theirs we our ours us he him his she her hers i me my mine one two three
about after again against because before between during into out over under up down off out'''.split())

def keywords(text):
    words = re.findall(r"[a-z][a-z'-]{3,}", text.lower())
    seen, out = set(), []
    for w in words:
        w = w.strip("'-")
        if len(w) < 4 or w in STOP or w in seen:
            continue
        seen.add(w); out.append(w)
        if len(out) >= 70:
            break
    return ' '.join(out)


# The conditions library keeps its 36 entries inside a <script> block, so the
# ordinary extraction above misses every one of them. Pull them out by field.
def index_conditions():
    src = open('conditions-library.html').read()
    out = []
    for m in re.finditer(r'\{id:"([a-z0-9-]+)",cat:"[a-z]+",name:"(.*?)",\n(.*?)\},\n', src, re.S):
        cid, name, body = m.group(1), m.group(2), m.group(3)
        def field(key):
            mm = re.search(key + r':"(.*?)",\n', body, re.S)
            if mm:
                return clean(mm.group(1))
            mm = re.search(key + r':\[(.*?)\]', body, re.S)
            if mm:
                return clean(' '.join(re.findall(r'"(.*?)"', mm.group(1))))
            return ''
        hook = field('hook')
        text = ' '.join(x for x in [hook, field('also'), field('what'), field('range'),
                                    field('signs'), field('helps'), field('missed')] if x)
        out.append({'p': 'conditions-library.html', 't': 'The Conditions Library',
                    'h': name, 'a': cid,
                    'x': (name + ' \u2014 ' + hook + ' ' + text)[:520],
                    'k': keywords(name + ' ' + text)})
    return out

entries = []
for f in sorted(glob.glob('*.html')):
    if f == 'index.html' or f in SKIP:
        continue
    src = open(f).read()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', src, re.S)
    title = clean(m.group(1)) if m else f
    title = re.sub(r'\s*:\s*$', '', title.split('\n')[0])
    lede = ''
    m2 = re.search(r'<p class="lede">(.*?)</p>', src, re.S)
    if m2:
        lede = clean(m2.group(1))
    # page-level entry, including anything before the first section heading:
    # ledes, warning boxes and intro notes were previously invisible to search
    first = src.split('<h2 class="sec">')[0]
    intro = clean(re.sub(r'<header.*?</header>', ' ', first, flags=re.S))
    head_txt = (title + ' ' + lede + ' ' + intro)
    entries.append({'p': f, 't': title, 'h': '', 'a': '',
                    'x': head_txt[:700], 'k': keywords(head_txt)})
    # one entry per section, numbered to match the anchors the nav assigns
    secs = re.findall(r'<h2 class="sec">(.*?)</h2>(.*?)(?=<h2 class="sec">|</section>)', src, re.S)
    for i, (head, body) in enumerate(secs):
        h = clean(head)
        txt = clean(body)
        strongs = ' '.join(clean(s) for s in re.findall(r'<strong>(.*?)</strong>', body, re.S)[:14])
        h3s = ' '.join(clean(s) for s in re.findall(r'<h3[^>]*>(.*?)</h3>', body, re.S)[:10])
        entries.append({'p': f, 't': title, 'h': h, 'a': 'sec-' + str(i + 1),
                        'x': (h + ' ' + h3s + ' ' + strongs + ' ' + txt)[:520],
                        'k': keywords(txt + ' ' + h3s + ' ' + strongs)})

# plain words families actually use, mapped to what the site says
SYN = {
 "flap":"stimming sensory processing self-regulation repetitive occupational therapy",
 "flapping":"stimming sensory processing self-regulation repetitive occupational therapy",
 "stim":"stimming sensory self-regulation repetitive",
 "cant stop":"attention locks perseveration redirection transition mechanism",
 "wont move on":"transition redirection attention locks mechanism whole picture",
 "stuck on":"perseveration attention redirection transition mechanism",
 "two sides":"mechanism strength difficulty same both ways",
 "strengths":"mechanism both ways strength difficulty whole picture",
 "hyperfocus":"attention locks perseveration redirection mechanism",
 "spin":"stimming sensory vestibular seeking",
 "rocking":"stimming sensory self-regulation",
 "picky":"ARFID feeding food restricted eating selective",
 "food dye":"artificial colors additives elimination trial feeding",
 "artificial colors":"food dye additives elimination trial",
 "red dye":"artificial colors food dye additives elimination",
 "only eats white":"beige texture sensory food chaining restricted",
 "only crunchy":"texture sensory food chaining property restricted",
 "beige food":"texture sensory food chaining restricted eating",
 "elimination diet":"elimination trial reintroduction baseline dietitian",
 "cutting out":"elimination trial reintroduction baseline restriction",
 "food sensitivity":"additives elimination trial intolerance allergy",
 "gluten free":"elimination trial restriction dietitian celiac",
 "dairy free":"elimination trial restriction dietitian",
 "fussy":"ARFID feeding food restricted eating",
 "wont eat":"ARFID feeding food restricted eating appetite",
 "not eating":"ARFID feeding food restricted eating appetite",
 "eating":"ARFID feeding food nutrition",
 "aggression":"behavior communication de-escalation dysregulation hitting precursor",
 "aggressive":"behavior de-escalation dysregulation safety",
 "hitting":"behavior de-escalation aggression dysregulation",
 "biting":"behavior de-escalation sensory oral aggression",
 "meltdown":"dysregulation de-escalation behavior capacity overload",
 "tantrum":"dysregulation de-escalation behavior",
 "screaming":"dysregulation de-escalation behavior",
 "self harm":"self-injury behavior de-escalation safety",
 "head banging":"self-injury behavior sensory pain",
 "wont sleep":"sleep insomnia bedtime melatonin airway",
 "not sleeping":"sleep insomnia bedtime airway breathing",
 "night waking":"sleep insomnia airway",
 "snoring":"airway sleep breathing myofunctional adenoid",
 "mouth breathing":"airway myofunctional breathing sleep",
 "wont talk":"AAC speech language communication nonspeaking",
 "not talking":"AAC speech language communication nonspeaking",
 "nonverbal":"AAC nonspeaking speech language communication",
 "speech":"speech language AAC communication articulation",
 "wont poo":"constipation bowel withholding toileting gut stool",
 "wont poop":"constipation bowel withholding toileting gut stool",
 "holding it":"constipation withholding bowel toileting",
 "tummy":"stomach gut abdominal pain constipation",
 "constipated":"constipation bowel withholding gut",
 "toilet":"toileting continence bowel bladder",
 "potty":"toileting continence",
 "runs off":"elopement wandering safety bolting",
 "bolting":"elopement wandering safety",
 "wandering":"elopement wandering safety drowning",
 "drowning":"water safety swimming elopement",
 "toe walking":"physical therapy gait orthotics motor",
 "clumsy":"motor coordination physical therapy dyspraxia",
 "handwriting":"occupational therapy dysgraphia fine motor writing",
 "cant read":"dyslexia reading literacy phonics decoding",
 "bilingual":"bilingual multilingual two languages home language literacy",
 "two languages":"bilingual multilingual home language literacy assessment",
 "english learner":"bilingual multilingual language difference disorder literacy",
 "speaks two":"bilingual multilingual home language",
 "should we stop speaking":"home language bilingual multilingual",
 "functional vision":"functional vision assessment CVI teacher visually impaired",
 "fva":"functional vision assessment CVI IEP",
 "passed the vision test":"screening functional vision focusing teaming tracking",
 "eye strain":"focusing teaming tracking vision reading headaches",
 "loses his place":"tracking vision reading focusing teaming",
 "functional hearing":"functional listening educational audiologist hearing IEP",
 "reading":"dyslexia literacy phonics decoding comprehension",
 "spelling":"dysgraphia dyslexia literacy",
 "maths":"dyscalculia math numeracy",
 "math":"dyscalculia numeracy",
 "cant focus":"ADHD attention executive function",
 "distracted":"ADHD attention executive function",
 "hyper":"ADHD hyperactivity attention",
 "worried":"anxiety worry OCD reassurance",
 "anxious":"anxiety worry OCD school refusal",
 "scared":"anxiety fear worry",
 "wont go to school":"school refusal anxiety attendance",
 "school refusal":"school refusal anxiety attendance",
 "iep":"IEP school special education accommodations evaluation",
 "push in":"push-in pull-out service delivery classroom therapy",
 "pull out":"pull-out push-in service delivery classroom therapy",
 "aide":"paraprofessional one-to-one support aide school",
 "one to one":"paraprofessional aide one-to-one support",
 "out of district":"placement collaborative approved private special education school",
 "summer services":"extended school year ESY regression recoupment",
 "regression":"extended school year ESY regression recoupment skills lost",
 "fba":"functional behavioral assessment behavior plan observation",
 "behavior plan":"functional behavioral assessment behavior plan school",
 "stay put":"stay put pendency placement dispute due process",
 "keeping him home":"attendance truancy educational neglect withdrawing homeschool",
 "keeping her home":"attendance truancy educational neglect withdrawing homeschool",
 "not sending him":"attendance truancy educational neglect withdrawing homeschool",
 "wont go to school":"school refusal anxiety attendance truancy",
 "difficult parent":"records advocacy written communication district",
 "504":"accommodations school plan",
 "bullying":"safety school bullying",
 "money":"funding insurance paying benefits cost",
 "insurance":"insurance funding paying appeal denial",
 "pay for":"funding insurance paying cost",
 "benefits":"SSI SSDI Medicaid benefits funding",
 "turning 18":"adult life guardianship decision-making benefits transition",
 "after school":"adult life transition programs employment",
 "housing":"adult housing vouchers residential supported living",
 "will":"trust estate special needs trust inheritance guardianship",
 "trust":"special needs trust estate ABLE inheritance",
 "guardianship":"guardianship supported decision-making conservatorship rights",
 "burnt out":"caregiver burnout respite support exhausted",
 "burned out":"caregiver burnout respite support exhausted",
 "burnout":"caregiver burnout respite support",
 "no help":"caregiver respite support burnout",
 "on my own":"caregiver single solo respite support",
 "exhausted":"caregiver burnout respite support",
 "tired":"caregiver burnout respite sleep support",
 "respite":"respite caregiver support funding",
 "sibling":"siblings caregiver family",
 "grief":"grief caregiver support",
 "sensory":"sensory processing occupational therapy regulation",
 "noise":"sensory sound auditory overload",
 "light":"sensory vision light photophobia",
 "vision":"vision CVI eyes visual processing",
 "cvi":"CVI cortical visual impairment vision",
 "hearing":"hearing listening auditory ears fluid",
 "seizure":"seizures epilepsy neurological functional",
 "fnd":"functional neurological disorder FND conversion",
 "functional seizures":"functional neurological disorder FND non-epileptic",
 "non epileptic":"functional neurological disorder FND seizures",
 "all in my head":"functional neurological disorder believed dismissed",
 "not believed":"functional neurological disorder dismissed believed",
 "cant walk":"functional neurological disorder weakness gait physical therapy",
 "legs give way":"functional neurological disorder weakness falls",
 "tremor":"functional neurological disorder shaking movement",
 "pain":"pain medical injuries illness unexplained",
 "sick":"illness medical injuries symptoms",
 "medication":"medication meds prescription dose supplements",
 "diagnosis":"diagnosis conditions assessment evaluation",
 "genetic":"genetics testing syndrome",
 "therapy":"therapy OT PT speech feeding provider",
 "aba":"ABA behavior support therapy",
 "rdi":"RDI relationship development caregiver declarative",
 "chores":"household board contributions jobs responsibility",
 "screen time":"screens routine calendar boundaries",
}

entries.extend(index_conditions())

out = ("/* Generated by build-search.py \u2014 do not edit by hand. */\n"
       "window.ITS_SEARCH = " + json.dumps(entries, ensure_ascii=False, separators=(',', ':')) + ";\n"
       "window.ITS_SYNONYMS = " + json.dumps(SYN, ensure_ascii=False, separators=(',', ':')) + ";\n")
open('search-index.js', 'w').write(out)
print(f'{len(entries)} entries from {len({e["p"] for e in entries})} pages')
print(f'search-index.js is {len(out)//1024} KB')
