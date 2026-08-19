/* In The Spectrums — site navigation, footer, table of contents, back-to-top.
   Drop this file in the same folder as the pages, then add ONE line before </body>
   on every page:   <script src="site-nav.js"></script>
   Everything below is self-contained. No libraries, no build step. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. THE SITE MAP — edit here and every page updates at once.
     --------------------------------------------------------------- */
  var GROUPS = [
    { label: 'Start here', items: [
      ['spectrums.html',               'What we mean by spectrums','The name is plural \u2014 and what progress actually looks like'],
      ['what-to-do-first.html',        'What to do first',        'The first 90 days, and the scripts that start legal clocks'],
      ['care-team-map.html',           'The care team map',       'Forty-five specialties — who does what, and why you\u2019d call them'],
      ['conditions-library.html',      'The conditions library',  'Thirty-three conditions, how widely each varies, what helps'],
      ['whole-picture.html',           'The whole picture',       'When one diagnosis isn\u2019t the whole story \u2014 and how to see the rest']
    ]},
    { label: 'School and services', items: [
      ['inside-the-iep.html',          'Inside the IEP',          'Reading a goal, the words that matter, the section you write'],
      ['accommodations-finder.html',   'Accommodations finder',   'Search by the difficulty you see, get wording you can request'],
      ['programs-and-entitlements.html','Programs and entitlements','What exists, when each door opens, the ages that matter']
    ]},
    { label: 'Adult life', items: [
      ['adult-life.html',              'After school ends',       'The cliff, decision-making, trusts and wills, and what to do when'],
      ['adult-benefits.html',          'Benefits and working',    'SSI, SSDI, Medicaid, and why working rarely costs you'],
      ['adult-housing.html',           'Housing for an adult',    'Vouchers, waiting lists, and buying a place for someone'],
      ['adult-providers.html',         'Finding and vetting providers','What to ask before someone lives there, and how to keep watch'],
      ['your-own-life.html',           'Your own life',           'Written for the adult rather than the parent']
    ]},
    { label: 'Money, paperwork and tracking', items: [
      ['paying-for-therapy.html',      'Paying for it',           'In-network vs out, the annotated superbill, appeals'],
      ['template-builders.html',       'Template builders',       'Four documents that build themselves as you type'],
      ['symptom-tracker.html',         'The symptom tracker',     'Log what changed today, print a summary before the appointment'],
      ['goals-tracker.html',           'Goals and generalization','Every provider\u2019s goals in one place, and which ones should travel'],
      ['share-builder.html',           'The share builder',       'Assemble a packet for one person \u2014 you tick exactly what goes in'],
      ['using-these-tools.html',       'Using these tools',       'Saving to your home screen, printing to PDF, and backing up']
    ]},
    { label: 'Safety and health', items: [
      ['safety.html',                  'Safety',                  'Water, wandering, responders, body autonomy, equipment'],
      ['injuries-and-illness.html',    'When something happens',  'Where to go now, hospitals, and a serious diagnosis']
    ]},
    { label: 'Therapies', items: [
      ['occupational-therapy.html',    'Occupational therapy',    'The whole day is the treatment'],
      ['physical-therapy.html',        'Physical therapy',        'Not normal movement \u2014 more life'],
      ['speech-language-aac.html',     'Speech, language and AAC','What communication is actually for'],
      ['feeding-therapy.html',         'Feeding therapy',         'ARFID, demand avoidance, and declarative language'],
      ['aquatic-therapy.html',         'Aquatic therapy',         'A different set of physics'],
      ['myofunctional-therapy.html',   'Myofunctional therapy',   'Breathing, sleeping, eating, drinking, speaking'],
      ['floortime.html',               'Floortime and child-led', 'Circles of communication, and how they grow up'],
      ['music.html',                   'Music',                   'The thing that gets in everywhere']
    ]},
    { label: 'Learning, attention and mood', items: [
      ['learning-and-literacy.html',   'Learning and literacy',   'Dyslexia, dysgraphia, dyscalculia \u2014 and what reading instruction should look like'],
      ['adhd-executive-function.html', 'ADHD and executive function','The gap between knowing and doing, and how to close it'],
      ['anxiety-and-ocd.html',         'Anxiety, OCD and school refusal','The accommodation loop, and the treatment that works']
    ]},
    { label: 'Behavior', items: [
      ['behavior.html',                'Behavior is communication','What a behavior is saying, and what it costs on the inside'],
      ['de-escalation.html',           'In the moment',           'Precursors, de-escalation, calming and processing'],
      ['behavior-support.html',        'Choosing behavior support','The ABA conversation, and building one team']
    ]},
    { label: 'The child', items: [
      ['their-own-voice.html',         'Their own voice',         'Talking with a child about their own life'],
      ['adaptive-community.html',      'Adaptive sports and community','Programs, days out, parking and travel'],
      ['maplewood-stories.html',       'The Maplewood stories',   'Fifty-two picture books about ten friends']
    ]},
    { label: 'About', items: [
      ['about.html',                   'About and contributors',  'Who writes this, and how to tell us what\u2019s wrong'],
      ['terms-and-privacy.html',       'Terms, privacy and disclaimers','What this site is, what it isn\u2019t, and what it collects (nothing)']
    ]}
  ];

  var HOME = 'index.html';
  var here = (location.pathname.split('/').pop() || HOME).toLowerCase();

  /* ---------------------------------------------------------------
     2. STYLES
     --------------------------------------------------------------- */
  var css = [
    ':root{--nv-ink:#16283C;--nv-soft:#4A5C6E;--nv-forest:#2E4E3F;--nv-rust:#9C4A21;',
    '--nv-ground:#F1F4F0;--nv-card:#FCFCFA;--nv-line:#D6DDD5;',
    '--nv-sans:"Helvetica Neue",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;',
    '--nv-serif:Georgia,"Times New Roman",serif}',
    'body{padding-top:0}',

    /* header */
    '.nv-bar{position:sticky;top:0;z-index:900;background:rgba(252,252,250,.97);',
    'backdrop-filter:saturate(140%) blur(6px);border-bottom:1px solid var(--nv-line)}',
    '.nv-in{max-width:1040px;margin:0 auto;padding:0 22px;min-height:56px;display:flex;',
    'align-items:center;justify-content:space-between;gap:16px}',
    '.nv-logo{font-family:var(--nv-serif);font-size:1.05rem;color:var(--nv-ink);text-decoration:none;',
    'letter-spacing:-.01em;white-space:nowrap}',
    '.nv-logo em{font-style:italic;color:var(--nv-forest)}',
    /* section menubar — wraps to a second row rather than hiding anything */
    '.nv-menu{max-width:1040px;margin:0 auto;padding:0 22px 9px;display:flex;flex-wrap:wrap;',
    'gap:3px 4px;font-family:var(--nv-sans);font-size:12.5px;align-items:center}',
    '.nv-mb,.nv-mone{font-family:inherit;font-size:inherit;background:none;border:1px solid transparent;',
    'border-radius:2px;padding:6px 9px;cursor:pointer;color:var(--nv-soft);letter-spacing:.02em;',
    'white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;line-height:1.2}',
    '.nv-mb:hover,.nv-mone:hover{color:var(--nv-rust);border-color:var(--nv-line);background:var(--nv-card)}',
    '.nv-mb:focus-visible,.nv-mone:focus-visible{outline:2px solid var(--nv-rust);outline-offset:1px}',
    '.nv-mb[data-here="1"],.nv-mone[aria-current]{color:var(--nv-rust);font-weight:700}',
    '.nv-mb b{display:block;width:0;height:0;border-left:3.5px solid transparent;',
    'border-right:3.5px solid transparent;border-top:4px solid currentColor;opacity:.6;',
    'transition:transform .16s}',
    '.nv-m{position:relative}',
    '.nv-m.open>.nv-mb{color:var(--nv-rust);border-color:var(--nv-line);background:var(--nv-card)}',
    '.nv-m.open>.nv-mb b{transform:rotate(180deg)}',
    '.nv-mp{position:absolute;top:calc(100% + 4px);left:0;z-index:920;min-width:264px;',
    'max-width:min(340px,86vw);background:var(--nv-card);border:1px solid var(--nv-line);',
    'border-radius:2px;box-shadow:0 14px 34px -18px rgba(22,40,60,.55);padding:5px;',
    'display:none}',
    '.nv-m.open>.nv-mp{display:block}',
    '.nv-mp a{display:block;padding:8px 10px;text-decoration:none;color:var(--nv-ink);border-radius:2px}',
    '.nv-mp a:hover{background:var(--nv-ground)}',
    '.nv-mp a:focus-visible{outline:2px solid var(--nv-rust);outline-offset:-2px}',
    '.nv-mp a strong{display:block;font-weight:400;font-size:13px;line-height:1.3}',
    '.nv-mp a small{display:block;font-size:11.5px;color:var(--nv-soft);line-height:1.4;margin-top:2px}',
    '.nv-mp a[aria-current] strong{color:var(--nv-rust);font-weight:700}',
    /* right-hand menus open leftwards so they do not run off the page */
    '.nv-m:nth-last-child(-n+3)>.nv-mp{left:auto;right:0}',
    '@media(max-width:840px){.nv-menu{display:none}}',
    '@media print{.nv-menu{display:none}}',
    '.nv-burger{display:flex;align-items:center;gap:8px;background:none;border:1px solid var(--nv-line);',
    'border-radius:2px;padding:7px 12px;cursor:pointer;font-family:var(--nv-sans);font-size:12.5px;',
    'color:var(--nv-ink);letter-spacing:.04em}',
    '.nv-burger:hover{border-color:var(--nv-rust);color:var(--nv-rust)}',
    '.nv-burger:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',
    '.nv-burger i{display:block;width:15px;height:9px;border-top:1.5px solid currentColor;',
    'border-bottom:1.5px solid currentColor;position:relative}',
    '.nv-burger i::after{content:"";position:absolute;top:3px;left:0;right:0;height:1.5px;background:currentColor}',

    /* drawer */
    '.nv-scrim{position:fixed;inset:0;background:rgba(22,40,60,.45);z-index:940;opacity:0;',
    'visibility:hidden;transition:opacity .2s}',
    '.nv-scrim.on{opacity:1;visibility:visible}',
    '.nv-drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,90vw);background:var(--nv-ground);',
    'z-index:950;overflow-y:auto;transform:translateX(100%);transition:transform .26s cubic-bezier(.2,.7,.3,1);',
    'box-shadow:-14px 0 40px -20px rgba(22,40,60,.6)}',
    '.nv-drawer.on{transform:translateX(0)}',
    '.nv-dtop{position:sticky;top:0;background:var(--nv-ground);display:flex;align-items:center;',
    'justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--nv-line)}',
    '.nv-dtop span{font-family:var(--nv-sans);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;',
    'color:var(--nv-rust);font-weight:700}',
    '.nv-x{background:none;border:none;font-size:26px;line-height:1;cursor:pointer;color:var(--nv-ink);padding:0 4px}',
    '.nv-x:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',
    '.nv-dbody{padding:8px 22px 60px}',
    '.nv-grp{border-bottom:1px solid var(--nv-line)}',
    '.nv-gbtn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;',
    'background:none;border:none;padding:15px 0;cursor:pointer;font-family:var(--nv-sans);font-size:12px;',
    'letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--nv-forest);text-align:left}',
    '.nv-gbtn:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',
    '.nv-gbtn b{font-size:16px;color:var(--nv-rust);font-weight:400;transition:transform .2s}',
    '.nv-grp.open .nv-gbtn b{transform:rotate(45deg)}',
    '.nv-list{display:none;padding:0 0 12px}',
    '.nv-grp.open .nv-list{display:block}',
    '.nv-list a{display:block;padding:10px 0 11px;text-decoration:none;border-top:1px solid #E7EBE5}',
    '.nv-list a:first-child{border-top:none}',
    '.nv-list strong{display:block;font-family:var(--nv-serif);font-size:1rem;font-weight:400;',
    'color:var(--nv-ink);margin-bottom:2px}',
    '.nv-list small{display:block;font-family:var(--nv-serif);font-size:.85rem;color:var(--nv-soft);line-height:1.4}',
    '.nv-list a:hover strong,.nv-list a[aria-current] strong{color:var(--nv-rust)}',
    '.nv-list a[aria-current] strong::after{content:" \\2022 you are here";font-family:var(--nv-sans);',
    'font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--nv-rust)}',
    '.nv-list a:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',

    /* table of contents */
    '.nv-toc{max-width:1040px;margin:0 auto 34px;padding:0 22px}',
    '.nv-toc div{background:var(--nv-card);border:1px solid var(--nv-line);border-radius:2px;padding:16px 20px}',
    '.nv-toc button{width:100%;display:flex;align-items:center;justify-content:space-between;background:none;',
    'border:none;padding:0;cursor:pointer;font-family:var(--nv-sans);font-size:11px;letter-spacing:.17em;',
    'text-transform:uppercase;font-weight:700;color:var(--nv-forest);text-align:left}',
    '.nv-toc button:focus-visible{outline:2px solid var(--nv-rust);outline-offset:3px}',
    '.nv-toc button b{font-size:15px;color:var(--nv-rust);font-weight:400}',
    '.nv-toc ol{display:none;list-style:none;margin:14px 0 0;padding:0;columns:2;column-gap:28px}',
    '.nv-toc.open ol{display:block}',
    '@media(max-width:640px){.nv-toc ol{columns:1}}',
    '.nv-toc li{break-inside:avoid;margin-bottom:8px}',
    '.nv-toc a{font-family:var(--nv-serif);font-size:.95rem;color:var(--nv-ink);text-decoration:none;',
    'border-bottom:1px solid transparent}',
    '.nv-toc a:hover{color:var(--nv-rust);border-bottom-color:var(--nv-rust)}',

    /* back to top */
    '.nv-top{position:fixed;right:20px;bottom:20px;z-index:800;background:var(--nv-ink);color:#F5F1EA;',
    'border:none;border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:17px;line-height:1;',
    'opacity:0;visibility:hidden;transition:opacity .2s;box-shadow:0 4px 14px -6px rgba(22,40,60,.7)}',
    '.nv-top.on{opacity:.92;visibility:visible}',
    '.nv-top:hover{opacity:1;background:var(--nv-rust)}',
    '.nv-top:focus-visible{outline:2px solid var(--nv-rust);outline-offset:3px}',

    /* footer */
    '.nv-foot{background:var(--nv-ink);color:#CBD3C7;margin-top:60px;',
    'font-family:var(--nv-sans);font-size:13px;line-height:1.7}',
    '.nv-fin{max-width:1040px;margin:0 auto;padding:44px 22px 54px}',
    '.nv-fbrand{font-family:var(--nv-serif);font-size:1.25rem;color:#EFEBE3;margin:0 0 8px}',
    '.nv-fbrand em{font-style:italic;color:#C6A98F}',
    '.nv-ftag{max-width:46ch;margin:0 0 34px;color:#9FAE9C;font-family:var(--nv-serif);font-size:.98rem}',
    '.nv-fgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:28px 26px}',
    '.nv-fcol h4{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#C6A98F;',
    'font-weight:700;margin:0 0 12px}',
    '.nv-fcol a{display:block;color:#CBD3C7;text-decoration:none;padding:5px 0;font-size:13px}',
    '.nv-fcol a:hover{color:#fff;text-decoration:underline}',
    '.nv-fend{border-top:1px solid rgba(255,255,255,.15);margin-top:36px;padding-top:22px;',
    'font-size:11.5px;color:#8A9A88;line-height:1.75}',
    '@media print{.nv-bar,.nv-top,.nv-drawer,.nv-scrim,.nv-foot,.nv-toc button{display:none!important}',
    '.nv-toc ol{display:block!important;columns:1}}',
    '@media(prefers-reduced-motion:reduce){*{transition:none!important}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* ---------------------------------------------------------------
     3. HEADER
     --------------------------------------------------------------- */
  /* Short labels for the header strip. The long label stays in the drawer and
     the breadcrumb; these only have to survive being read sideways at speed. */
  var BARLABEL = {
    'Start here':                    'Start here',
    'School and services':           'School',
    'Money, paperwork and tracking': 'Money & paperwork',
    'Safety and health':             'Safety',
    'Therapies':                     'Therapies',
    'Learning, attention and mood':  'Learning & mood',
    'Behavior':                      'Behavior',
    'The child':                     'The child',
    'About':                         'About'
  };

  var qHtml = GROUPS.map(function (g, i) {
    var isHere = g.items.some(function (it) { return it[0] === here; });
    var label = esc(BARLABEL[g.label] || g.label);

    /* A section with one page is a link, not a menu. Nothing to choose between. */
    if (g.items.length === 1) {
      return '<a class="nv-mone" href="' + g.items[0][0] + '"' +
             (isHere ? ' aria-current="page"' : '') + '>' + label + '</a>';
    }

    var links = g.items.map(function (it) {
      return '<a role="menuitem" href="' + it[0] + '"' +
             (it[0] === here ? ' aria-current="page"' : '') + '>' +
             '<strong>' + esc(it[1]) + '</strong><small>' + esc(it[2]) + '</small></a>';
    }).join('');

    return '<div class="nv-m" data-m="' + i + '">' +
             '<button class="nv-mb" type="button" aria-expanded="false" aria-haspopup="true" ' +
             'aria-controls="nvM' + i + '"' + (isHere ? ' data-here="1"' : '') + '>' +
               label + '<b aria-hidden="true"></b></button>' +
             '<div class="nv-mp" id="nvM' + i + '" role="menu" aria-label="' + label + '">' +
               links +
             '</div>' +
           '</div>';
  }).join('');

  var bar = el('div', 'nv-bar');
  bar.innerHTML =
    '<div class="nv-in">' +
      '<a class="nv-logo" href="' + HOME + '">In The <em>Spectrums</em></a>' +
      '<button class="nv-burger" id="nvOpen" aria-expanded="false" aria-controls="nvDrawer">' +
        '<i aria-hidden="true"></i>All pages</button>' +
    '</div>' +
    '<nav class="nv-menu" aria-label="Sections">' + qHtml + '</nav>';
  document.body.insertBefore(bar, document.body.firstChild);

  /* --- dropdown behaviour: click to open, one at a time, Escape closes --- */
  (function () {
    var menus = [].slice.call(bar.querySelectorAll('.nv-m'));
    if (!menus.length) return;

    function closeAll(except) {
      menus.forEach(function (m) {
        if (m === except) return;
        m.classList.remove('open');
        m.querySelector('.nv-mb').setAttribute('aria-expanded', 'false');
      });
    }

    menus.forEach(function (m) {
      var btn = m.querySelector('.nv-mb');
      var panel = m.querySelector('.nv-mp');

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !m.classList.contains('open');
        closeAll(m);
        m.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      /* Arrow down from the button walks into the list. */
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'Down') {
          e.preventDefault();
          closeAll(m);
          m.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          var first = panel.querySelector('a');
          if (first) first.focus();
        }
      });

      panel.addEventListener('keydown', function (e) {
        var items = [].slice.call(panel.querySelectorAll('a'));
        var i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown' || e.key === 'Down') {
          e.preventDefault(); if (items[i + 1]) items[i + 1].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'Up') {
          e.preventDefault();
          if (i > 0) items[i - 1].focus(); else btn.focus();
        }
      });
    });

    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        var open = bar.querySelector('.nv-m.open');
        if (open) { var b = open.querySelector('.nv-mb'); closeAll(null); b.focus(); }
      }
    });
    /* Leaving the section entirely with the keyboard closes it behind you. */
    bar.addEventListener('focusout', function (e) {
      if (!bar.contains(e.relatedTarget)) closeAll(null);
    });
  })();

  /* ---------------------------------------------------------------
     4. DRAWER
     --------------------------------------------------------------- */
  var scrim = el('div', 'nv-scrim');
  var drawer = el('nav', 'nv-drawer');
  drawer.id = 'nvDrawer';
  drawer.setAttribute('aria-label', 'All pages');
  drawer.setAttribute('aria-hidden', 'true');

  var groupsHtml = GROUPS.map(function (g) {
    var isHere = g.items.some(function (it) { return it[0] === here; });
    var links = g.items.map(function (it) {
      return '<a href="' + it[0] + '"' + (it[0] === here ? ' aria-current="page"' : '') + '>' +
             '<strong>' + esc(it[1]) + '</strong><small>' + esc(it[2]) + '</small></a>';
    }).join('');
    return '<div class="nv-grp' + (isHere ? ' open' : '') + '">' +
             '<button class="nv-gbtn" aria-expanded="' + (isHere ? 'true' : 'false') + '">' +
               esc(g.label) + '<b aria-hidden="true">+</b></button>' +
             '<div class="nv-list">' + links + '</div>' +
           '</div>';
  }).join('');

  drawer.innerHTML =
    '<div class="nv-dtop"><span>All pages</span>' +
      '<button class="nv-x" id="nvClose" aria-label="Close menu">&times;</button></div>' +
    '<div class="nv-dbody">' +
      '<div class="nv-grp"><button class="nv-gbtn" style="color:var(--nv-rust)" ' +
      'onclick="location.href=\'' + HOME + '\'">Home<b aria-hidden="true">\u2192</b></button></div>' +
      groupsHtml + '</div>';

  document.body.appendChild(scrim);
  document.body.appendChild(drawer);

  var openBtn = document.getElementById('nvOpen');
  var closeBtn = document.getElementById('nvClose');
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add('on'); scrim.classList.add('on');
    drawer.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeDrawer() {
    drawer.classList.remove('on'); scrim.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('on')) closeDrawer();
  });
  drawer.querySelectorAll('.nv-gbtn').forEach(function (b) {
    if (b.getAttribute('onclick')) return;
    b.addEventListener('click', function () {
      var g = b.parentNode, open = g.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------------------------------------------------------------
     5. TABLE OF CONTENTS (auto-built from h2.sec)
     --------------------------------------------------------------- */
  var heads = Array.prototype.slice.call(document.querySelectorAll('h2.sec'));
  if (heads.length >= 4) {
    var items = heads.map(function (h, i) {
      if (!h.id) h.id = 'sec-' + (i + 1);
      h.style.scrollMarginTop = '76px';
      return '<li><a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
    }).join('');
    var toc = el('div', 'nv-toc');
    toc.innerHTML = '<div><button aria-expanded="false">On this page \u2014 ' + heads.length +
      ' sections<b aria-hidden="true">+</b></button><ol>' + items + '</ol></div>';
    var anchor = document.querySelector('header') || document.querySelector('section');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(toc, anchor.nextSibling);
    var tb = toc.querySelector('button');
    tb.addEventListener('click', function () {
      var open = toc.classList.toggle('open');
      tb.setAttribute('aria-expanded', String(open));
      tb.querySelector('b').textContent = open ? '\u2212' : '+';
    });
  }

  /* ---------------------------------------------------------------
     6. BACK TO TOP
     --------------------------------------------------------------- */
  var top = el('button', 'nv-top', '\u2191');
  top.setAttribute('aria-label', 'Back to top');
  top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(top);
  window.addEventListener('scroll', function () {
    top.classList.toggle('on', window.scrollY > 700);
  }, { passive: true });

  /* ---------------------------------------------------------------
     7. FOOTER
     --------------------------------------------------------------- */
  var cols = GROUPS.map(function (g) {
    return '<div class="nv-fcol"><h4>' + esc(g.label) + '</h4>' +
      g.items.map(function (it) {
        return '<a href="' + it[0] + '">' + esc(it[1]) + '</a>';
      }).join('') + '</div>';
  }).join('');

  var foot = el('div', 'nv-foot');
  foot.innerHTML =
    '<div class="nv-fin">' +
      '<p class="nv-fbrand">In The <em>Spectrums</em></p>' +
      '<p class="nv-ftag">A free field guide for anyone raising, teaching, or caring for a child ' +
        'who needs more than the standard version of things.</p>' +
      '<div class="nv-fgrid">' + cols + '</div>' +
      '<p class="nv-fend">Free \u00b7 No login \u00b7 No ads \u00b7 Nothing sold \u00b7 Take it and adapt it.<br>' +
        '<a href="terms-and-privacy.html" style="color:#C6A98F">Terms, privacy and disclaimers</a><br>' +
        'Nothing on this site is medical, legal, financial, or educational advice. ' +
        'Verify anything that matters with the professionals who have met your child.</p>' +
    '</div>';
  document.body.appendChild(foot);
})();

/* ===================================================================
   8. ICONS — a mark for every router card and every section heading.
   Two-tone line drawings: .a = rust accent, everything else = muted ink.
   Edit ICONS to change a drawing; edit CARD_ICONS / HEAD_RULES to
   change which drawing appears where.
   =================================================================== */
(function () {
  'use strict';

  var iconCss = [
    '.nv-ic{flex:0 0 auto;display:block}',
    '.nv-ic path,.nv-ic circle,.nv-ic rect,.nv-ic line,.nv-ic polyline{',
    'fill:none;stroke:#5C6E7E;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.nv-ic .a{stroke:#9C4A21;stroke-width:1.9}',
    '.nv-ic .f{fill:#9C4A21;stroke:none}',
    '.nv-ic .fm{fill:#5C6E7E;stroke:none}',
    /* router card gets a two-column layout with the icon on the left */
    '.sit{grid-template-columns:34px minmax(0,1fr) auto!important;gap:14px!important;align-items:center}',
    '@media(max-width:560px){.sit{grid-template-columns:28px minmax(0,1fr)!important;',
    'grid-template-rows:auto auto;row-gap:8px}.sit .go{grid-column:2}}',
    /* section headings */
    'h2.sec{display:flex;align-items:flex-start;gap:13px}',
    'h2.sec .nv-ic{margin-top:.32em}',
    '@media(max-width:520px){h2.sec{gap:10px}}',
    '@media print{.nv-ic .a{stroke:#000}.nv-ic path,.nv-ic circle,.nv-ic rect,.nv-ic line{stroke:#444}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = iconCss;
  document.head.appendChild(st);

  var ICONS = {
    /* --- uncertainty, seeking, orientation --- */
    signal:   '<circle cx="12" cy="17" r="1.6" class="f"/><path class="a" d="M8 13a5.5 5.5 0 0 1 8 0"/><path d="M5 10a10 10 0 0 1 14 0"/>',
    fork:     '<path d="M12 21v-6"/><path class="a" d="M12 15 5 8V4"/><path d="m12 15 7-7V4"/>',
    compass:  '<circle cx="12" cy="12" r="8.5"/><path class="a" d="m15 9-2.2 5.2L7.6 16l2.2-5.2z"/>',
    door:     '<path d="M6 21V4h9v17"/><path class="a" d="M15 12h5m-2.5-2.5L20 12l-2.5 2.5"/>',
    doorout:  '<path d="M13 21H5V3h8"/><path class="a" d="M11 12h9m-2.5-3L21 12l-3.5 3"/>',
    doorshut: '<rect x="5" y="3" width="14" height="18" rx="1"/><path class="a" d="m9 9 6 6m0-6-6 6"/>',
    /* --- time, waiting, growth --- */
    clock:    '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M12 7.5V12l3.5 2"/>',
    hourglass:'<path d="M7 3h10M7 21h10"/><path d="M7 3c0 5 5 6 5 9s-5 4-5 9"/><path d="M17 3c0 5-5 6-5 9s5 4 5 9"/><path class="a" d="M9.5 18h5"/>',
    steps:    '<path class="a" d="M4 20h4v-4"/><path d="M10 16h4v-4m2 0h4V8"/>',
    growth:   '<path d="M4 20h16"/><rect x="6" y="14" width="3" height="6"/><rect x="11" y="10" width="3" height="10"/><rect class="a" x="16" y="5" width="3" height="15"/>',
    cliff:    '<path d="M3 9h7v12"/><path class="a" d="M14 15h7"/><path d="M21 15v6"/><path class="a" d="M10 12h4" stroke-dasharray="1.5 2"/>',
    /* --- people, teams, connection --- */
    node:     '<circle cx="12" cy="5" r="2.4" class="a"/><path d="M12 7.4V11m0 0H6v4m6-4h6v4m-6-4v4"/><circle cx="6" cy="17" r="2"/><circle cx="12" cy="17" r="2"/><circle cx="18" cy="17" r="2"/>',
    team:     '<circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><circle class="a" cx="12" cy="16" r="2.6"/><path d="M8 10.6v1.9M16 10.6v1.9"/>',
    outside:  '<circle cx="8" cy="9" r="2.4"/><circle cx="14" cy="9" r="2.4"/><circle cx="11" cy="15" r="2.4"/><circle class="a" cx="19.5" cy="18.5" r="2.4" stroke-dasharray="2 2"/>',
    hands:    '<path d="M9 20V9.5a1.5 1.5 0 0 1 3 0V13"/><path class="a" d="M12 12.5V8a1.5 1.5 0 0 1 3 0v6"/><path d="M15 11.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-9 3l-3-4"/>',
    child:    '<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/><path class="a" d="M12 13v4"/>',
    /* --- talk, language, devices --- */
    bubble:   '<path d="M20 14a3 3 0 0 1-3 3H9l-4 3v-3.5A3 3 0 0 1 4 14V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/><path class="a" d="M9 10.5h6"/>',
    bubbleq:  '<path d="M20 14a3 3 0 0 1-3 3H9l-4 3v-3.5A3 3 0 0 1 4 14V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/><path class="a" d="M10.3 8.6a1.9 1.9 0 0 1 3.4 1.1c0 1.3-1.7 1.5-1.7 2.6"/><circle class="f" cx="12" cy="14.4" r=".85"/>',
    twobub:   '<path d="M3.5 12a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H8l-3 2.5V16a3 3 0 0 1-1.5-3z"/><path class="a" d="M15 4h4.5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-.5" stroke-dasharray="2.2 2.2"/>',
    device:   '<rect class="a" x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9.5h2m4 0h2M8 14.5h8"/>',
    deviceoff:'<rect x="4" y="5" width="16" height="14" rx="2" stroke-dasharray="2.5 2.5"/><path class="a" d="m9 10 6 4m0-4-6 4"/>',
    note:     '<path class="a" d="M9 18V6l9-2v12"/><circle class="a" cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/>',
    wave:     '<path d="M3 12h2.5"/><path class="a" d="M7 12c1-6 2.2-6 3.2 0s2.2 6 3.2 0"/><path d="M14.4 12c.8-3 1.6-3 2.4 0M18.5 12H21"/>',
    /* --- documents, money, admin --- */
    doc:      '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path class="a" d="M9 12h6m-6 4h4"/>',
    docx:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path class="a" d="m9.5 12.5 5 5m0-5-5 5"/>',
    docstack: '<path d="M8 2h6l4 4v12H8z"/><path class="a" d="M5 6v14h11"/><path d="M14 2v4h4"/>',
    docheart: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path class="a" d="M12 17s-2.6-1.7-2.6-3.3A1.6 1.6 0 0 1 12 12.6a1.6 1.6 0 0 1 2.6 1.1C14.6 15.3 12 17 12 17z"/>',
    money:    '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.6h-3a1.8 1.8 0 0 0 0 3.6h4"/>',
    search:   '<circle cx="10.5" cy="10.5" r="6"/><path class="a" d="m15 15 5 5"/>',
    searchlist:'<path d="M4 6h8M4 10h6M4 14h4"/><circle class="a" cx="15.5" cy="14.5" r="4"/><path class="a" d="m18.5 17.5 2.5 2.5"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M8 3v4m8-4v4"/><rect class="f" x="14" y="13" width="3" height="3" rx=".6"/>',
    check:    '<circle cx="12" cy="12" r="8.5"/><path class="a" d="m8.2 12.2 2.6 2.6 5-5.4"/>',
    /* --- home, safety, medical --- */
    home:     '<path d="M4 11 12 4l8 7v9H4z"/><path class="a" d="M9.5 20v-5.5h5V20"/>',
    layers:   '<path d="M4 7h5m2 0h9"/><path class="a" d="M4 12h9m2 0h5"/><path d="M4 17h3m2 0h11"/>',
    shield:   '<path d="M12 3 5 6v6c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/><path class="a" d="m9 12 2.2 2.2L15.5 10"/>',
    cross:    '<rect x="3.5" y="8.5" width="17" height="7" rx="1.5"/><rect class="a" x="8.5" y="3.5" width="7" height="17" rx="1.5"/>',
    siren:    '<path class="a" d="M6 18a6 6 0 0 1 12 0z"/><path d="M4 21h16M12 5v2M6.5 7 8 8.4M17.5 7 16 8.4"/>',
    water:    '<path class="a" d="M3 9c3-2.4 5.2 2.4 8.2 0S16.2 6.6 21 9"/><path d="M3 14c3-2.4 5.2 2.4 8.2 0S16.2 11.6 21 14"/><path d="M3 19c3-2.4 5.2 2.4 8.2 0S16.2 16.6 21 19"/>',
    /* --- body, movement, food, sleep --- */
    walk:     '<circle cx="13" cy="4.5" r="2"/><path class="a" d="m13 8-2.5 5 3 2.5 1 5.5"/><path d="m10.5 13-3 3-.5 4M15.5 9 19 11"/>',
    wheel:    '<circle class="a" cx="11" cy="16.5" r="4.5"/><path d="M11 12V7h4"/><circle cx="15.5" cy="5" r="1.8"/><path d="M11 16.5h5.5l2 4"/>',
    plate:    '<circle cx="12" cy="12" r="8.5"/><circle class="a" cx="12" cy="12" r="4"/>',
    plateless:'<circle cx="12" cy="12" r="8.5"/><circle class="f" cx="9" cy="10" r="1.1"/><circle class="f" cx="14" cy="10.5" r="1.1"/><circle class="fm" cx="11" cy="14.5" r="1.1"/>',
    moon:     '<path d="M20 14.5A8.5 8.5 0 1 1 10 4a6.8 6.8 0 0 0 10 10.5z"/><path class="a" d="M4 20c1.5-1 2.5 1 4 0" stroke-dasharray="0"/>',
    breath:   '<path class="a" d="M5 8h7a3 3 0 1 0-3-3"/><path d="M5 12h11a3 3 0 1 1-3 3"/><path d="M5 16h6"/>',
    /* --- learning, books, play --- */
    book:     '<path d="M12 6v14"/><path d="M12 6C9.5 3.8 6.5 3.8 4 5v13c2.5-1.2 5.5-1.2 8 1"/><path class="a" d="M12 6c2.5-2.2 5.5-2.2 8-1v13c-2.5-1.2-5.5-1.2-8 1"/>',
    circles:  '<circle cx="9.5" cy="12" r="5.5"/><circle class="a" cx="14.5" cy="12" r="5.5"/>',
    grid:     '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect class="a" x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
    map:      '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path class="a" d="M9 4v14m6-12v14"/>',
    scale:    '<path d="M12 4v16M6 20h12"/><path class="a" d="M4 9h16M6.5 9 4 14h5zM17.5 9 15 14h5z"/>'
  };

  function svg(name, size) {
    var d = ICONS[name];
    if (!d) return '';
    return '<svg class="nv-ic" width="' + size + '" height="' + size +
           '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + d + '</svg>';
  }

  /* --- 35 router cards, in page order --- */
  var CARD_ICONS = [
    'signal','hourglass','node','bubbleq','calendar','searchlist','docx','door',
    'doorout','child','bubble','docstack','cross','moon','clock','scale',
    'walk','wheel','deviceoff','twobub','plateless','plate','circles','growth',
    'note','wave','water','team','doorshut','book','cliff','docstack',
    'fork','compass','docheart'
  ];

  var cards = document.querySelectorAll('.sit');
  if (cards.length) {
    cards.forEach(function (c, i) {
      var n = CARD_ICONS[i] || 'signal';
      c.insertAdjacentHTML('afterbegin', svg(n, 30));
    });
  }

  /* --- section headings, matched on keywords (first match wins) --- */
  var HEAD_RULES = [
    [/verification call|phone|call, on one|worksheet/i,'check'],
    [/tell us|missing or wrong|feedback|corrections/i, 'twobub'],
    [/related pages|from our librar|our librar/i,      'book'],
    [/recogni[sz]|what good looks|strong \w+ therapy|choosing a/i,'check'],
    [/genuinely differ|families differ|adaptive or inclusive/i,'grid'],
    [/read a goal|how to read|goals?\b/i,               'searchlist'],
    [/parts nobody|nobody warns|worth knowing/i,       'signal'],
    [/water|aquatic|pool|swim/i,                       'water'],
    [/wander|elop|missing|responder|emergency|911/i,   'siren'],
    [/safe|precaution|protect|abuse|autonomy|risk/i,   'shield'],
    [/hospital|diagnosis|illness|injur|medical|whos who/i,'cross'],
    [/evidence|supported|sorted|research/i,            'scale'],
    [/evaluat|assess|how an|what.*targets|addresses/i, 'searchlist'],
    [/\bages?\b|\bstages?\b|grows with|changes with|the floor moves|progress/i,'growth'],
    [/librar|stories|read|book|maplewood/i,            'book'],
    [/money|pay|superbill|network|claim|fund|cost/i,   'money'],
    [/school|iep|goal|meeting|accommodat|classroom/i,  'calendar'],
    [/program|entitle|framework|state|massachusetts/i, 'map'],
    [/communit|team|sport|inclusive|adaptive|belong/i, 'team'],
    [/aac|speech|language|voice|communicat|talk|word/i, 'bubble'],
    [/declarative|say|phrase|script|question/i,        'twobub'],
    [/feed|\beat\b|eating|food|arfid|meal|dinner|swallow/i,   'plate'],
    [/breath|sleep|snor|airway|myofunctional/i,        'breath'],
    [/music|song|sound|listen/i,                       'note'],
    [/play|floortime|circle|child-led|capacit/i,       'circles'],
    [/\bmove|walk|motor|gait|distance|\bbody\b|posture/i,     'walk'],
    [/equipment|stroller|chair|device|technolog/i,     'device'],
    [/parking|travel|transit|getting there|days out/i, 'map'],
    [/home|house|famil|parent|caregiver/i,             'home'],
    [/demand|refus|avoid|pressure/i,                   'doorshut'],
    [/dignity|ordinary|respect|listen/i,               'hands'],
    [/self-advoca|grow|own voice|their own/i,          'growth'],
    [/agree|principle|belie|how this|what.*written/i,  'check'],
    [/learning from|adults with|disabilit/i,           'team'],
    [/practitioner|therapist|clinician|specialist/i,   'node'],
    [/common|injur|hurt|pain|where it/i,               'cross'],
    [/everything|all |site|landscape|kinds|types/i,    'grid'],
    [/woven|thread|inside|what.?s in/i,                'circles'],
    [/where.*happen|home|setting|place/i,              'home'],
    [/out in the world|world|outside|communit/i,       'map'],
    [/additional needs|child|children|young/i,         'child'],
    [/actually is|what it is|introduc|overview/i,      'compass'],
    [/who|find|choos|recogni|good|strong/i,            'check'],
    [/practical|matter|work|making it|before you/i,    'doc'],
    [/first|start|begin|now|right now/i,               'signal'],
    [/differ|vary|range|options|both/i,                'grid'],
    [/about|contribut|written|built/i,                 'child'],
    [/landscape|kinds|types|four|three|nine/i,         'grid']
  ];

  document.querySelectorAll('h2.sec').forEach(function (h) {
    if (h.querySelector('.nv-ic')) return;
    var t = h.textContent || '', name = 'fork';
    for (var i = 0; i < HEAD_RULES.length; i++) {
      if (HEAD_RULES[i][0].test(t)) { name = HEAD_RULES[i][1]; break; }
    }
    h.insertAdjacentHTML('afterbegin', svg(name, 26));
  });
})();

/* ===================================================================
   9. BELIEF BLOCKS — the "How this site is written" panel on the home
   page. Six bespoke marks, each meant to carry the idea without words.
   To swap one for a commissioned illustration later, replace the entry
   in BELIEF_ICONS with:  '<img class="nv-ic" src="img/name.svg" alt="">'
   =================================================================== */
(function () {
  'use strict';

  var css = [
    '.belief h3{display:flex;align-items:flex-start;gap:12px}',
    '.belief h3 .nv-ic{margin-top:.15em}',
    '.belief h3 img.nv-ic{width:26px;height:26px;object-fit:contain}',
    '@media(max-width:520px){.belief h3{gap:10px}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* Six drawings, in the order the blocks appear. */
  var MARKS = {
    /* contested — two arrows meeting head-on, neither winning */
    contested:
      '<path d="M3 12h6"/><path class="a" d="m7 9 3 3-3 3"/>' +
      '<path d="M21 12h-6"/><path class="a" d="m17 9-3 3 3 3"/>' +
      '<path d="M12 5v3m0 8v3" stroke-dasharray="1.5 2"/>',
    /* options — one stem, three equally valid paths */
    paths:
      '<path d="M12 21v-5"/><path class="a" d="M12 16 5 9V5"/>' +
      '<path d="M12 16v-6M12 16l7-7V5"/>' +
      '<circle class="fm" cx="5" cy="4" r="1.4"/><circle class="f" cx="12" cy="9" r="1.4"/>' +
      '<circle class="fm" cx="19" cy="4" r="1.4"/>',
    /* competence — the visible tip, and everything under the line */
    iceberg:
      '<path class="a" d="m12 3 4 6H8z"/>' +
      '<path d="M2.5 9.5h19" stroke-dasharray="2.5 2"/>' +
      '<path d="M6.5 9.5 12 21l6.5-11.5z"/>',
    /* free to take — an open hand, offering rather than holding */
    give:
      '<path class="a" d="M12 3v6m-2.5-3.5L12 3l2.5 2.5"/>' +
      '<path d="M4 12v3a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-3"/>' +
      '<path d="M4 12a1.6 1.6 0 0 1 3.2 0m9.6 0a1.6 1.6 0 0 1 3.2 0"/>',
    /* goes out of date — a cycle that has to keep turning */
    refresh:
      '<path d="M20 12a8 8 0 1 1-2.7-6"/><path class="a" d="M20 4v5h-5"/>' +
      '<circle class="f" cx="12" cy="12" r="1.5"/>',
    /* language — two quotation marks, not the same size */
    quotes:
      '<path class="a" d="M5 14c0-4 1.5-6 4-7M5 14h4v4H5z"/>' +
      '<path d="M14 15c0-3 1-4.5 3-5.5M14 15h3v3h-3z"/>'
  };

  var BELIEF_ICONS = ['contested', 'paths', 'iceberg', 'give', 'refresh', 'quotes'];

  function svg(name) {
    var d = MARKS[name];
    if (!d) return '';
    if (d.charAt(0) !== '<' || d.indexOf('<path') === 0 || d.indexOf('<circle') === 0) {
      return '<svg class="nv-ic" width="26" height="26" viewBox="0 0 24 24" ' +
             'aria-hidden="true" focusable="false">' + d + '</svg>';
    }
    return d; /* already a full element, e.g. a commissioned <img> */
  }

  var blocks = document.querySelectorAll('.belief h3');
  blocks.forEach(function (h, i) {
    if (h.querySelector('.nv-ic')) return;
    h.insertAdjacentHTML('afterbegin', svg(BELIEF_ICONS[i] || 'paths'));
  });
})();

/* ===================================================================
   10. POINT MARKS — a slot on every discrete point on the site.
   Each list item that carries a real idea gets a mark drawn from a
   shared library. The same drawing always means the same thing, so a
   reader learns the vocabulary as they go.

   TO SWAP IN COMMISSIONED ARTWORK: replace any entry in LIB with a
   full element, e.g.  water: '<img class="nv-ic" src="img/water.svg" alt="">'
   Nothing else needs to change.

   TO CHANGE DENSITY: edit SCOPE below. Add or remove selectors.
   =================================================================== */
(function () {
  'use strict';

  var css = [
    /* The icon is positioned, never a flex/grid child. A list item keeps
       display:list-item, so <strong>, <em> and text inside it stay in
       normal inline flow and wrap as ordinary prose. */
    'section > ul > li, section > ol > li, .agree li, .col li, .side li{',
    'list-style:none;position:relative;padding-left:30px}',
    'section > ul, section > ol, .agree ul, .col ul, .side ul{padding-left:2px}',
    'section > ul > li > .nv-ic, section > ol > li > .nv-ic,',
    '.agree li > .nv-ic, .col li > .nv-ic, .side li > .nv-ic{',
    'position:absolute;left:0;top:.28em;opacity:.9}',
    'li > img.nv-ic{width:20px;height:20px;object-fit:contain}',
    '@media(max-width:520px){section > ul > li, section > ol > li,',
    '.agree li, .col li, .side li{padding-left:26px}}',
    '@media print{li > .nv-ic{opacity:1}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---- the shared library ---- */
  var LIB = {
    /* people */
    family:   '<circle cx="8" cy="7" r="2.4"/><circle class="a" cx="16" cy="7" r="2.4"/><circle cx="12" cy="15" r="2"/><path d="M4 20v-2a4 4 0 0 1 8 0v2m0-2a4 4 0 0 1 8 0v2"/>',
    teacher:  '<rect x="3" y="4" width="14" height="10" rx="1"/><path class="a" d="M6.5 7.5h7M6.5 10.5h4"/><circle cx="19" cy="15" r="2.2"/><path d="M16 21v-1.5a3 3 0 0 1 6 0V21"/>',
    therapist:'<circle cx="9" cy="6" r="2.4"/><path d="M4 20v-3a5 5 0 0 1 10 0v3"/><path class="a" d="M16 11h5m-2.5-2.5V13.5"/><circle class="a" cx="18.5" cy="17.5" r="2.6"/>',
    doctor:   '<circle cx="12" cy="6" r="2.6"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/><path class="a" d="M10.2 12.5h3.6m-1.8-1.8v3.6"/>',
    village:  '<circle cx="6" cy="8" r="2.1"/><circle cx="12" cy="6.5" r="2.1"/><circle class="a" cx="18" cy="8" r="2.1"/><path d="M3 20v-2a3 3 0 0 1 6 0m6 0a3 3 0 0 1 6 0v2m-12 0v-3a3 3 0 0 1 6 0v3"/>',
    anyone:   '<circle class="a" cx="12" cy="12" r="9" stroke-dasharray="3 2.5"/><circle cx="12" cy="9.5" r="2.3"/><path d="M8 17.5v-.8a4 4 0 0 1 8 0v.8"/>',
    child2:   '<circle cx="12" cy="7" r="3"/><path d="M7 21v-4a5 5 0 0 1 10 0v4"/><path class="a" d="M12 12v3"/>',
    /* action & process */
    call:     '<path class="a" d="M6 3.5 9 8l-2 2c1 2.5 3.5 5 6 6l2-2 4.5 3-2 3c-8 1-15.5-6.5-14.5-14.5z"/>',
    write:    '<path class="a" d="m4.5 19.5 1-4L16 5a2 2 0 0 1 3 3L8.5 18.5z"/><path d="M14 7l3 3M3 21h18"/>',
    ask:      '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M9.6 9.4a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.2 2-2.2 3.3"/><circle class="f" cx="12" cy="16.6" r=".95"/>',
    ready:    '<circle cx="12" cy="12" r="8.5"/><path class="a" d="m8.2 12.2 2.6 2.6 5-5.4"/>',
    stop:     '<circle class="a" cx="12" cy="12" r="8.5"/><path d="M9 9h6v6H9z"/>',
    watch:    '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle class="a" cx="12" cy="12" r="2.6"/>',
    listen:   '<path class="a" d="M9 20a4 4 0 0 1-4-4V9a5 5 0 0 1 10 0c0 3-3 3-3 5"/><circle class="f" cx="12" cy="17.5" r="1"/>',
    warn:     '<path class="a" d="M12 4 2.5 20h19z"/><path d="M12 10v4"/><circle class="fm" cx="12" cy="17" r="1"/>',
    time:     '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M12 7.5V12l3.5 2"/>',
    repeat:   '<path d="M20 12a8 8 0 1 1-2.7-6"/><path class="a" d="M20 4v5h-5"/>',
    /* things */
    paper:    '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path class="a" d="M9 12h6m-6 4h4"/>',
    folder:   '<path d="M3 7h6l2 2.5h10V20H3z"/><path class="a" d="M3 7V4h6l2 3"/>',
    key:      '<circle class="a" cx="8" cy="12" r="4"/><path d="M12 12h9m-2 0v3m-3-3v2.5"/>',
    lock:     '<rect x="5" y="10" width="14" height="10" rx="2"/><path class="a" d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3"/>',
    coin:     '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M12 7.5v9M9.8 9.8h4a1.7 1.7 0 0 1 0 3.4h-2.6a1.7 1.7 0 0 0 0 3.4h4"/>',
    tool:     '<path class="a" d="M14.5 5.5a4 4 0 0 0 5 5L21 9v2.5a5.5 5.5 0 0 1-8 4.9L7 21l-4-4 4.6-6A5.5 5.5 0 0 1 12.5 3H15z"/>',
    place:    '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle class="a" cx="12" cy="10" r="2.6"/>',
    route:    '<circle class="a" cx="5" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M5 8.5V13a4 4 0 0 0 4 4h8" stroke-dasharray="2.5 2.5"/>',
    /* body & care */
    bodycare: '<circle cx="12" cy="5.5" r="2.5"/><path d="M12 8v7m-4 6 4-6 4 6"/><path class="a" d="M7 11h10"/>',
    heart:    '<path class="a" d="M12 20s-7.5-4.7-7.5-9.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/>',
    calm:     '<path class="a" d="M4 12h3"/><path d="M8 12c1-5 2-5 3 0s2 5 3 0"/><path class="a" d="M15.5 12H20"/>',
    sleep:    '<path d="M20 14.5A8.5 8.5 0 1 1 10 4a6.8 6.8 0 0 0 10 10.5z"/><path class="a" d="M14 4h4l-4 4h4"/>',
    food:     '<circle cx="12" cy="12" r="8.5"/><circle class="a" cx="12" cy="12" r="3.6"/>',
    /* talk */
    say:      '<path d="M20 14a3 3 0 0 1-3 3H9l-4 3v-3.5A3 3 0 0 1 4 14V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/><path class="a" d="M9 10.5h6"/>',
    tablet:   '<rect class="a" x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9.5h2m4 0h2M8 14.5h8"/>',
    /* learn */
    read:     '<path d="M12 6v14"/><path d="M12 6C9.5 3.8 6.5 3.8 4 5v13c2.5-1.2 5.5-1.2 8 1"/><path class="a" d="M12 6c2.5-2.2 5.5-2.2 8-1v13c-2.5-1.2-5.5-1.2-8 1"/>',
    idea:     '<path class="a" d="M9 16a5.5 5.5 0 1 1 6 0v2H9z"/><path d="M9.8 21h4.4"/>',
    step:     '<path class="a" d="M4 20h4v-4"/><path d="M10 16h4v-4m2 0h4V8"/>',
    balance:  '<path d="M12 4v16M6 20h12"/><path class="a" d="M4 9h16M6.5 9 4 14h5zM17.5 9 15 14h5z"/>',
    /* environment */
    house:    '<path d="M4 11 12 4l8 7v9H4z"/><path class="a" d="M9.5 20v-5.5h5V20"/>',
    outdoors: '<path class="a" d="M12 3 6 13h12z"/><path d="M12 8 5 20h14z"/><path d="M10.5 20v-2h3v2"/>',
    ripple:   '<path class="a" d="M3 10c3-2.2 5-.2 8 0s6-2 10 0"/><path d="M3 15c3-2.2 5-.2 8 0s6-2 10 0"/>',
    group:    '<circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><circle class="a" cx="12" cy="16" r="2.6"/><path d="M8 10.6v1.9M16 10.6v1.9"/>',
    /* default */
    point:    '<circle class="a" cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="8" stroke-dasharray="2.5 3"/>'
  };

  function draw(name) {
    var d = LIB[name] || LIB.point;
    if (d.indexOf('<img') === 0 || d.indexOf('<svg') === 0) return d;
    return '<svg class="nv-ic" width="19" height="19" viewBox="0 0 24 24" ' +
           'aria-hidden="true" focusable="false">' + d + '</svg>';
  }

  /* ---- bespoke sets, applied by exact list, in page order ---- */
  var EXACT = [
    { match: /Who this is/i,
      icons: ['family', 'teacher', 'therapist', 'doctor', 'village', 'anyone'] }
  ];

  /* ---- keyword rules for everything else ---- */
  var RULES = [
    [/\bcall\b|phone|dial|ring them|nurse line/i,        'call'],
    [/\bwrite|written|email|letter|document|in writing/i,'write'],
    [/\bask\b|asking|question|request/i,                 'ask'],
    [/never|don.t|do not|avoid|stop|refus/i,             'stop'],
    [/watch|notice|observ|look for|signs?\b/i,           'watch'],
    [/listen|\bhear\b|heard\b|\btold\b|\bsays?\b|\bsaid\b|\btalk/i,'listen'],
    [/danger|risk|warn|emergency|urgent|911|immediate/i, 'warn'],
    [/water|pool|swim|drown|bath/i,                      'ripple'],
    [/sleep|\bnight|\bbed(time|room)?\b|snor|\btired\b|fatigue|nap\b/i,'sleep'],
    [/\beat(s|ing|en)?\b|food|meal|feed|chew|swallow|drink|bite|appetite/i,'food'],
    [/device|aac|tablet|screen|app\b|technolog/i,        'tablet'],
    [/speech|language|word|communicat|voice|sign/i,      'say'],
    [/read|book|stor(y|ies)|literac/i,                   'read'],
    [/school|iep|teacher|classroom|lesson|student/i,     'teacher'],
    [/doctor|clinic|physician|nurse|hospital|medical/i,  'doctor'],
    [/therap|\bslp\b|\bot\b|\bpt\b|\bsessions?\b|clinician/i,   'therapist'],
    [/famil|parent|caregiver|home|household/i,           'family'],
    [/\bchild|\bkids?\b|\bsons?\b|daughter|\bteens?\b|toddler|infant/i,'child2'],
    [/friend|peer|team|group|communit|club/i,            'group'],
    [/money|cost|pay|fee|insur|claim|fund|bill/i,        'coin'],
    [/form|paperwork|report|record|file|note/i,          'paper'],
    [/keep|store|folder|binder|copy|track/i,             'folder'],
    [/eligib|qualif|access|unlock|entitle|right/i,       'key'],
    [/lock|secur|priva|safe(ty)?\b|protect/i,            'lock'],
    [/equipment|brace|chair|walker|stroller|tool/i,      'tool'],
    [/\bwhere\b|\bplace\b|location|venue|\bparks?\b|\brooms?\b|building/i,'place'],
    [/travel|transport|route|bus|drive|car\b/i,          'route'],
    [/\btime\b|\bwait|minutes?\b|hours?\b|weeks?\b|months?\b|years?\b|deadline|annual/i,'time'],
    [/\bagain\b|repeat|\breview\b|each year|renew|re-?check/i,     'repeat'],
    [/\bbody\b|\bpain\b|hurts?\b|posture|muscle|\bphysical\b|joint/i,'bodycare'],
    [/love|care|kind|gentle|comfort|dignit/i,            'heart'],
    [/calm|regulat|breath|soothe|quiet/i,                'calm'],
    [/\bsteps?\b|\bfirst\b|\bstart|\bbegin|\bnext\b/i,           'step'],
    [/evidence|proof|research|study|data|measure/i,      'balance'],
    [/idea|think|understand|learn|know/i,                'idea'],
    [/outdoor|park|trail|nature|camp/i,                  'outdoors'],
    [/program|service|support|provider|agency/i,       'folder'],
    [/sport|gymnast|dance|martial|bike|ride|climb/i,   'outdoors'],
    [/art\b|music|sing|drama|craft|paint/i,             'idea'],
    [/goal|progress|improve|outcome|result/i,          'balance'],
    [/appointment|visit|meeting|evaluation|assess/i,   'ready'],
    [/policy|law|legal|state|federal|require/i,        'key'],
    [/ready|prepare|plan|check|confirm|make sure/i,      'ready']
  ];

  function pick(text) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(text)) return RULES[i][1];
    }
    return 'point';
  }

  /* ---- which points get a mark. Edit to widen or narrow. ---- */
  var SCOPE = 'section > ul > li, section > ol > li, .agree li, .col li, .side li';

  /* bespoke lists first */
  var claimed = [];
  document.querySelectorAll('h2.sec, h3.sub').forEach(function (h) {
    EXACT.forEach(function (e) {
      if (!e.match.test(h.textContent)) return;
      var n = h.nextElementSibling;
      while (n && n.tagName !== 'UL' && n.tagName !== 'OL') n = n.nextElementSibling;
      if (!n) return;
      Array.prototype.forEach.call(n.children, function (li, i) {
        if (li.querySelector('.nv-ic')) return;
        li.insertAdjacentHTML('afterbegin', draw(e.icons[i] || 'point'));
        claimed.push(li);
      });
    });
  });

  /* everything else, by keyword */
  document.querySelectorAll(SCOPE).forEach(function (li) {
    if (li.querySelector(':scope > .nv-ic')) return;
    if (claimed.indexOf(li) > -1) return;
    li.insertAdjacentHTML('afterbegin', draw(pick(li.textContent || '')));
  });
})();

/* ===================================================================
   11. BREADCRUMBS — orientation for readers arriving from a search
   engine, who have no idea this page belongs to a larger site.
   Reads: In The Spectrums  ›  Therapies  ›  Aquatic therapy
   Groups come from the site map at the top of this file, so nothing
   needs maintaining separately.
   =================================================================== */
(function () {
  'use strict';

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* On the home page: tag the library section so breadcrumb group links
     have somewhere to land, then stop — home needs no trail of its own. */
  if (file === 'index.html' || file === '') {
    var heads = document.querySelectorAll('h2.sec');
    for (var k = 0; k < heads.length; k++) {
      if (/everything|on the site/i.test(heads[k].textContent)) {
        var sec = heads[k].closest('section') || heads[k].parentNode;
        if (sec && !sec.id) sec.id = 'library';
        heads[k].style.scrollMarginTop = '76px';
        break;
      }
    }
    return;
  }

  /* rebuild the map (same data as the nav, kept local so order is safe) */
  var MAP = [
    ['Start here', ['spectrums.html','what-to-do-first.html','care-team-map.html','conditions-library.html','whole-picture.html']],
    ['School and services', ['inside-the-iep.html','accommodations-finder.html','programs-and-entitlements.html']],
    ['Adult life', ['adult-life.html','adult-benefits.html','adult-housing.html','adult-providers.html','your-own-life.html']],
    ['Money, paperwork and tracking', ['paying-for-therapy.html','template-builders.html','symptom-tracker.html','goals-tracker.html','share-builder.html','using-these-tools.html']],
    ['Safety and health', ['safety.html','injuries-and-illness.html']],
    ['Therapies', ['occupational-therapy.html','physical-therapy.html','speech-language-aac.html',
                   'feeding-therapy.html','aquatic-therapy.html','myofunctional-therapy.html',
                   'floortime.html','music.html']],
    ['Learning, attention and mood', ['learning-and-literacy.html','adhd-executive-function.html','anxiety-and-ocd.html']],
    ['Behavior', ['behavior.html','de-escalation.html','behavior-support.html']],
    ['The child', ['their-own-voice.html','adaptive-community.html','maplewood-stories.html']],
    ['About', ['about.html','terms-and-privacy.html']]
  ];

  var group = null;
  MAP.forEach(function (g) { if (g[1].indexOf(file) > -1) group = g[0]; });

  /* page title: first h1 on the page, flattened */
  var h1 = document.querySelector('h1');
  var title = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : document.title;
  if (title.length > 46) title = title.slice(0, 44).replace(/[\s:,\u2014-]+$/, '') + '\u2026';

  var css = [
    '.nv-crumb{max-width:1040px;margin:0 auto;padding:14px 22px 0;',
    'font-family:var(--nv-sans);font-size:12.5px;color:var(--nv-soft);letter-spacing:.02em}',
    '.nv-crumb ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;align-items:center;gap:7px}',
    '.nv-crumb li{display:flex;align-items:center;gap:7px;margin:0}',
    '.nv-crumb a{color:var(--nv-soft);text-decoration:none;border-bottom:1px solid transparent}',
    '.nv-crumb a:hover{color:var(--nv-rust);border-bottom-color:var(--nv-rust)}',
    '.nv-crumb a:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',
    '.nv-crumb .sep{color:#B9C4B4}',
    '.nv-crumb [aria-current]{color:var(--nv-ink);font-weight:600}',
    '@media(max-width:520px){.nv-crumb{padding-top:12px;font-size:12px}}',
    '@media print{.nv-crumb{padding-left:0}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  var parts = '<li><a href="index.html">In The Spectrums</a></li>';
  if (group) {
    parts += '<li><span class="sep" aria-hidden="true">\u203a</span>' +
             '<a href="index.html#library">' + esc(group) + '</a></li>';
  }
  parts += '<li><span class="sep" aria-hidden="true">\u203a</span>' +
           '<span aria-current="page">' + esc(title) + '</span></li>';

  var nav = document.createElement('nav');
  nav.className = 'nv-crumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.innerHTML = '<ol>' + parts + '</ol>';

  var bar = document.querySelector('.nv-bar');
  if (bar && bar.nextSibling) {
    bar.parentNode.insertBefore(nav, bar.nextSibling);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }

  /* trim the top padding of the page header so the trail sits snugly */
  var mast = document.querySelector('header.masthead, .masthead, .spread');
  if (mast) mast.style.paddingTop = '18px';

  /* structured data, so search engines show the trail in results */
  var items = [{ name: 'In The Spectrums', item: 'index.html' }];
  if (group) items.push({ name: group, item: 'index.html#library' });
  items.push({ name: title, item: file });
  var ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (o, i) {
      return {
        '@type': 'ListItem', position: i + 1, name: o.name,
        item: new URL(o.item, location.href).href
      };
    })
  };
  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(ld);
  document.head.appendChild(tag);
})();

/* ===================================================================
   12. LONG-PAGE READING TOOLS
   - reading time and section count on the contents box
   - OUTLINE VIEW: one click collapses every section to its heading,
     turning a long page into a one-screen menu
   - per-section collapse by clicking a heading
   - the contents box highlights whichever section you are in
   - a thin progress bar at the top of the window
   =================================================================== */
(function () {
  'use strict';

  var heads = Array.prototype.slice.call(document.querySelectorAll('h2.sec'));
  if (heads.length < 4) return;

  var css = [
    /* progress */
    '.nv-prog{position:fixed;top:0;left:0;height:3px;background:var(--nv-rust);z-index:960;width:0;',
    'transition:width .1s linear}',
    /* contents box additions */
    '.nv-toc .meta{font-family:var(--nv-sans);font-size:11px;letter-spacing:.05em;color:var(--nv-soft);',
    'margin:9px 0 0;display:flex;gap:14px;flex-wrap:wrap;align-items:center}',
    '.nv-outline{font-family:var(--nv-sans);font-size:11px;letter-spacing:.05em;background:none;',
    'border:1px solid var(--nv-line);border-radius:2px;padding:5px 10px;cursor:pointer;color:var(--nv-forest);',
    'font-weight:700;text-transform:uppercase}',
    '.nv-outline:hover{border-color:var(--nv-rust);color:var(--nv-rust)}',
    '.nv-outline:focus-visible{outline:2px solid var(--nv-rust);outline-offset:2px}',
    '.nv-toc a.on{color:var(--nv-rust);font-weight:600}',
    /* collapsible sections */
    'h2.sec{cursor:pointer;position:relative}',
    'h2.sec::after{content:"\\2212";position:absolute;right:0;top:.1em;font-family:var(--nv-sans);',
    'font-size:.62em;color:var(--nv-rust);opacity:.45;font-weight:400}',
    'h2.sec:hover::after{opacity:1}',
    'section.nv-shut h2.sec::after{content:"+"}',
    'section.nv-shut > *:not(h2.sec):not(.secnote):not(.nv-gist){display:none}','section.nv-shut .secnote, section.nv-shut .nv-gist{display:block;margin:6px 0 0;'+'font-size:.95rem;color:var(--nv-soft);max-width:70ch;line-height:1.5}','section.nv-shut .nv-gist{font-style:italic}',
    'section.nv-shut{margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--nv-line)}',
    'section.nv-shut h2.sec{font-size:1.15rem;margin:0}',
    'section.nv-shut{padding-bottom:14px}',
    '@media print{h2.sec{cursor:auto}h2.sec::after{display:none}',
    'section.nv-shut > *{display:block !important}.nv-prog{display:none}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---- reading time ---- */
  var words = (document.body.innerText || '').trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 220));

  var toc = document.querySelector('.nv-toc');
  var links = toc ? Array.prototype.slice.call(toc.querySelectorAll('a')) : [];

  if (toc) {
    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.innerHTML = '<span>' + mins + ' min read \u00b7 ' + heads.length + ' sections</span>';
    var btn = document.createElement('button');
    btn.className = 'nv-outline';
    btn.type = 'button';
    btn.textContent = 'Skim it';
    btn.setAttribute('aria-pressed', 'false');
    meta.appendChild(btn);
    toc.querySelector('div').appendChild(meta);

    /* Sections written without a standfirst get one generated from their
       opening sentence, so the collapsed view still says what each is about.
       Done once, lazily, and never shown while the section is open. */
    var gistsMade = false;
    function makeGists() {
      if (gistsMade) return;
      gistsMade = true;
      heads.forEach(function (h) {
        var sec = h.closest('section');
        if (!sec || sec.querySelector('.secnote') || sec.querySelector('.nv-gist')) return;
        var p = null, kids = sec.children;
        for (var i = 0; i < kids.length; i++) {
          if (kids[i].tagName === 'P' && kids[i].textContent.trim().length > 40) { p = kids[i]; break; }
        }
        if (!p) {
          var inner = sec.querySelector('p');
          if (inner && inner.textContent.trim().length > 40) p = inner;
        }
        var t = '';
        if (p) {
          t = p.textContent.replace(/\s+/g, ' ').trim();
          var cut = t.search(/[.!?](\s|$)/);
          if (cut > 0 && cut < 240) t = t.slice(0, cut + 1);
          else if (t.length > 200) t = t.slice(0, 200).replace(/\s+\S*$/, '') + '\u2026';
        } else {
          /* A section built only from cards has no prose to borrow. Listing
             what it covers is more use than a sentence would have been. */
          var titles = [];
          sec.querySelectorAll('h3, h4, .age, b, li > strong').forEach(function (el) {
            var v = el.textContent.replace(/\s+/g, ' ').trim();
            v = v.replace(/[.,:;\u2014-]\s*$/, '');
            if (v && v.length > 2 && v.length < 60 && titles.indexOf(v) < 0) titles.push(v);
          });
          if (!titles.length) return;
          t = 'Covers: ' + titles.slice(0, 8).join(' \u00b7 ') + (titles.length > 8 ? ' \u00b7 \u2026' : '');
        }
        if (!t) return;
        var g = document.createElement('p');
        g.className = 'nv-gist';
        g.textContent = t;
        h.parentNode.insertBefore(g, h.nextSibling);
      });
    }

    window.ITS_MAKE_GISTS = makeGists;
    var collapsed = false;
    btn.addEventListener('click', function () {
      collapsed = !collapsed;
      if (collapsed) makeGists();
      heads.forEach(function (h) {
        var sec = h.closest('section');
        if (sec) sec.classList.toggle('nv-shut', collapsed);
      });
      btn.textContent = collapsed ? 'Show everything' : 'Skim it';
      btn.setAttribute('aria-pressed', String(collapsed));
      if (collapsed) window.scrollTo({ top: toc.offsetTop - 70, behavior: 'smooth' });
    });
  }

  /* ---- click a heading to fold just that section ---- */
  heads.forEach(function (h) {
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    function toggle() {
      var sec = h.closest('section');
      if (!sec) return;
      if (!sec.classList.contains('nv-shut') && typeof window.ITS_MAKE_GISTS === 'function') {
        window.ITS_MAKE_GISTS();
      }
      sec.classList.toggle('nv-shut');
    }
    h.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return;
      toggle();
    });
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---- progress bar + current-section highlight ---- */
  var bar = document.createElement('div');
  bar.className = 'nv-prog';
  document.body.appendChild(bar);

  var ticking = false;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';

    if (links.length) {
      var current = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top < 140) current = i;
      }
      links.forEach(function (a, i) { a.classList.toggle('on', i === current); });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ===================================================================
   13. THE SHORT VERSION
   A few lines at the top of each page for someone who has three
   minutes. Edit the text here; it appears on every page at once.
   =================================================================== */
(function () {
  'use strict';

  var SHORT = {
'what-to-do-first.html': ["Start every long wait at once \u2014 in parallel, you have answers in a year; one at a time, it takes three.",
  "You do not need a diagnosis or a referral to begin. Call Early Intervention or email the district yourself, today.",
  "Put your request in writing. A dated email starts a legal clock; a conversation at pickup does not.",
  "Get hearing and vision properly checked before anything else. Both imitate almost everything and both are treatable.",
  "Regression, seizures, sudden change after illness, or any safety worry means this week, not this sequence."],

'care-team-map.html': ["Forty-five specialties, grouped by the kind of question you have rather than by body part.",
  "You need the two or three that match what you are living with now. Nobody needs all of them.",
  "Each entry says what they do, why you would call, what a first visit looks like, and what gets missed.",
  "Search by a symptom rather than a specialty if you don't know the name of what you need."],

'conditions-library.html': ["Thirty-four entries, each covering what it is, how widely it varies, what helps, and what gets overlooked.",
  "The bands show how much people with the same diagnosis differ from one another \u2014 not a rating of any child.",
  "A label is a key that opens doors to services. It is not a description of a person.",
  "The section worth reading first on any entry is what commonly gets missed."],

'inside-the-iep.html': ["Write every concern into the parent concerns statement. It is the only part of the IEP you write.",
  "If it isn't in writing, it didn't happen. That section is the dated record everything later rests on.",
  "Comprehensive on paper, focused in the room \u2014 submit everything, then push on two or three things.",
  "A goal without a baseline, a number, and a named measure cannot be enforced.",
  "You do not have to sign at the meeting. Take it home."],

'accommodations-finder.html': ["Search by the difficulty you actually see, not by diagnosis.",
  "Each entry explains why it happens and gives wording you can request word for word.",
  "Replace anything in brackets with your child's specifics. A number is enforceable; an adjective is not.",
  "Ask for a small number that will actually be delivered rather than a long list that won't."],

'programs-and-entitlements.html': ["Special education is an entitlement. Adult disability services generally are not \u2014 they depend on funding.",
  "Apply for things years before you need them. Waitlists are the currency here.",
  "Several Medicaid pathways are based on the child's disability and ignore parent income entirely. Ask by name.",
  "Every state has a free parent training and information center. It is the cheapest hour you will spend."],

'paying-for-therapy.html': ["Verify coverage by CPT code and place of service before the first session, not after the first denial.",
  "Out of network means you pay and claim back. Get superbills marked paid in full with a zero balance.",
  "Lead with one claim plus the provider's signed W-9. A stale W-9 is a common silent denial cause.",
  "Appeal the first no. A large share of denials are clerical rather than decisions.",
  "If no in-network provider is genuinely available, ask for a single case agreement."],

'template-builders.html': ["Four documents that build themselves as you type. Nothing is saved or sent anywhere.",
  "The child one-pager is the one families reuse most \u2014 give it to every new person.",
  "The parent concerns builder produces a statement you can email ahead of an IEP meeting.",
  "Print or copy before you close the tab."],

'safety.html': ["Every safety measure fails sometimes. Protection comes from layers whose gaps don't line up.",
  "A missing child is a water search until proven otherwise. Call 911 first and send someone to water.",
  "Swim instruction is a safety intervention, not a hobby. Survival skills before stroke technique.",
  "A communication system that can only request things cannot report harm.",
  "Take a responder profile to your police and fire departments in person, before anything happens."],

'injuries-and-illness.html': ["Most families over-wait or go to the wrong place. The triage strip at the top sorts it in ten seconds.",
  "Fever with a port, central line, or immune suppression means the emergency department now.",
  "Ask what your hospital's family-activated rapid response line is called, and write it down.",
  "Bring a bedside card. The most useful line on it is what your child looks like when they are well.",
  "New behavior in a child with a disability is a symptom until proven otherwise."],

'symptom-tracker.html': ["Track what was different, not everything. A tracker abandoned after three weeks is worse than none.",
  "The printed summary is the point. Build it the day before the appointment, not in the waiting room.",
  "Write down what happened just before a hard moment. That is usually the useful part.",
  "Two things rising together is the most ordinary coincidence there is. Bring it as a question, not a conclusion.",
  "It saves only in the browser you are using — download a backup or you will eventually lose the lot."],

'occupational-therapy.html': ["OT works on the whole day \u2014 dressing, eating, writing, regulating, sleeping \u2014 not a skill in isolation.",
  "The exercise is never the goal. Ask which part of your day will look different, and by when.",
  "Task-specific practice in real settings beats practicing underlying components. This is the clearest finding in the field.",
  "Environmental change and assistive technology are the fastest-acting interventions and the most under-used.",
  "Bring three concrete moments from your week. A good therapist can build a whole plan from them."],

'physical-therapy.html': ["The goal is not normal movement. It is more places your child can get to, with energy left over.",
  "Ask which distance or activity a goal is aimed at. \"Improve gait\" tells you nothing.",
  "Children with limited walking need hip surveillance on a schedule. Ask who owns it.",
  "Strength training is safe and helpful in cerebral palsy. The old warning has not held up.",
  "Wheels are not giving up. Early mobility is associated with more independence, not less walking."],

'speech-language-aac.html': ["The goal was never speech. It was being understood, and being able to say the things that matter.",
  "Check whether your child can refuse, ask a question, and say something hurts. If not, that's the next conversation.",
  "AAC belongs alongside speech from the beginning. It is associated with gains in speech, not losses.",
  "There are no prerequisites for communication. No readiness test, no threshold to clear.",
  "Recounting \u2014 telling someone about something they didn't see \u2014 is the vocabulary that protects a person."],

'feeding-therapy.html': ["Eating is the one skill nobody can perform on a child's behalf, which is why pressure fails here.",
  "Progress is a ladder of about twelve steps. Swallowing is only the last one.",
  "Spitting it out must always be allowed. A child who knows they can get it out will let it in.",
  "Protect the accepted foods first. Never hide or sneak anything \u2014 it can cost the whole list.",
  "Change the language before anything else: observations and wonderings instead of questions and instructions."],

'aquatic-therapy.html': ["Water changes the physics \u2014 weight, speed, resistance, and how long you have to react.",
  "A child may genuinely do something in the pool months before they can do it on land. That practice is real.",
  "Aquatic therapy is not swim instruction. Ask for survival skills explicitly, or arrange lessons separately.",
  "Comfort in water without competence in water is a hazard, not a safeguard.",
  "Check the pool temperature, and check the sensory experience around the pool, not just in it."],

'myofunctional-therapy.html': ["Breathing, sleeping, eating, drinking and speaking share one set of muscles and one resting posture.",
  "The unifying question is where the tongue rests and whether the person breathes through their nose.",
  "If there is snoring or mouth breathing, get the airway assessed first. Exercises don't shrink tonsils.",
  "Daily home practice determines whether it works, more than the protocol or the practitioner.",
  "For any release procedure, get a second opinion from someone who does not perform it."],

'floortime.html': ["Join whatever your child is already doing, then give them a reason to come back to you. That's a circle.",
  "Following the lead is not permissiveness. The child chooses the content; the adult holds the direction.",
  "It never expires \u2014 it just moves from the floor to the kitchen, the car, and the game you don't understand yet.",
  "Initiation generalizes. Compliance often doesn't.",
  "You can start this afternoon, and you do not need any training to begin."],

'music.html': ["Music engages hearing, movement, timing, emotion, reward, memory and language at the same time.",
  "That overlap gives you more than one route in \u2014 reaching movement through hearing, or feeling through rhythm.",
  "For regulation: match their current state first, then shift. Starting calm for an agitated child fails.",
  "Leave a gap in a familiar song and wait. That pause is where communication happens.",
  "Music does not raise IQ. It does not need the exaggerations, and they make the real parts easier to dismiss."],

'behavior.html': ["Every behavior is a message from someone doing the best they can with what they have available.",
  "Zoom out before responding. The moment, the hour, the day, the week \u2014 and the season, which gets missed most.",
  "Communication access comes first. Most behavior problems are communication problems in disguise.",
  "The person hardest hit is almost never the adult it happened to. It is the child who did it.",
  "Every question is a demand. Lowering how many you ask lowers the load a person carries all day."],

'de-escalation.html': ["Precursor behavior is the whole ballgame. Once escalation is underway, only safety is available.",
  "De-escalation outranks the task, the schedule, and the lesson \u2014 every time.",
  "At the peak: one adult, fewer words, no questions, more space. Nothing is being taught right now.",
  "Reset fully before processing. A conversation attempted too early teaches nothing and costs the safe place.",
  "Don't say \"it's okay\" to an apology. Say thank you for apologizing, and for talking about it with me."],

'behavior-support.html': ["The label tells you almost nothing about what will happen in your living room. Evaluate the practice.",
  "This site does not tell you to pursue ABA or to avoid it. It gives you the map and the questions.",
  "Ask what they do when your child says no, in any form. The answer tells you most of what you need.",
  "Behavioral support should extend what the specialists have taught, not set targets in their domains.",
  "You are allowed to pause, change providers, or stop \u2014 including something that looks fine on paper."],

'adaptive-community.html': ["Most children never get there because an adult decided in advance that it wouldn't work.",
  "Ask your parks and recreation department for the inclusion coordinator. Almost nobody knows the role exists.",
  "Ask about scholarships before you ask about price. They usually exist and are rarely mentioned.",
  "Museums, zoos and theaters often have free companion admission, sensory hours and sensory bags. Call and ask.",
  "Your public library may lend museum passes, sensory kits, and more. Free, and badly under-used."],

'their-own-voice.html': ["There is no single right way to tell a child about their own life. This page gives options with reasoning.",
  "The common regret from disabled adults isn't being told too soon. It's nobody telling them at all.",
  "A diagnosis is an administrative key that opens doors. It is not a description of a person.",
  "Self-determination starts with discovering that your preferences reliably change what happens.",
  "Their preference about language, and about what gets shared, outranks any style guide including this one."],

'learning-and-literacy.html': ["Reading comprehension is decoding multiplied by language comprehension. If either is near zero, so is reading.",
  "Structured literacy \u2014 explicit, systematic phonics \u2014 has the strongest evidence base in education.",
  "Ask what your child is taught to do at an unknown word. If the answer involves guessing from pictures or context, that's the problem.",
  "Instruction and accommodation are both required. One without the other fails.",
  "Early intervention works dramatically better than later. A gap at the end of first grade should be acted on now."],

'adhd-executive-function.html': ["People with ADHD know what to do. The difficulty is doing it at the moment it needs doing.",
  "Almost everything that helps works by moving the demand out of their head and into the world \u2014 externalize it.",
  "Medication is among the better-evidenced treatments in child psychiatry, and it is a real decision either way.",
  "This is where low-demand approaches mislead. ADHD needs more scaffolding, not less \u2014 built with the person, not imposed.",
  "Fix the system out loud rather than the person. Self-esteem is a goal here, not a side effect.",
  "Their brain is not good at forgetting \u2014 it is remarkable at remembering what interests it. Give them that sentence."],

'anxiety-and-ocd.html': ["Anxiety is maintained by relief. Reassurance and avoidance feel like love and function as fuel.",
  "The treatment is CBT with exposure. Talk therapy without exposure is not the evidence-based version.",
  "If your child won't attend therapy, ask about SPACE \u2014 a parent-only treatment with comparable outcomes.",
  "Say both halves: I know this is hard for you, and I know you can handle it.",
  "This is where the rest of this site's low-demand framing is wrong. Avoidance maintains anxiety."],

'whole-picture.html': ["Most children with one neurodevelopmental diagnosis have more than one. That is ordinary, not alarming.",
  "The first diagnosis is usually the loudest, not the most fundamental. The search often stops there.",
  "Ask: what have we not looked at? And \u2014 if this diagnosis weren\u2019t here, what would we be investigating?",
  "Order matters. Hearing, vision, sleep, pain and constipation first: common, treatable, and they imitate everything.",
  "Four diagnoses do not mean four plans. Someone has to hold the whole picture and reconcile the conflicts.",
  "Don\u2019t judge the moment. What you saw was a stacking that finally went past capacity, not a response to the last thing."],

'goals-tracker.html': ["Most children with several providers have several sets of goals that nobody else has read. This puts them in one place.",
  "The generalization sheet is the part that changes outcomes \u2014 which goals travel, and exactly how.",
  "Three generalization goals per provider is the ceiling. More than that and none of them get done properly.",
  "Be specific enough that an untrained adult could carry it out: what, when, where, with whom, how to prompt, how to fade.",
  "Print it or export it and hand it over. Nothing is transmitted \u2014 you choose what goes in."],

'share-builder.html': ["A new aide doesn\u2019t need medical history. A gastroenterologist doesn\u2019t need handwriting goals.",
  "Pick who it\u2019s for and the sections tick themselves \u2014 then adjust anything.",
  "Nothing is ever transmitted. You print it or download it and hand it over.",
  "This is section-by-section control, which is finer-grained than most sharing systems give you.",
  "Anything left out was left out on purpose \u2014 and that is your right."],

'using-these-tools.html': ["Add a tracker to your home screen and it opens like an app. That\u2019s the difference between logging and not.",
  "Everything lives in one browser on one device. Safari on your phone and Chrome on your laptop are separate copies.",
  "Download a backup file monthly, and before any phone upgrade or clearing of browsing data.",
  "Print means save as PDF on every modern device \u2014 instructions here for Mac, Windows, iPhone and Android.",
  "No technical support is available. Take these tools, change them, or just take the categories and build your own."],

'terms-and-privacy.html': ["Free, collects nothing about you, not professional advice of any kind, and cannot know your child.",
  "No accounts, no analytics, no cookies, no advertising. Tools store data in your browser and nowhere else.",
  "Content is offered under a Creative Commons licence \u2014 copy it, adapt it, put your own name on it.",
  "Practitioner listings involve no payment, no vetting, and no endorsement.",
  "If any part of the site is hard for you to use, tell us and we will provide it another way."],

'adult-life.html': ["School services are an entitlement. Adult services are an application \u2014 you qualify, then wait for funding.",
  "Get on your state\u2019s Medicaid waiver waiting list now. Your place depends entirely on the date you applied.",
  "Never leave money directly to someone on benefits \u2014 including via life insurance or retirement beneficiary forms.",
  "Start decision-making at the least restrictive option. Guardianship removes civil rights and is hard to undo.",
  "Write the letter of intent. A trust says where the money goes; that says who the person is."],

'adult-benefits.html': ["Working almost never leaves someone worse off. That belief costs people jobs, money and ordinary life.",
  "Medicaid can continue after the cash payment stops \u2014 this is the protection people most need to know exists.",
  "An adult disabled before 22 may claim on a parent\u2019s Social Security record. Many families never learn this.",
  "Book a free benefits counselor before any change in work or income. Every state has one.",
  "Benefits are lost through paperwork more often than through circumstances. Open every letter the day it arrives."],

'adult-housing.html': ["Get on housing waiting lists years early. Your position depends entirely on the date you applied.",
  "Free housing reduces SSI. A generous arrangement can quietly cost the person money \u2014 structure it first.",
  "Housing lists and disability-service lists are different queues. Get on both.",
  "If family buys a place, ask the special needs attorney before the realtor. Who owns it changes everything.",
  "Fair housing law gives you the right to reasonable accommodation and modification. Put requests in writing."],

'adult-providers.html': ["Staff turnover is the single best predictor of quality. Ask for the number.",
  "Any hesitation about unannounced visits is disqualifying. There is no legitimate reason for it.",
  "Visit more than once, at different times \u2014 including a weekend evening when staffing is thinnest.",
  "Find your state\u2019s adult protective services and protection and advocacy numbers now, not when you need them.",
  "A person who can recount what happened when you weren\u2019t there is dramatically safer."],

'your-own-life.html': ["This page is written to you, not about you.",
  "You are allowed to disagree, to change your mind, and to ask for things to be explained again.",
  "Guardianship can be changed or ended. It is not permanent and not automatic.",
  "If someone hurts you or takes your things, keep telling until somebody listens. The first person failing is not your fault.",
  "Find a self-advocacy group run by people with disabilities. Most people say it changes what they thought was possible."],

'spectrums.html': ["The name is plural. On the spectrum is a line; in the spectrums is a space you move around inside.",
  "There is no single spectrum \u2014 sensing, moving, sleeping, eating, communicating, feeling, joy. Nobody sits in the middle of all of them.",
  "What differs is how much support a position asks for, and how much of the gap has been closed so far.",
  "Progress is not linear. You turn the cube for months, see nothing, and then one day a whole side has come together.",
  "You cannot do everything. A few things done consistently beats the whole list done once."],

'maplewood-stories.html': ["Fifty-two picture books about ten friends who are not alike, figuring it out together.",
  "No child in them is labeled, and none of them is the lesson.",
  "Social and emotional learning, executive function, and safety awareness are the plots, not the moral.",
  "Built for a lap, a sofa, and a shared page. The talking is what does the work."],

'about.html': ["Free, no login, no ads, no sponsors, nothing sold.",
  "Where evidence is contested, this site describes the disagreement rather than choosing for you.",
  "Take anything here, rewrite it, and put your own name on it.",
  "Corrections are the most valuable thing anyone sends."]
  };

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var items = SHORT[file];
  if (!items || !items.length) return;

  var css = [
    '.nv-short{max-width:1040px;margin:0 auto 30px;padding:0 22px}',
    '.nv-short > div{background:var(--nv-card);border-left:4px solid var(--nv-forest);padding:20px 24px}',
    '.nv-short h2{font-family:var(--nv-sans);font-size:11px;letter-spacing:.18em;text-transform:uppercase;',
    'color:var(--nv-forest);font-weight:700;margin:0 0 13px}',
    '.nv-short ul{list-style:none;margin:0;padding:0}',
    '.nv-short li{display:flex;gap:11px;align-items:flex-start;margin:0 0 10px;font-size:1.01rem;line-height:1.5}',
    '.nv-short li:last-child{margin:0}',
    '.nv-short li::before{content:"";flex:0 0 6px;height:6px;border-radius:50%;background:var(--nv-rust);margin-top:.55em}',
    '@media(max-width:520px){.nv-short > div{padding:17px 19px}.nv-short li{font-size:.97rem}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('div');
  box.className = 'nv-short';
  box.innerHTML = '<div><h2>The short version</h2><ul>' +
    items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>';

  var mast = document.querySelector('header.masthead, .masthead, .spread');
  if (mast && mast.parentNode) mast.parentNode.insertBefore(box, mast.nextSibling);
})();

/* =================================================================
   PAGE MARKS — one icon per page, kept in one place.

   To change a page's icon, edit its entry below and every card
   pointing at that page updates at once: the router quotes on the
   home page, the library card, everywhere.

   Each value is the INSIDE of a 74x74 SVG. Keep the viewBox square
   and the artwork will scale itself to whatever size the card asks
   for — the layouts size the box, not the drawing, so swapping art
   never moves the text beside it.

   House palette:
     ink   #16283C    forest #2E4E3F    rust  #9C4A21
     tan   #C6A98F    pale   #E7EDE5    sand  #EFE0D5
     alarm #8A2B20    paper  #FBF7F0
   ================================================================= */
(function () {
  'use strict';

  var MARKS = {

  'spectrums.html':
    '<rect width="74" height="74" fill="#16283C"/><path d="M4 26c9-9 15 9 22 0s13 9 22 0 13 9 22 0" fill="none" stroke="#9C4A21" stroke-width="2.6"/><path d="M4 38c9-9 15 9 22 0s13 9 22 0 13 9 22 0" fill="none" stroke="#C6A98F" stroke-width="2.6" opacity=".8"/><path d="M4 50c9-9 15 9 22 0s13 9 22 0 13 9 22 0" fill="none" stroke="#7FA57A" stroke-width="2.6" opacity=".65"/>',


  'adult-benefits.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="37" cy="37" r="19" fill="none" stroke="#16283C" stroke-width="2"/><path d="M37 24v26M30 30h11a4.5 4.5 0 0 1 0 9h-7a4.5 4.5 0 0 0 0 9h11" fill="none" stroke="#2E5F4E" stroke-width="2.4" stroke-linecap="round"/>',

  'adult-housing.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><path d="M12 36 28 22l16 14v22H12z" fill="none" stroke="#16283C" stroke-width="2"/><rect x="20" y="44" width="8" height="14" fill="#7A5230"/><path d="M46 44l10-8 10 8v14H46z" fill="none" stroke="#16283C" stroke-width="1.8"/><rect x="53" y="50" width="6" height="8" fill="#9C4A21"/>',

  'adult-providers.html':
    '<rect width="74" height="74" fill="#16283C"/><circle cx="28" cy="27" r="12" fill="none" stroke="#C6A98F" stroke-width="2.5"/><path d="M37 36l12 12" stroke="#9C4A21" stroke-width="3.5" stroke-linecap="round"/><circle cx="28" cy="24" r="3.6" fill="#C6A98F"/><path d="M22 33a6 6 0 0 1 12 0" fill="#C6A98F"/>',

  'your-own-life.html':
    '<rect width="74" height="74" fill="#FBF7F0"/><circle cx="37" cy="26" r="8" fill="none" stroke="#16283C" stroke-width="2"/><path d="M22 58v-4a15 15 0 0 1 30 0v4" fill="none" stroke="#16283C" stroke-width="2"/><path d="M37 8v6M52 14l-3 5M22 14l3 5" stroke="#8A5A2A" stroke-width="2" stroke-linecap="round"/>',


  'adult-life.html':
    '<rect width="74" height="74" fill="#E9EDDF"/><path d="M10 50h22V26" fill="none" stroke="#16283C" stroke-width="2"/><path d="M42 50h22V38" fill="none" stroke="#9C4A21" stroke-width="2"/><path d="M32 38h10" stroke="#8A2B20" stroke-width="1.6" stroke-dasharray="2.5 3"/><circle cx="21" cy="20" r="4" fill="#4A5C2E"/><circle cx="53" cy="32" r="4" fill="#9C4A21"/>',


  'goals-tracker.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><rect x="12" y="14" width="20" height="46" fill="#FFF" stroke="#16283C" stroke-width="1.5"/><rect x="42" y="14" width="20" height="46" fill="#FFF" stroke="#16283C" stroke-width="1.5"/><path d="M32 26h10M32 37h10M32 48h10" stroke="#9C4A21" stroke-width="2"/><circle cx="42" cy="26" r="2.6" fill="#2E4E3F"/><circle cx="42" cy="37" r="2.6" fill="#2E4E3F"/><circle cx="42" cy="48" r="2.6" fill="#C6A98F"/>',

  'share-builder.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="13" y="17" width="20" height="9" fill="#9C4A21"/><rect x="13" y="30" width="20" height="9" fill="#C6A98F" opacity=".85"/><rect x="13" y="43" width="20" height="9" fill="#3A4A5C"/><path d="M37 22h9m-2.5-3 3 3-3 3M37 35h9m-2.5-3 3 3-3 3" stroke="#C6A98F" stroke-width="1.6" fill="none" stroke-linecap="round"/><rect x="50" y="17" width="12" height="35" fill="#FBF7F0"/>',

  'using-these-tools.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><rect x="24" y="12" width="26" height="44" rx="4" fill="#FFF" stroke="#16283C" stroke-width="1.6"/><rect x="29" y="19" width="7" height="7" rx="1.5" fill="#9C4A21"/><rect x="39" y="19" width="7" height="7" rx="1.5" fill="#2E4E3F"/><rect x="29" y="30" width="7" height="7" rx="1.5" fill="#C6A98F"/><rect x="39" y="30" width="7" height="7" rx="1.5" fill="#9C4A21" opacity=".55"/><rect x="31" y="48" width="12" height="2.5" rx="1.2" fill="#16283C" opacity=".35"/>',

  'terms-and-privacy.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><path d="M37 12l18 7v14c0 12-8 20-18 24-10-4-18-12-18-24V19z" fill="none" stroke="#16283C" stroke-width="2"/><path d="M29 37l6 6 12-13" stroke="#9C4A21" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',


  'what-to-do-first.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="14" y="18" width="46" height="4" fill="#9C4A21"/><rect x="14" y="28" width="30" height="4" fill="#C6A98F" opacity=".8"/><rect x="14" y="38" width="38" height="4" fill="#C6A98F" opacity=".6"/><rect x="14" y="48" width="20" height="4" fill="#C6A98F" opacity=".4"/>',

  'care-team-map.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="37" cy="16" r="5" fill="#16283C"/><path d="M37 21v10M37 31H16v8M37 31h21v8M37 31v8" stroke="#2E4E3F" stroke-width="1.5" fill="none"/><circle cx="16" cy="45" r="4.5" fill="#9C4A21"/><circle cx="37" cy="45" r="4.5" fill="#2E4E3F"/><circle cx="58" cy="45" r="4.5" fill="#9C4A21"/>',

  'conditions-library.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="12" y="20" width="50" height="5" rx="2.5" fill="#3A4A5C"/><rect x="18" y="20" width="30" height="5" rx="2.5" fill="#9C4A21"/><rect x="12" y="34" width="50" height="5" rx="2.5" fill="#3A4A5C"/><rect x="30" y="34" width="26" height="5" rx="2.5" fill="#C6A98F"/><rect x="12" y="48" width="50" height="5" rx="2.5" fill="#3A4A5C"/><rect x="14" y="48" width="34" height="5" rx="2.5" fill="#2E4E3F"/>',

  /* one label sitting over others that were there all along */
  'whole-picture.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="30" cy="29" r="15" fill="#2E4E3F" opacity=".62"/><circle cx="45" cy="29" r="15" fill="#9C4A21" opacity=".55"/><circle cx="37" cy="45" r="15" fill="#16283C" opacity=".45"/>',

  'inside-the-iep.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><rect x="17" y="12" width="40" height="50" fill="#FFF" stroke="#16283C" stroke-width="1.5"/><rect x="23" y="22" width="28" height="2.5" fill="#16283C"/><rect x="23" y="30" width="28" height="2.5" fill="#16283C" opacity=".4"/><rect x="23" y="38" width="20" height="2.5" fill="#16283C" opacity=".4"/><rect x="23" y="47" width="28" height="6" fill="#9C4A21"/>',

  'accommodations-finder.html':
    '<rect width="74" height="74" fill="#2E4E3F"/><circle cx="32" cy="32" r="14" fill="none" stroke="#E7EDE5" stroke-width="3"/><path d="M43 43l12 12" stroke="#C6A98F" stroke-width="4" stroke-linecap="round"/>',

  'programs-and-entitlements.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><path d="M14 56V34l23-16 23 16v22" fill="none" stroke="#16283C" stroke-width="2"/><rect x="30" y="40" width="14" height="16" fill="#9C4A21"/>',

  'paying-for-therapy.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="15" y="14" width="44" height="46" fill="#FBF7F0"/><rect x="21" y="23" width="32" height="2" fill="#16283C" opacity=".5"/><rect x="21" y="30" width="32" height="2" fill="#16283C" opacity=".3"/><rect x="21" y="37" width="32" height="2" fill="#16283C" opacity=".3"/><rect x="21" y="47" width="32" height="7" fill="#2E4E3F"/>',

  'template-builders.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><rect x="12" y="16" width="22" height="42" fill="#16283C"/><rect x="40" y="16" width="22" height="42" fill="#FFF" stroke="#16283C" stroke-width="1.5"/><rect x="45" y="24" width="12" height="2" fill="#9C4A21"/><rect x="45" y="31" width="12" height="2" fill="#16283C" opacity=".3"/><rect x="45" y="38" width="8" height="2" fill="#16283C" opacity=".3"/>',

  /* a month of days, only some of them marked */
  'symptom-tracker.html':
    '<rect width="74" height="74" fill="#2E4E3F"/><rect x="11" y="13" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="24" y="13" width="8" height="8" fill="#C6A98F"/><rect x="37" y="13" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="50" y="13" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="11" y="26" width="8" height="8" fill="#9C4A21"/><rect x="24" y="26" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="37" y="26" width="8" height="8" fill="#C6A98F"/><rect x="50" y="26" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="11" y="39" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="24" y="39" width="8" height="8" fill="#9C4A21"/><rect x="37" y="39" width="8" height="8" fill="#9C4A21"/><rect x="50" y="39" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="11" y="52" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="24" y="52" width="8" height="8" fill="#E7EDE5" opacity=".28"/><rect x="37" y="52" width="8" height="8" fill="#C6A98F"/><rect x="50" y="52" width="8" height="8" fill="#E7EDE5" opacity=".28"/>',

  'safety.html':
    '<rect width="74" height="74" fill="#8A2B20"/><rect x="10" y="18" width="12" height="7" fill="#F6E4E0"/><rect x="26" y="18" width="12" height="7" fill="#F6E4E0" opacity=".25"/><rect x="42" y="18" width="22" height="7" fill="#F6E4E0"/><rect x="10" y="33" width="22" height="7" fill="#F6E4E0"/><rect x="36" y="33" width="12" height="7" fill="#F6E4E0" opacity=".25"/><rect x="52" y="33" width="12" height="7" fill="#F6E4E0"/><rect x="10" y="48" width="12" height="7" fill="#F6E4E0" opacity=".25"/><rect x="26" y="48" width="38" height="7" fill="#F6E4E0"/>',

  'injuries-and-illness.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><rect x="31" y="14" width="12" height="46" fill="#9C4A21"/><rect x="14" y="31" width="46" height="12" fill="#9C4A21"/>',

  'occupational-therapy.html':
    '<rect width="74" height="74" fill="#16283C"/><circle cx="19" cy="24" r="6" fill="#9C4A21"/><circle cx="37" cy="24" r="6" fill="#C6A98F" opacity=".7"/><circle cx="55" cy="24" r="6" fill="#C6A98F" opacity=".45"/><circle cx="19" cy="46" r="6" fill="#C6A98F" opacity=".45"/><circle cx="37" cy="46" r="6" fill="#C6A98F" opacity=".7"/><circle cx="55" cy="46" r="6" fill="#9C4A21"/>',

  'physical-therapy.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><rect x="12" y="50" width="8" height="8" fill="#2E4E3F"/><rect x="24" y="43" width="8" height="15" fill="#2E4E3F"/><rect x="36" y="34" width="8" height="24" fill="#9C4A21"/><rect x="48" y="22" width="8" height="36" fill="#9C4A21"/>',

  'speech-language-aac.html':
    '<rect width="74" height="74" fill="#6B4A78"/><rect x="13" y="16" width="20" height="14" rx="3" fill="#EFE6F1"/><rect x="38" y="16" width="23" height="14" rx="3" fill="#EFE6F1" opacity=".5"/><rect x="13" y="34" width="23" height="14" rx="3" fill="#EFE6F1" opacity=".5"/><rect x="41" y="34" width="20" height="14" rx="3" fill="#EFE6F1"/><rect x="13" y="52" width="48" height="8" rx="3" fill="#EFE6F1" opacity=".75"/>',

  'feeding-therapy.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><circle cx="37" cy="37" r="22" fill="none" stroke="#16283C" stroke-width="1.5"/><circle cx="37" cy="37" r="11" fill="none" stroke="#16283C" stroke-width="1.5" opacity=".4"/><path d="M37 15v44" stroke="#9C4A21" stroke-width="2"/>',

  'aquatic-therapy.html':
    '<rect width="74" height="74" fill="#1D6A82"/><path d="M6 28c8-6 14 6 22 0s14 6 22 0 14 6 22 0" fill="none" stroke="#E1EEF2" stroke-width="3"/><path d="M6 40c8-6 14 6 22 0s14 6 22 0 14 6 22 0" fill="none" stroke="#E1EEF2" stroke-width="3" opacity=".65"/><path d="M6 52c8-6 14 6 22 0s14 6 22 0 14 6 22 0" fill="none" stroke="#E1EEF2" stroke-width="3" opacity=".35"/>',

  'myofunctional-therapy.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="37" cy="37" r="21" fill="none" stroke="#16283C" stroke-width="1.5"/><path d="M23 37c5-8 23-8 28 0-5 8-23 8-28 0z" fill="#9C4A21"/>',

  'floortime.html':
    '<rect width="74" height="74" fill="#1F6B63"/><circle cx="28" cy="37" r="15" fill="none" stroke="#E2EFED" stroke-width="3"/><circle cx="46" cy="37" r="15" fill="none" stroke="#E2EFED" stroke-width="3" opacity=".6"/>',

  'music.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="14" y="34" width="5" height="10" fill="#C6A98F"/><rect x="23" y="26" width="5" height="26" fill="#8A6A1F"/><rect x="32" y="18" width="5" height="42" fill="#9C4A21"/><rect x="41" y="28" width="5" height="22" fill="#8A6A1F"/><rect x="50" y="22" width="5" height="34" fill="#C6A98F"/><rect x="59" y="32" width="5" height="14" fill="#C6A98F" opacity=".6"/>',

  /* blocks on a line: sounds being blended */
  'learning-and-literacy.html':
    '<rect width="74" height="74" fill="#16283C"/><rect x="12" y="28" width="16" height="16" fill="#9C4A21"/><rect x="31" y="28" width="16" height="16" fill="#C6A98F"/><rect x="50" y="28" width="12" height="16" fill="#C6A98F" opacity=".45"/><rect x="12" y="50" width="50" height="3" fill="#E7EDE5" opacity=".5"/>',

  /* the gap between knowing and doing */
  'adhd-executive-function.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="17" cy="37" r="7" fill="#2E4E3F"/><rect x="28" y="35" width="10" height="4" fill="#9C4A21"/><rect x="42" y="35" width="6" height="4" fill="#9C4A21" opacity=".55"/><rect x="52" y="35" width="3" height="4" fill="#9C4A21" opacity=".3"/><circle cx="62" cy="37" r="6" fill="none" stroke="#2E4E3F" stroke-width="2" stroke-dasharray="3 3"/>',

  /* the loop that keeps closing */
  'anxiety-and-ocd.html':
    '<rect width="74" height="74" fill="#16283C"/><circle cx="37" cy="37" r="20" fill="none" stroke="#C6A98F" stroke-width="3" stroke-dasharray="92 34"/><circle cx="37" cy="37" r="12" fill="none" stroke="#9C4A21" stroke-width="3" stroke-dasharray="54 22"/><circle cx="37" cy="37" r="4" fill="#E7EDE5"/>',

  /* what is above the water, and what is under it */
  'behavior.html':
    '<rect width="74" height="74" fill="#1F4A6B"/><path d="M37 13l11 17H26z" fill="#F1F4F0"/><rect x="8" y="30" width="58" height="1.5" fill="#C6A98F"/><path d="M37 33l23 29H14z" fill="#F1F4F0" opacity=".42"/>',

  /* it comes down if you let it */
  'de-escalation.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><path d="M9 21c10 0 11 31 21 31s10-23 20-23 8 15 15 15" fill="none" stroke="#9C4A21" stroke-width="3"/><circle cx="65" cy="44" r="4" fill="#2E4E3F"/>',

  /* two sides, one beam */
  'behavior-support.html':
    '<rect width="74" height="74" fill="#2E4E3F"/><rect x="35" y="20" width="4" height="36" fill="#E7EDE5"/><rect x="14" y="24" width="46" height="3" fill="#E7EDE5"/><circle cx="19" cy="37" r="7" fill="#C6A98F"/><circle cx="55" cy="37" r="7" fill="#9C4A21"/><rect x="24" y="56" width="26" height="4" fill="#E7EDE5" opacity=".7"/>',

  'their-own-voice.html':
    '<rect width="74" height="74" fill="#EFE0D5"/><path d="M16 18h42v26H34l-10 10v-10h-8z" fill="#16283C"/><circle cx="30" cy="31" r="2.5" fill="#C6A98F"/><circle cx="38" cy="31" r="2.5" fill="#C6A98F"/><circle cx="46" cy="31" r="2.5" fill="#9C4A21"/>',

  'adaptive-community.html':
    '<rect width="74" height="74" fill="#46508C"/><circle cx="22" cy="26" r="7" fill="#E6E8F2"/><circle cx="52" cy="26" r="7" fill="#E6E8F2" opacity=".6"/><circle cx="37" cy="50" r="7" fill="#E6E8F2" opacity=".8"/><path d="M22 26h30M22 26l15 24M52 26L37 50" stroke="#E6E8F2" stroke-width="1.5" opacity=".55"/>',

  'maplewood-stories.html':
    '<rect width="74" height="74" fill="#FBF7F0"/><path d="M37 20v34" stroke="#16283C" stroke-width="1.5"/><path d="M37 22c-6-6-16-6-22-3v30c6-3 16-3 22 3z" fill="#FFF" stroke="#16283C" stroke-width="1.5"/><path d="M37 22c6-6 16-6 22-3v30c-6-3-16-3-22 3z" fill="#EFE0D5" stroke="#16283C" stroke-width="1.5"/>',

  'about.html':
    '<rect width="74" height="74" fill="#E7EDE5"/><circle cx="26" cy="28" r="8" fill="#16283C"/><circle cx="48" cy="28" r="8" fill="#9C4A21" opacity=".75"/><path d="M12 58c0-9 6-14 14-14s14 5 14 14" fill="#16283C"/><path d="M34 58c0-9 6-14 14-14s14 5 14 14" fill="#9C4A21" opacity=".75"/>'

  };

  /* Expose it so a page can reach in for one mark if it ever needs to. */
  window.ITS_MARKS = MARKS;

  function markFor(href) {
    if (!href) return null;
    var f = href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
    return MARKS[f] || null;
  }

  /* Give every card its page's mark, unless the card already carries one. */
  function paint(root) {
    var cards = (root || document).querySelectorAll('a.pg, a.sit');
    [].forEach.call(cards, function (a) {
      if (a.querySelector('svg.mark, img.mark')) return;
      var art = markFor(a.getAttribute('href'));
      if (!art) return;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'mark');
      svg.setAttribute('viewBox', '0 0 74 74');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.innerHTML = art;
      a.insertBefore(svg, a.firstChild);
    });
  }

  window.ITS_PAINT_MARKS = paint;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { paint(document); });
  } else {
    paint(document);
  }
})();

