#!/usr/bin/env python3
"""Validate every page before shipping. Run: python3 check-site.py"""
import re, glob, os, subprocess, sys

ESCAPES = ['\\u2014','\\u2019','\\u2026','\\u00b7','\\u2013','\\u201c','\\u201d','\\u00d7','\\u2192','\\u00b0']
present = set(os.listdir('.'))
pages = sorted(glob.glob('*.html'))
problems = []

for f in pages:
    s = open(f).read()
    body = re.sub(r'<script>.*?</script>', '', s, flags=re.S)   # escapes are legal inside JS
    for tag in ['<div','<section','<a ','<ul','<ol','<li','<p ','<h2','<h3']:
        close = '</' + tag.lstrip('<').split(' ')[0] + '>'
        if s.count(tag) != s.count(close) and tag in ('<div','<section','<a '):
            problems.append(f'{f}: unbalanced {tag}')
    if not s.rstrip().endswith('</html>'):
        problems.append(f'{f}: does not close with </html>')
    if s.count('search-index.js') != 1:
        problems.append(f'{f}: search-index.js included {s.count(chr(39)+chr(39))} times')
    if s.count('site-nav.js') != 1:
        problems.append(f'{f}: site-nav.js included {s.count("site-nav.js")} times')
    for e in ESCAPES:
        if e in body:
            problems.append(f'{f}: literal {e} in page text ({body.count(e)}x)')
    # links built in JavaScript contain quotes/concatenation - check only literal ones
    links = set(re.findall(r'href="([^"\n]+)"', s))
    bad = [l for l in links
           if l.split('?')[0].split('#')[0] not in present
           and l != '#' and not l.startswith(('http', '#', 'mailto'))
           and "'" not in l and '+' not in l]
    if bad:
        problems.append(f'{f}: broken links {bad}')
    if '<script>' in s:
        js = s.split('<script>')[1].split('</script>')[0]
        open('/tmp/_c.js', 'w').write(js)
        if subprocess.run(['node', '--check', '/tmp/_c.js'], capture_output=True).returncode:
            problems.append(f'{f}: JavaScript syntax error')

if subprocess.run(['node', '--check', 'site-nav.js'], capture_output=True).returncode:
    problems.append('site-nav.js: syntax error')

nav = open('site-nav.js').read()
shorts = set(re.findall(r"^'([a-z0-9-]+\.html)': \[", nav, flags=re.M))
marks  = set(re.findall(r"^  '([a-z0-9-]+\.html)':", nav, flags=re.M))
content = {p for p in pages if p != 'index.html'}
for p in sorted(content - shorts): problems.append(f'{p}: no short version')
for p in sorted(content - marks):  problems.append(f'{p}: no page mark')


# Every interactive tool must carry the full storage warning. Losing months of
# records because one page said it and another did not is not an acceptable failure.
TOOLS = ['symptom-tracker.html','goals-tracker.html','medication-list.html','food-list.html',
         'meal-planner.html','family-calendar.html','share-builder.html','choice-planner.html',
         'household-board.html','practice-mirror.html','template-builders.html']
PHRASE = 'device that you are currently using'
for t in TOOLS:
    if t in present and PHRASE not in open(t).read():
        problems.append(f'{t}: missing the full storage warning ("{PHRASE}")')


# The site uses American English throughout. British spellings creep in easily
# and are exactly the kind of inconsistency nobody notices until a reader does.
BRIT = ['behaviour','favour','nappies','nappy','centres','organisation','recognise','recognised',
        'diarrhoea','paediatric','anaemia','honour','honouring','colour','flavour','labour',
        'realise','prioritise','minimise','summarise','specialise','analyse','practise','practising',
        'modelling','cancelled','licence','defence','offence','programme','whilst','amongst','learnt']
for f in pages + ['site-nav.js']:
    txt = open(f).read()
    body = re.sub(r'<script>.*?</script>|<style>.*?</style>', '', txt, flags=re.S) if f.endswith('.html') else txt
    hits = [w for w in BRIT if re.search(r'\b' + w + r'\b', body, re.I)]
    if hits:
        problems.append(f'{f}: British spelling ({", ".join(hits)})')


