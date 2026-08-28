# Test suites

Headless tests using jsdom. They load each page, run its JavaScript, click
things, and assert on the resulting state — so they catch bugs that look fine
on screen.

## Running them

```bash
npm install jsdom          # once
node tn.js                 # any single suite
for t in *.js; do echo "$t"; node "$t" | tail -1; done
```

Each suite expects the site files one directory up. If you move things, edit
the `dir` constant at the top of each file.

## What each suite covers

| File | Covers |
|---|---|
| `tn.js` | Navigation, header, drawer, footer, breadcrumbs |
| `tsk.js` | Skim view — collapsing to headings and summaries |
| `tl.js` | Every affirming callout finds its anchor heading |
| `cov.js` | Skim coverage — every section has a one-line description |
| `tsearch.js` | Search, including plain-language synonyms |
| `tlang.js` | Language selector, and that nothing loads until chosen |
| `turgent.js` | The emergency block on the home page |
| `tdoc.js` | Printed document styling across all tools |
| `ts.js` | Share builder |
| `tg.js` | Goals tracker |
| `tmf.js` | Medication list and food list |
| `tfood.js` | Food properties and what-to-try-next suggestions |
| `tc.js` `tc2.js` `tc3.js` | Family calendar — core, week/ticks, colors and privacy |
| `tics.js` | Calendar file export format |
| `tmp.js` | Meal planner |
| `tpm.js` | Practice mirror |
| `tlink.js` | Household board ↔ practice mirror round trip |
| `tnew.js` | Choice planner and household board |
| `tv28.js` | Medication fields, reminders, reading modes |
| `timport.js` | Calendar file import and pasted-list import |
| `twho.js` | Shared person switcher — appears on every tool, adds and switches people |
| `timg.js` | Photograph handling — lazy loading, aspect ratio, alt text warnings |
| `tbar.js` | Header fits phone widths — nothing runs off the right edge |
| `tnote.js` | Heads-up note — situations, details, length, copy, saving |
| `tcond.js` | Conditions library — every entry renders, schema is complete, deep links open |

## The two rules worth keeping

**Assert on state, not appearance.** Several real bugs were caught only because
a test checked stored data rather than rendered markup — a silent exception can
leave the previous, correct-looking view on screen.

**When a test fails, check the test first.** Roughly a third of failures here
were stale assertions from a deliberate change, not regressions.
