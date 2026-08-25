# In The Spectrums — project handover

Everything a new session needs to continue this build. Written to be uploaded
alongside the site zip.

**Live at:** https://ellebozoyan.github.io/inthespectrums/
**Repository:** github.com/ellebozoyan/inthespectrums
**Author:** Elle Bozoyan. **Developer:** Makenzie (away at college).

---

## What this is

A free, ad-free, account-free resource site for families of children with
complex needs. Fifty-four pages of written guidance plus twelve interactive
tools. Everything runs in the browser. There is no server, no analytics, no
tracking, and nothing a family types is ever transmitted anywhere.

**Who it is for, in the site's own words:** nobody has to qualify. One lisp
counts, and so does a family carrying fifteen overlapping things — that second
group especially, because almost nothing else is written for them.

---

## Absolute rules

These are not stylistic preferences. Breaking any of them is a serious error.

1. **Nothing about the author's family appears on the site.** Not her children,
   their names, diagnoses, providers, schools, protocols, or documents. Personal
   experience informs the content; it never appears in it.
2. **Nothing is uploaded, ever.** No accounts, no analytics, no third-party
   scripts — with one deliberately opt-in exception (see Language, below).
3. **No doses on the supplements page.** Verified programmatically. Do not add
   any.
4. **American English throughout.** `check-site.py` fails on British spellings.
5. **Person-first language**, consistently.

---

## Editorial voice

- Warm but unsentimental. Not hokey. The credibility comes from **not
  flattening difficulty**.
- Name contested evidence as contested rather than picking a side quietly. Where
  the site does take a position, it says that it is taking one.
- Offer options with reasoning, not directives.
- Every page ends on the reader's competence.
- Write so a professional reading it would not wince — several pages carry a
  short "Reading this as a professional" note.
- Say the thing nobody prints. The passages that land hardest are the honest
  ones: that most caregivers sometimes resent the person they care for; that
  teams discuss children in front of them by default; that being listened to is
  not the same as being right.

**On the name:** *in* the spectrums, plural. *On* a spectrum describes a line.
The site's position is that a life is many dimensions at once, and the name was
chosen to open outward.

---

## File layout

```
*.html              54 pages, each self-contained (own CSS, own JS)
site-nav.js         shared: nav, skim view, callouts, search, language,
                    print styling. ~19 numbered sections.
all-pages.html      the full directory - every card and the 61-quote router.
                    index.html deliberately holds only six cards and links here;
                    it was 3,464 words and is now ~1,200. Do not move the
                    directory back onto the home page.
search-index.js     GENERATED — do not hand-edit
build-search.py     regenerates search-index.js
check-site.py       validates everything before shipping
tests/              22 headless test suites (see tests/README.md)
```

Every page loads `search-index.js` then `site-nav.js`, in that order, at the end
of `<body>`.

---

## Workflow — run these every time

```bash
python3 build-search.py     # after any content change
python3 check-site.py       # must print ALL CLEAR before shipping
cd tests && node tn.js      # and the suites relevant to what changed
```

`check-site.py` catches: unbalanced tags, broken links, JavaScript syntax
errors, literal escape sequences leaking into page text, British spellings,
pages missing a skim summary or icon, and any tool missing the storage warning.

**It has caught real bugs repeatedly. Do not skip it.**

---

## The twelve tools

All share one localStorage key, `its_family_v1`, structured per person:

```
{ current: "key",
  people: { key: { name, dob, dx, emerg, weight, color, show,
    tracker, goals, meds, food, cal, plan, scripts, home, practice }}}
```

One backup file covers every tool. Migration from older key names is automatic.

| Tool | Notes |
|---|---|
| symptom-tracker | 22 categories, capacity model, restraint log, patterns |
| goals-tracker | Generalization matrix, three-per-provider rule |
| share-builder | 16 sections, 6 recipient presets |
| medication-list | Brand, route, frequency, handling flags, delivery note |
| food-list | Five statuses, property tags, what-to-try-next suggestions |
| meal-planner | Person sets their own goal for new foods; zero is valid |
| family-calendar | Day/week/month, per-person colors, photos, reminders, .ics in and out |
| template-builders | Four documents that build themselves |
| choice-planner | Logical vs first-then vs natural, capacity check first |
| household-board | Contributions vs paid jobs, savings goal, no points ever |
| practice-mirror | Therapist clip plays see-through over live camera |
| conditions-library | 46 entries |

