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
      ['what-to-do-first.html',        'What to do first',        'The first 90 days, and the scripts that start legal clocks'],
      ['care-team-map.html',           'The care team map',       'Forty-five specialties — who does what, and why you\u2019d call them'],
      ['conditions-library.html',      'The conditions library',  'Thirty-three conditions, how widely each varies, what helps']
    ]},
    { label: 'School and services', items: [
      ['inside-the-iep.html',          'Inside the IEP',          'Reading a goal, the words that matter, the section you write'],
      ['accommodations-finder.html',   'Accommodations finder',   'Search by the difficulty you see, get wording you can request'],
      ['programs-and-entitlements.html','Programs and entitlements','What exists, when each door opens, the ages that matter']
    ]},
    { label: 'Money and paperwork', items: [
      ['paying-for-therapy.html',      'Paying for it',           'In-network vs out, the annotated superbill, appeals'],
      ['template-builders.html',       'Template builders',       'Four documents that build themselves as you type']
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
    { label: 'Community and the child', items: [
      ['adaptive-community.html',      'Adaptive sports and community','Programs, days out, parking and travel'],
      ['their-own-voice.html',         'Their own voice',         'Talking with a child about their own life'],
      ['maplewood-stories.html',       'The Maplewood stories',   'Fifty-two picture books about ten friends']
    ]},
    { label: 'About', items: [
      ['about.html',                   'About and contributors',  'Who writes this, and how to tell us what\u2019s wrong']
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
    '.nv-in{max-width:1040px;margin:0 auto;padding:0 22px;height:56px;display:flex;',
    'align-items:center;justify-content:space-between;gap:16px}',
    '.nv-logo{font-family:var(--nv-serif);font-size:1.05rem;color:var(--nv-ink);text-decoration:none;',
    'letter-spacing:-.01em;white-space:nowrap}',
    '.nv-logo em{font-style:italic;color:var(--nv-forest)}',
    '.nv-quick{display:flex;gap:20px;font-family:var(--nv-sans);font-size:13px}',
    '.nv-quick a{color:var(--nv-soft);text-decoration:none;letter-spacing:.02em;white-space:nowrap}',
    '.nv-quick a:hover,.nv-quick a[aria-current]{color:var(--nv-rust)}',
    '.nv-quick a[aria-current]{font-weight:700}',
    '@media(max-width:840px){.nv-quick{display:none}}',
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
  var quick = [
    ['what-to-do-first.html','Start here'],
    ['care-team-map.html','Care team'],
    ['conditions-library.html','Conditions'],
    ['inside-the-iep.html','School'],
    ['safety.html','Safety'],
    ['about.html','About']
  ];
  var qHtml = quick.map(function (q) {
    return '<a href="' + q[0] + '"' + (q[0] === here ? ' aria-current="page"' : '') + '>' + q[1] + '</a>';
  }).join('');

  var bar = el('div', 'nv-bar');
  bar.innerHTML =
    '<div class="nv-in">' +
      '<a class="nv-logo" href="' + HOME + '">In The <em>Spectrums</em></a>' +
      '<nav class="nv-quick" aria-label="Main">' + qHtml + '</nav>' +
      '<button class="nv-burger" id="nvOpen" aria-expanded="false" aria-controls="nvDrawer">' +
        '<i aria-hidden="true"></i>All pages</button>' +
    '</div>';
  document.body.insertBefore(bar, document.body.firstChild);

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
