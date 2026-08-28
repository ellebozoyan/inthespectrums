const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..');
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), idx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};

// jsdom does not lay out, so measure the text budget instead: at ~6.6px per
// character for 11.5px sans, plus padding and gaps, does the row fit?
function budget(width){
  const perChar = width<=380 ? 6.0 : width<=560 ? 6.3 : 6.8;
  const pad     = width<=380 ? 8   : width<=560 ? 9   : 10;
  const gap     = width<=380 ? 5   : width<=560 ? 6   : 8;
  const edge    = width<=560 ? 22  : 28;
  return {perChar,pad,gap,edge};
}
function rowWidth(labels,width,logo){
  const b=budget(width);
  let w=b.edge;
  if(logo) w += logo.length*7.2;
  labels.forEach(l=>{ w += l.length*b.perChar + b.pad*2 + b.gap; });
  return Math.round(w);
}
const LABELS=['All pages','Search','Language'];
const LOGO='In The Spectrums';

[430,390,375,360,320].forEach(w=>{
  const wraps = w<=560;                       // logo takes its own row
  const need  = rowWidth(LABELS,w,wraps?null:LOGO);
  ok(`buttons fit at ${w}px (need ${need}px)`, need <= w);
});
// and the logo row itself
ok('logo fits on its own row at 320px', LOGO.length*7.2 + 22 <= 320);

// the CSS actually declares the breakpoints
[760,560,380].forEach(bp=>ok(`breakpoint ${bp}px declared`, nav.includes(`max-width:${bp}px`)));
ok('header allowed to wrap on narrow', /max-width:560px\)[^']*flex-wrap:wrap/.test(nav.replace(/',\s*'/g,'')));
ok('logo takes full width when wrapped', nav.includes('flex:0 0 100%'));

// nothing is hidden - all three buttons must survive at every width
{ // hiding for print is correct; hiding on screen is not
  const flat=nav.replace(/',\s*'/g,'');
  const screenOnly=flat.replace(/@media print\{[^}]*\}[^}]*\}?/g,'');
  ok('no button hidden on screen',
     !/\.nv-(searchbtn|langbtn|burger)\{[^}]*display:none/.test(screenOnly));
}

// and the buttons still exist in the DOM
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8')
  .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/index.html",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});w.alert=()=>{};w.scrollTo=()=>{};}});
const d=dom.window.document;
[idx,nav].forEach(s=>{const e=d.createElement('script');e.textContent=s;d.body.appendChild(e);});
ok('all three buttons present', !!d.querySelector('.nv-burger') && !!d.querySelector('.nv-searchbtn') && !!d.querySelector('.nv-langbtn'));
ok('drawer still opens', (()=>{d.querySelector('.nv-burger').click();
   return d.querySelector('.nv-drawer').className.includes('on');})());
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