/* ===================================================================
   15. LIFT — the inspirational callout. Use anywhere on any page:
       <p class="lift">Text here, with <strong>an emphasis</strong>.</p>
       <div class="lift warm">A warmer, boxed version.</div>
   =================================================================== */
(function () {
  'use strict';
  var css = [
    '.lift{font-family:var(--nv-serif);font-size:clamp(1.08rem,2.2vw,1.3rem);line-height:1.5;',
    'color:var(--nv-forest);font-style:italic;text-align:center;max-width:46ch;',
    'margin:34px auto;padding:22px 26px;border-top:1px solid var(--nv-line);',
    'border-bottom:1px solid var(--nv-line)}',
    '.lift strong{font-style:normal;font-weight:400;color:var(--nv-rust)}',
    '.lift.warm{background:#F6F1E8;border:none;border-radius:2px;color:#5A4A2E;text-align:left;max-width:66ch}',
    '.lift.warm strong{color:#8A5A2A}',
    '@media(max-width:520px){.lift{padding:18px 4px;font-size:1.05rem}',
    '.lift.warm{padding:18px 20px}}',
    '@media print{.lift{border-color:#999;color:#000}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();

/* ===================================================================
   16. LIFTS — the short affirming lines placed through the site,
   especially in the hardest sections.

   Edit anything here and it changes on the page. Each entry is:
       'page.html': [ ['heading fragment', 'the line'], ... ]
   The line is added at the END of the section whose h2 contains that
   fragment, so it lands as a breath after the difficult part rather
   than as a preface to it.

   Use <b>…</b> for the emphasised phrase. Add 'warm|' to the start of
   a line to get the softer boxed version instead.
   =================================================================== */
(function () {
  'use strict';

  var LIFTS = {

  'safety.html': [
    ['Water',
     'Reading this page is itself a safety measure. <b>You are already doing the thing that protects people</b> \u2014 learning what to look for before it is needed.'],
    ['Body autonomy',
     'warm|Teaching someone that their <b>no</b> counts is not a small lesson tucked into a difficult page. It may be the single most protective thing anyone ever gives them \u2014 and every ordinary day you honour a refusal, you are teaching it.'],
    ['Teaching safety, honestly',
     'None of this has to be finished. <b>Layers can be added one at a time</b>, and the one you add this month is genuinely worth having on its own.']
  ],

  'injuries-and-illness.html': [
    ['Where to go, right now',
     'You do not need to know everything to keep someone safe. <b>Knowing when to ask is the skill</b> \u2014 and it is one you already have.'],
    ['When the patient can',
     'warm|You are not being difficult when you push for someone to be examined properly. You are doing the one job that nobody else in that building can do: <b>you are the person who knows what they are like when they are well.</b>'],
    ['The parts nobody warns you about',
     'Hard hours pass. <b>They are survivable, and they end</b> \u2014 and the version of you who has already been through one will be steadier next time.']
  ],

  'behavior.html': [
    ['What the behavior might be saying',
     'The fact that you are looking for the meaning at all changes everything. <b>Most people stop at the behavior.</b>'],
    ['What it costs them, on the inside',
     'warm|If you have responded in ways you regret, so has every person who has ever loved someone through something hard. <b>What repairs it is coming back</b> \u2014 and you can do that today, in about a minute, with no plan at all.'],
    ['Be the thing you',
     'You do not have to be calm to be kind. <b>You only have to be a little calmer than the moment</b>, and that is usually within reach.']
  ],

  'de-escalation.html': [
    ['Precursor behavior',
     'Every early sign you learn to see is a hard moment that does not have to happen. <b>You are building something with real value</b>, one noticing at a time.'],
    ['Dysregulation is a communication breakdown',
     'warm|Nobody de-escalates well every time. Not therapists, not the people who write the books. <b>The aim is a slightly better average</b>, not a perfect record \u2014 and a slightly better average changes a childhood.'],
    ['The calming and processing plan',
     'A hard moment worked through together is not a bad day with a repair stuck on the end. <b>It is one of the most useful things that will happen all week.</b>']
  ],

  'behavior-support.html': [
    ['The ABA conversation',
     'warm|There is no answer here that makes you a good or bad parent. <b>You are allowed to weigh it, choose, and change your mind</b> \u2014 and choosing carefully is what good looks like, whichever way you land.'],
    ['Evaluating any behavior support',
     'You know more than you think about whether something is working. <b>Watch your person, not the chart.</b>']
  ],

  'anxiety-and-ocd.html': [
    ['What anxiety looks like in a child',
     'Every accommodation you made was an act of love by someone with no reason to know otherwise. <b>Knowing differently now is the whole opportunity.</b>'],
    ['The treatment that works',
     'warm|Anxiety is among the most treatable things on this entire site. That is worth sitting with for a moment, especially if it has been running your household for years. <b>This one really does get better.</b>'],
    ['School refusal',
     'Small steps count as steps. <b>Ten minutes in the building is not a failed day</b> \u2014 it is the day the direction changed.']
  ],

  'adhd-executive-function.html': [
    ['What is actually hard',
     'None of this is a character problem, and it never was. <b>Difficulty doing is not the same as failing to care</b> \u2014 usually the caring is the loudest part.'],
    ['Strategies that actually work at home',
     'warm|You do not need all of these. <b>Pick one, put it somewhere visible, and let it be the only new thing this month.</b> Systems that survive are the ones that were not competing with four others.'],
    ['Living with it well',
     'The child who hears what they are good at, often and out loud, becomes an adult who knows it. <b>That part is entirely in your gift.</b>']
  ],

  'learning-and-literacy.html': [
    ['Structured literacy',
     'Reading difficulty is one of the most fixable things in this whole field. <b>The right instruction genuinely works</b>, and knowing to ask for it is most of the battle.'],
    ['The specific difficulties',
     'warm|A child struggling to read is not a child who is not trying. They are usually trying harder than anyone in the room. <b>What changes it is method, not effort</b> \u2014 and method is something adults control.'],
    ['At each stage',
     'It is not too late. <b>Older readers make real gains with the right teaching</b> \u2014 later than ideal is not the same as too late.']
  ],

  'whole-picture.html': [
    ['Co-occurrence is the rule',
     'A longer list is not a heavier burden. <b>Every accurate name on it is a door</b> \u2014 and a piece of your person someone finally sees properly.'],
    ['Dominoes and Mentos',
     'warm|If you have been blaming yourself for reacting to the visible thing, stop. <b>Everyone reacts to the visible thing</b> \u2014 it is the only part anyone can see. Learning to look further back is a skill, not a correction.'],
    ['Navigating it over the years',
     'The picture gets clearer. <b>Not all at once, and not completely</b> \u2014 but families almost always understand more at year five than they did at year one.']
  ],

  'feeding-therapy.html': [
    ['ARFID',
     'warm|Nobody has ever fixed this by trying harder at dinner. <b>If mealtimes have been a battle, that was the situation and not your parenting</b> \u2014 and taking the pressure out is a real intervention, not giving up.'],
    ['Declarative language, at the table',
     'Progress here is measured in months and it is real. <b>A calmer table is worth having on its own</b>, before a single new food arrives.']
  ],

  'speech-language-aac.html': [
    ['AAC, properly',
     'warm|There is no moment at which it is too late to give someone a way to be understood. <b>People gain communication at four, at fourteen, and at forty.</b> Every month of access counts, starting whenever it starts.'],
    ['Teaching someone to recount',
     'Every ordinary story someone tells you \u2014 the swimming lesson, the thing the dog did \u2014 is a brick in something that will protect them. <b>The small talk is the work.</b>']
  ],

  'their-own-voice.html': [
    ['One word, four very different children',
     'You do not have to get this conversation right the first time. <b>It is not one conversation</b> \u2014 it is a hundred small ones, and you can always come back and say it better.'],
    ['Growing self-advocacy',
     'warm|Every time you ask instead of assume, you are handing someone a piece of their own life. <b>That transfer is the entire project</b>, and it is made of very ordinary moments.']
  ],

  'what-to-do-first.html': [
    ['',
     'warm|If you have only just started, you are not behind \u2014 you are at the beginning, which is where everyone starts. <b>Do one thing from this page this week.</b> That is enough, and it is more than most people manage in the first month.']
  ],

  'inside-the-iep.html': [
    ['The meeting itself',
     'You are allowed to be the least expert person in the room and still be the most important one. <b>Nobody there knows your child.</b>']
  ],

  'paying-for-therapy.html': [
    ['When a claim is denied',
     'warm|A denial is very often a clerical event rather than a decision. <b>Many are overturned simply because somebody appealed</b> \u2014 and that somebody can be you, on an ordinary afternoon, with a phone.']
  ],

  'programs-and-entitlements.html': [
    ['The ages when something changes',
     'Nobody knows all of this, including the professionals. <b>Asking what else exists is a legitimate question</b>, and it is how most families find the thing they were entitled to all along.']
  ],

  'adult-life.html': [
    ['What changes at eighteen',
     'warm|This page is long because it was allowed to become complicated, not because you are slow to understand it. <b>Take one section at a time</b>, over months if you need to. There is no exam.'],
    ['When you are no longer here',
     'Planning for this is not morbid and it is not giving up. <b>It is one of the most loving pieces of work a person can do</b> \u2014 and doing it tends to make the present easier, not heavier.']
  ],

  'adult-benefits.html': [
    ['Working does not end benefits',
     'If someone has been told they cannot work without losing everything, that is almost certainly wrong. <b>A whole life may be waiting on the other side of that one correction.</b>']
  ],

  'adult-housing.html': [
    ['Subsidized housing, in plain terms',
     'warm|Applying to a list costs nothing and commits you to nothing. <b>You can decline anything you are offered.</b> The only irreversible choice here is not applying.']
  ],

  'adult-providers.html': [
    ['Once they are there',
     'You remain the one person who is not paid to be there and never leaves. <b>That is not a burden \u2014 it is the safeguard nothing else replaces.</b>']
  ],

  'your-own-life.html': [
    ['Things that are true about you',
     'You are allowed to want things. <b>Not just what is safe, or what is available \u2014 what you actually want.</b>'],
    ['If something is wrong',
     'warm|If you have told someone before and nothing happened, that was not you failing. <b>Try again, with someone else.</b> There are people whose whole job is to listen to exactly this, and they are waiting to hear from you.'],
    ['Speaking up for yourself',
     'You have been practising this your whole life, whether anyone called it that. <b>You already know how to be the person who says what they need.</b>']
  ],

  'adaptive-community.html': [
    ['What community offers that therapy cannot',
     'warm|An hour where nobody is measuring your person is not time off from the work. <b>For a lot of people it turns out to be the part that mattered most.</b>']
  ],

  'conditions-library.html': [
    ['',
     'A label is a key, not a description. <b>It opens doors \u2014 it does not tell you who anyone is.</b>']
  ],

  'care-team-map.html': [
    ['',
     'warm|Nobody needs all of these, and no family assembles a team overnight. <b>Two or three good people is a functioning team</b>, and it usually starts with one.']
  ],

  'accommodations-finder.html': [
    ['',
     'Asking for an adjustment is not asking for a favour. <b>It is asking for the version of the day that your person can actually take part in.</b>']
  ],

  'template-builders.html': [
    ['',
     'warm|You have explained your person from scratch more times than anyone should have to. <b>This is the last time you write it out</b> \u2014 after this, you hand it over.']
  ],

  'physical-therapy.html': [
    ['Three things worth knowing',
     'Every extra place a person can get to is a piece of a life. <b>Distance is not the point \u2014 what is at the other end of it is.</b>']
  ],

  'occupational-therapy.html': [
    ['What OT targets',
     'The goal was never to be good at the exercise. <b>It was an easier Tuesday morning</b>, and that is a completely legitimate thing to want.']
  ],

  'floortime.html': [
    ['Why child-led matters',
     'warm|You do not need training to start this afternoon. <b>Get on the floor, join whatever is already happening, and follow.</b> That is not a simplified version of the method \u2014 it is the method.']
  ],

  'music.html': [
    ['What music makes possible',
     'You do not have to be musical. <b>A person who loves you, singing badly, is doing the thing that works.</b>']
  ],

  'aquatic-therapy.html': [
    ['What aquatic therapy targets',
     'Watching someone do in water what they cannot do on land is worth the drive on its own. <b>That is their body, showing you what it knows.</b>']
  ],

  'myofunctional-therapy.html': [
    ['What it actually is',
     'Breathing and sleeping sit underneath everything else. <b>Getting those right can quietly improve things nobody connected to them.</b>']
  ],

  'maplewood-stories.html': [
    ['Why these books exist',
     'warm|A child who sees themselves in a story stops believing they are the only one. <b>That is not a small thing to hand somebody</b> \u2014 for many people it is the thing they remember about being read to.']
  ],

  'symptom-tracker.html': [
    ['',
     'warm|Log what you can, on the days you can. <b>A patchy record beats the memory of an exhausted person at an appointment</b>, and nobody has ever kept one of these perfectly.']
  ],

  'goals-tracker.html': [
    ['',
     'You are the only person who sees every plan. <b>That view is worth more than any individual expert opinion in it.</b>']
  ],

  'share-builder.html': [
    ['',
     'What you choose not to share is as much a decision as what you do. <b>Both belong to you.</b>']
  ],

  'about.html': [
    ['Tell us what',
     'warm|If something here is wrong, or missing, or lands badly \u2014 please say so. <b>Corrections are the most valuable thing anyone sends</b>, and this gets better every time somebody bothers.']
  ]

  };

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var list = LIFTS[file];
  if (!list || !list.length) return;

  function place(frag, text) {
    var warm = false;
    if (text.indexOf('warm|') === 0) { warm = true; text = text.slice(5); }
    var el = document.createElement('p');
    el.className = 'lift' + (warm ? ' warm' : '');
    el.innerHTML = text;

    if (!frag) {
      /* No anchor given: put it after the page intro. */
      var mast = document.querySelector('header.masthead, .masthead');
      if (mast && mast.parentNode) mast.parentNode.insertBefore(el, mast.nextSibling);
      return true;
    }
    var heads = document.querySelectorAll('h2.sec');
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].textContent.indexOf(frag) > -1) {
        var sec = heads[i].closest('section');
        if (sec) { sec.appendChild(el); return true; }
      }
    }
    return false;
  }

  list.forEach(function (row) { place(row[0], row[1]); });
})();
