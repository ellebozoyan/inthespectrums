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
    # Acronyms first, always. They are what families type - IEP, ESY, FBA, IEE,
    # AAC, CVI, SEL - and they were being lost twice over: dropped by a
    # four-character minimum, then truncated by the word cap when they appeared
    # late in a long section. Pulling them out up front fixes both.
    acronyms = [a.lower() for a in re.findall(r"\b[A-Z]{2,6}\b", text)]
    words = acronyms + re.findall(r"[a-z][a-z'-]{2,}", text.lower())
    seen, out = set(), []
    for w in words:
        w = w.strip("'-")
        if len(w) < 3 or w in STOP or w in seen:
            continue
        seen.add(w); out.append(w)
        if len(out) >= 85:
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
 "was fine before":"later emerging demands capacity scaffolding middle school",
 "suddenly struggling":"later emerging demands capacity coping masking scaffolding",
 "why now":"later emerging demands capacity room changed scaffolding",
 "what did i miss":"later emerging demands capacity not hiding grief",
 "coping until now":"masking capacity later emerging demands scaffolding",
 "what is the point":"aiming flourishing goals deficits obstacle objective",
 "happy life":"aiming flourishing belonging contribution entitled to want",
 "big picture":"aiming flourishing goals deficits obstacle belonging",
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
 "maths":"dyscalculia math numeracy number sense",
 "bad at math":"dyscalculia number sense math anxiety fact fluency",
 "dyscalculia":"dyscalculia number sense math estimating quantity",
 "number sense":"dyscalculia number sense estimating quantity math",
 "word problems":"math reading working memory multi-step word problems",
 "times tables":"fact fluency math working memory timed tests",
 "counts on fingers":"dyscalculia fact fluency number sense math",
 "wont write":"writing dysgraphia written expression handwriting dictate",
 "hates writing":"writing dysgraphia written expression handwriting typing",
 "handwriting is terrible":"dysgraphia handwriting occupational typing",
 "knows it but cant write":"written expression dysgraphia dictate scribe speech to text",
 "essay":"written expression organizing drafting scaffolding dysgraphia",
 "failing history":"reading writing executive load assignment subject",
 "math":"dyscalculia numeracy",
 "cant focus":"ADHD attention executive function",
 "teach back":"teach-back repeat back plan outing leaving extension",
 "before we go":"teach-back plan outing leaving transition extension",
 "leaving the store":"teach-back outing transition leaving extension timer",
 "wont leave":"transition leaving teach-back extension timer outing",
 "five more minutes":"extension teach-back leaving transition timer",
 "forgets instructions":"working memory externalize checklist one step",
 "working memory":"working memory externalize checklist one instruction",
 "can focus on games":"hyperfocus interest attention executive function room",
 "fine at home":"capacity school room attention executive function afternoon",
 "falls apart at school":"capacity school room attention executive function",
 "distracted":"ADHD attention executive function",
 "hyper":"ADHD hyperactivity attention",
 "worried":"anxiety worry OCD reassurance",
 "sel":"social emotional learning regulation self-awareness relationships",
 "social emotional":"SEL social emotional learning regulation relationships",
 "social skills":"SEL social emotional learning relationships masking peers",
 "cant calm down":"self-regulation co-regulation SEL capacity de-escalation",
 "doesnt know how he feels":"interoception self-awareness SEL emotional vocabulary",
 "no friends":"relationships SEL social emotional peers community",
 "masking":"masking SEL social skills autistic compliance",
 "zones":"regulation SEL emotional vocabulary self-awareness",
 "anxious":"anxiety worry OCD school refusal",
 "scared":"anxiety fear worry",
 "wont go to school":"school refusal anxiety attendance",
 "school refusal":"school refusal anxiety attendance",
 "iep":"IEP school special education accommodations evaluation",
 "advocate":"parent advocate attorney mediation cost school dispute",
 "related services":"related services school therapy counseling adapted PE",
 "school psychologist":"school psychologist counseling assessment behavior consultation",
 "adapted pe":"adapted physical education related service school",
 "counseling at school":"counseling related service school psychologist social worker",
 "outside therapist":"private therapist school coordination release generalization",
 "private therapist":"outside therapist school coordination release records",
 "do they talk to each other":"coordination release school outside therapist team",
 "orientation and mobility":"orientation mobility vision teacher related service",
 "vision teacher":"teacher of the visually impaired functional vision related service",
 "parent training":"parent counseling and training related service school",
 "assistive technology":"assistive technology evaluation device training school",
 "do i need a lawyer":"attorney advocate mediation due process cost school",
 "lawyer":"attorney advocate due process mediation fees school",
 "special education attorney":"attorney advocate due process fees mediation",
 "mediation":"mediation facilitated meeting state complaint dispute free",
 "state complaint":"state complaint mediation dispute timeline free",
 "iee":"IEE independent educational evaluation public expense disagree district",
 "independent evaluation":"IEE independent educational evaluation public expense district",
 "parent center":"parent training information center free independent state",
 "how much does an advocate cost":"advocate attorney fees hourly cost",
 "fighting the school":"advocate attorney mediation dispute cost capacity",
 "push in":"push-in pull-out service delivery classroom therapy",
 "pull out":"pull-out push-in service delivery classroom therapy",
 "aide":"paraprofessional one-to-one support aide school",
 "one to one":"paraprofessional aide one-to-one support",
 "out of district":"placement collaborative approved private special education school",
 "summer services":"extended school year ESY regression recoupment",
 "regression":"extended school year ESY regression recoupment skills lost",
 "fba":"functional behavioral assessment behavior plan observation",
 "behavior plan":"functional behavioral assessment behavior plan school",
 "stay put":"stay put pendency placement program out-of-district private funding",
 "pendency":"stay put pendency placement program last agreed IEP",
 "they want to move him":"stay put pendency placement program change district",
 "keep his placement":"stay put pendency out-of-district private program funding",
 "out of district placement":"stay put pendency private approved school funding program",
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
 "how to help":"ordinary warmth friends relatives concrete offer invite",
 "being kind":"ordinary warmth kindness smile hello friendliness",
 "kindness":"ordinary warmth kindness smile hello friendliness",
 "playdate":"heads-up note playdate visit sitter sleepover text",
 "heads up":"heads-up note playdate visit text message",
 "before a visit":"heads-up note playdate sitter sleepover text",
 "what to tell the other parent":"heads-up note playdate text message",
 "birthday party":"heads-up note party busy loud leave early",
 "sleepover":"heads-up note sleepover overnight sitter",
 "new sitter":"heads-up note sitter babysitter share builder",
 "text message":"heads-up note short textable copy",
 "what do i say":"ordinary warmth awkward staring hello smile",
 "people stare":"ordinary warmth staring looking away meltdown glare",
 "dirty looks":"ordinary warmth glare judgment meltdown staring",
 "what not to say":"ordinary warmth lands badly brave have you tried",
 "friend has a disabled child":"ordinary warmth friends relatives offer invite",
 "how to be inclusive":"ordinary warmth inclusion friendliness hello",
 "grandparent":"ordinary warmth relatives visiting home rules invite",
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
