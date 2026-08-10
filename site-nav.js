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
