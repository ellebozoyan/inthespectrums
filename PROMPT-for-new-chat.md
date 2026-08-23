# Prompt for a new chat

Copy the text below into a new conversation, and attach **both**:

- `inthespectrums-v55-COMPLETE-aug18.zip`
- `HANDOVER.md`

---

I'm continuing work on **In The Spectrums** (inthespectrums.com), a free resource
site I've built for families of children with complex needs. It's live at
https://ellebozoyan.github.io/inthespectrums/

I've attached the complete site and a handover document. **Please read
HANDOVER.md first** — it covers the architecture, the editorial voice, the rules
that can't be broken, the known traps, and the build workflow. It's short.

The essentials, so you have them immediately:

- **52 pages and 12 interactive tools.** No server, no accounts, no analytics.
  Everything runs in the browser and nothing families type is ever transmitted.
- **Nothing about my own family appears on the site, ever.** My experience
  informs the content; it never appears in it. If I share personal documents or
  details, use the general principle and discard the specifics.
- **The voice is warm but unsentimental.** Not hokey. It names contested
  evidence as contested, offers options with reasoning rather than directives,
  and ends on the reader's competence.
- **American English. Person-first language. No doses on the supplements page.**

Two things I'd like you to do every time, without being asked:

1. **Run `python3 check-site.py` before telling me anything is finished.** It
   must print ALL CLEAR. It catches broken links, unbalanced tags, JavaScript
   errors, escape sequences leaking into text, British spellings, and missing
   summaries. It has caught real bugs repeatedly.
2. **Run `python3 build-search.py`** after any content change, and run the
   relevant test suites in `tests/`.

I'd also rather you **tell me when something is a bad idea, or when a bug was
your own mistake**, than smooth it over. That's been the most useful part of
this build.

Today I'd like to work on:

[ describe what you want here ]

---

## Shorter version, if you prefer

I'm continuing work on In The Spectrums, a free resource site for families of
children with complex needs. The complete site and a handover document are
attached — please read **HANDOVER.md** first, then run `check-site.py` to
confirm everything is intact before we start.

Two standing rules: nothing about my own family goes on the site, and
`check-site.py` must print ALL CLEAR before you tell me anything is done.

Today I'd like to: [ describe what you want here ]