**Where AAC reasoning lives:** `speech-language-aac.html` holds all of it — why a
device rather than only a board, where low-tech genuinely belongs, the
Communication Bill of Rights, the rejection of the candidacy model, and the
guidance on building it into home, therapy and school. `mealtime-communication.html`
covers only the boards and their mealtime use, and links across. **Do not
duplicate the reasoning back onto other pages** — link to the AAC page instead.

**Next task queued:** Elle will supply a de-identified AAC vocabulary in a later
session, to pull relevant board pages out and place them across the therapy
pages showing how each is used in practice.

**Pending licensing:** `mealtime-communication.html` presents twelve AAC boards
with download slots marked "Coming shortly". The symbol licence is being sought;
the page exists partly so a licensor can see exactly where files would live and
what attribution appears. Plain word lists are offered alongside, which need no
licence at all — if licensing is refused, those and open-licensed symbol sets
(ARASAAC, Mulberry) are the fallback.

**One store, one switcher.** All twelve tools share `its_family_v1`, so a name
entered once appears everywhere. Section 20 of `site-nav.js` injects a person
switcher above the tabs on every tool - it writes the choice and reloads, which
avoids each tool needing to cooperate. A search box appears once there are more
than six people.

**Design principles the tools follow:**
- The person sets their own goal wherever there is one. Zero is a real answer.
- No points, stars, streaks, or levels. Nothing is ever taken away.
- Ask whether the person *can* do it before treating it as motivation.
- Every tool states, twice, that data lives in one browser on one device.

---

## Known traps

Things that have bitten this build before.

- **`display:flex` on `<li>`** turns every child node into a column. Use
  `position:relative` with an absolutely-positioned icon.
- **Two `var MARKS = {` blocks in site-nav.js.** The first is the icon library;
  the second (~line 1400) is page icons keyed by filename. Editing the wrong one
  fails silently.
- **Doubled brackets** when replacing a summary array — `"]],` instead of `"],`.
  Has happened twice.
- **Literal `\u2014` leaking into page text.** Legal inside `<script>`, wrong
  outside it. The validator checks this.
- **A missing constant throws silently mid-render**, leaving the previous view
  on screen. The calendar looked like it was ignoring input for five rounds of
  debugging. Test on state, not appearance.
- **Headings contain `<em>`**, so anchoring a regex on heading text usually
  fails. Match on a fragment or find the line number.
- **Content placed between `<section>` and its `<h2>`** orphans the section and
  removes it from skim view.
- **Conditions library entries have a fixed schema**: `missed`, `unlock`, `learn`
  — not `watch`, `myth`, `money`. A wrong field name throws on render and the
  entry silently cannot be opened. `tests/tcond.js` now catches this.
- **The conditions library lives inside a `<script>` block**, so it was invisible
  to search for a long time. `build-search.py` extracts it separately now.

---

## Pending

- `inside-the-iep.html` now carries substantial legal material — stay put and
  pendency, educational records, the consequences of keeping a child out of
  school, and the right to request a functional behavioral assessment. It is
  deliberately hedged with "generally", "across the US", "varies by state", and
  closes by pointing to state parent training and information centers with a
  note that none of it is legal advice. **Any edit here must keep that hedging.**
- `terms-and-privacy.html` has bracketed placeholders and a yellow
  remove-before-publishing block. **Needs attorney review.**
- Recommended: LLC formation, media liability insurance, and checking whether an
  existing professional policy excludes publishing.
- Practitioner blocks on therapy pages are placeholders pending written
  permission.
- A few library links on the SLP and feeding pages are still `href="#"`.
- **Plain-language versions of core pages** — the biggest remaining
  accessibility gap.
- `mockup.html` is unlinked and safe to delete.
- Analytics: GitHub's repo Insights → Traffic gives free 14-day stats with no
  code. GoatCounter is the privacy-respecting option if more is wanted later.

---

## Deployment

1. Upload the most recent versioned zip — each is a complete snapshot.
2. On GitHub: **Add file → Upload files → "choose your files"**. Do not drag.
3. Scroll past the file list to the green **Commit changes** button.
4. Verify: the home page carries only six cards; the full directory is `all-pages.html`.
5. Hard refresh: Cmd+Shift+R or Ctrl+Shift+F5.

`ERR_FILE_NOT_FOUND` means a local file is open, not the website.

---

## Language and privacy, precisely

The **Language** button offers ~107 languages. It recommends the browser's own
translation *first*, because that adds no third party. The in-page translator
loads a Google script **only when a language is chosen** — verified in testing
that nothing loads otherwise. Right-to-left languages flip page direction. The
privacy policy names this as the single exception and says it does nothing
unless chosen.

If you add anything that loads an external script, **the privacy policy must be
updated in the same change.**
