const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), sidx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
function open_(pg,store){
  store=store||{};
  let html=fs.readFileSync(path.join(dir,pg),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const loaded=[];
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,resources:undefined,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{
      getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};
    const realCreate=w.document.createElement.bind(w.document);
    w.document.createElement=function(t){const e=realCreate(t);
      if(t==='script'){Object.defineProperty(e,'src',{set(v){loaded.push(v);},get(){return '';}});}
      return e;};}});
  [sidx,nav].forEach(src=>{const s=dom.window.document.createElement('script');s.textContent=src;dom.window.document.body.appendChild(s);});
  dom.window.__loaded=loaded;
  return dom.window;
}
let w=open_('index.html'),d=w.document;
ok('language button added',!!d.querySelector('.nv-langbtn'));
ok('button labelled Language',d.querySelector('.nv-langbtn').textContent==='Language');
ok('button excluded from translation',d.querySelector('.nv-langbtn').getAttribute('translate')==='no');
ok('nothing loaded on page load',!w.__loaded.some(u=>/translate\.google/.test(u)));
ok('no panel until asked',!d.querySelector('.nv-lang'));
d.querySelector('.nv-langbtn').click();
const panel=d.querySelector('.nv-lang');
ok('panel opens',panel.classList.contains('on'));
ok('browser translation offered first',panel.innerHTML.indexOf('Your own browser can do it')<panel.innerHTML.indexOf('Or translate it here'));
ok('per-browser instructions',['Chrome','Safari','Firefox'].every(b=>panel.innerHTML.includes(b)));
const opts=panel.querySelectorAll('select option');
ok('over 100 languages offered',opts.length>100);
ok('languages shown in their own script',panel.innerHTML.includes('\u0627\u0644\u0639\u0631\u0628\u064A\u0629')&&panel.innerHTML.includes('\u4E2D\u6587'));
ok('Spanish present',[...opts].some(o=>o.value==='es'));
ok('Portuguese present',[...opts].some(o=>o.value==='pt'));
ok('privacy warning before the dropdown',panel.querySelector('.warnbox').textContent.includes('Google will know you visited'));
ok('says it stays off until chosen',panel.querySelector('.warnbox').textContent.includes('switched off until you choose'));
ok('accuracy caution present',panel.textContent.includes('Machine translation makes mistakes'));
ok('mentions the right to an interpreter',panel.textContent.includes('interpreter free of charge'));
ok('still nothing loaded',!w.__loaded.some(u=>/translate\.google/.test(u)));
// choosing a language loads it
const sel=panel.querySelector('select');
sel.value='es';sel.dispatchEvent(new w.Event('change'));
ok('script loads only after choosing',w.__loaded.some(u=>/translate\.google/.test(u)));
// right-to-left handling
const store2={};
let w2=open_('index.html',store2),d2=w2.document;
d2.querySelector('.nv-langbtn').click();
const s2=d2.querySelector('.nv-lang select');
s2.value='ar';s2.dispatchEvent(new w2.Event('change'));
ok('right-to-left applied for Arabic',d2.documentElement.getAttribute('dir')==='rtl');
ok('choice remembered',store2['its_lang']==='ar');
s2.value='fr';s2.dispatchEvent(new w2.Event('change'));
ok('back to left-to-right for French',d2.documentElement.getAttribute('dir')==='ltr');
// a saved choice reapplies on the next page without asking
const w3=open_('safety.html',{its_lang:'es'});
ok('saved choice reapplied silently',w3.__loaded.some(u=>/translate\.google/.test(u)));
ok('panel not forced open',!w3.document.querySelector('.nv-lang.on'));
// privacy policy tells the truth
const terms=fs.readFileSync(dir+'/terms-and-privacy.html','utf8');
ok('policy names the exception',terms.includes('The one exception, and it is yours to make'));
ok('policy says not loaded unless chosen',terms.includes('not loaded unless you choose a language'));
ok('policy still says no analytics',terms.includes('we do not use third-party analytics'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