# The home page states a page count. It has drifted twice; now it is checked.
WORDS = {49:'Forty-nine',50:'Fifty',51:'Fifty-one',52:'Fifty-two',53:'Fifty-three',
         54:'Fifty-four',55:'Fifty-five',56:'Fifty-six',57:'Fifty-seven',58:'Fifty-eight'}
if 'index.html' in present:
    home = open('index.html').read()
    stated = re.search(r'\b(Forty|Fifty|Sixty)(?:-[a-z]+)? pages', home)
    expected = WORDS.get(len(pages))
    if stated and expected and stated.group(0).replace(' pages','') != expected:
        problems.append(f'index.html: says "{stated.group(1)} pages" but there are {len(pages)} ({expected})')


# Two near-identical pages both wired into the navigation shipped once, unnoticed.
# Character-frequency comparison is useless here (every page shares a vocabulary),
# so this compares the actual set of sentences. Genuinely different pages overlap
# almost not at all; a duplicate overlaps almost entirely.
def _sentences(f):
    t = open(f).read()
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'\s+', ' ', t)
    return {s.strip() for s in re.split(r'(?<=[.!?]) ', t) if len(s.strip()) > 40}

_sent = {f: _sentences(f) for f in pages}
for i, a in enumerate(pages):
    for b in pages[i + 1:]:
        sa, sb = _sent[a], _sent[b]
        if len(sa) < 5 or len(sb) < 5:
            continue
        shared = len(sa & sb)
        overlap = shared / min(len(sa), len(sb))
        if overlap > 0.6:
            problems.append(
                f'{a} and {b}: {int(overlap*100)}% of sentences are shared '
                f'({shared} identical) - possible duplicate page')


# A find() that returned -1 once spliced page content into the middle of the
# DOCTYPE, which rendered as stray text above the heading and put the browser
# into quirks mode. Cheap to check, easy to miss by eye.
for f in pages:
    head = open(f).read()[:400]
    if not head.lstrip().lower().startswith('<!doctype html>'):
        problems.append(f'{f}: does not begin with a valid DOCTYPE')
    before_html = head.split('<html', 1)[0]
    if '<a ' in before_html or '<div' in before_html or '<p ' in before_html:
        problems.append(f'{f}: page content appears before <html>')


# Deep links into the conditions library point at ids inside a <script> block,
# so a renamed or removed entry breaks them silently. Check them everywhere.
if 'conditions-library.html' in present:
    _cl = open('conditions-library.html').read()
    _ids = set(re.findall(r'\{id:"([a-z0-9-]+)",cat:', _cl))
    for f in pages:
        for frag in re.findall(r'href="conditions-library\.html#([a-z0-9-]+)"', open(f).read()):
            if frag not in _ids:
                problems.append(f'{f}: links to conditions-library.html#{frag}, which does not exist')


# An image without alt text is read aloud as a filename. An image without
# width and height makes the page jump as it loads. Both are cheap to require.
for f in pages:
    txt = open(f).read()
    # only real markup - images built inside <script> have their sizes set in JS
    body = re.sub(r'<script.*?</script>', '', txt, flags=re.S)
    for tag in re.findall(r'<img\s[^>]*>', body):
        src = (re.search(r'src="([^"]*)"', tag) or [None, '?'])[1]
        if 'alt=' not in tag:
            problems.append(f'{f}: <img src="{src}"> has no alt text')
        if 'width=' not in tag or 'height=' not in tag:
            problems.append(f'{f}: <img src="{src}"> has no width/height (page will jump)')
        if src != '?' and src.startswith('img/') and not os.path.exists(src):
            problems.append(f'{f}: image file missing - {src}')

print(f'{len(pages)} pages checked')
if problems:
    print(f'\n{len(problems)} PROBLEMS:')
    for p in problems: print('  ·', p)
    sys.exit(1)
print('ALL CLEAR')
