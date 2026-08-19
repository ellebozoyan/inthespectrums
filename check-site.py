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

print(f'{len(pages)} pages checked')
if problems:
    print(f'\n{len(problems)} PROBLEMS:')
    for p in problems: print('  ·', p)
    sys.exit(1)
print('ALL CLEAR')
