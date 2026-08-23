const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs', nav=fs.readFileSync(dir+'/site-nav.js','utf8');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
function run(page){
  let html=fs.readFileSync(path.join(dir,page),'utf8').replace('<script src="site-nav.js"></script>','');
  const store={};
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+page,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();}});
  const s=dom.window.document.createElement('script');s.textContent=nav;
  dom.window.document.body.appendChild(s);
  return dom.window;
}
// a page where most sections HAVE a secnote
let w=run('adult-life.html'), d=w.document;
const btn=d.querySelector('.nv-outline');
ok('skim button exists',!!btn);
ok('both modes labelled',btn.textContent.includes('Skim it')&&btn.textContent.includes('Show everything'));
const secs=[...d.querySelectorAll('h2.sec')].map(h=>h.closest('section'));
ok('no gists before clicking',d.querySelectorAll('.nv-gist').length===0);
btn.click();
ok('all sections collapsed',secs.every(s=>s.classList.contains('nv-shut')));
ok('emphasis flips to Show everything',btn.classList.contains('nv-showing'));
// every collapsed section should show SOMETHING under the heading
const described=secs.filter(s=>s.querySelector('.secnote')||s.querySelector('.nv-gist'));
ok(`every section has a line (${described.length}/${secs.length})`,described.length===secs.length);
ok('gists generated for the gaps',d.querySelectorAll('.nv-gist').length>0);
const g=d.querySelector('.nv-gist');
ok('gist is a real sentence',g&&g.textContent.length>40&&g.textContent.length<250);
ok('gist sits right after its heading',g.previousElementSibling.classList.contains('sec'));
btn.click();
ok('expands again',!secs[0].classList.contains('nv-shut'));
// a page with fewer secnotes
w=run('adhd-executive-function.html'); d=w.document;
d.querySelector('.nv-outline').click();
const s2=[...d.querySelectorAll('h2.sec')].map(h=>h.closest('section'));
const d2=s2.filter(s=>s.querySelector('.secnote')||s.querySelector('.nv-gist'));
ok(`sparse page also fully described (${d2.length}/${s2.length})`,d2.length===s2.length);
// single-heading toggle
w=run('safety.html'); d=w.document;
const h1=d.querySelector('h2.sec');
h1.dispatchEvent(new w.Event('click',{bubbles:true}));
ok('single heading folds',h1.closest('section').classList.contains('nv-shut'));
ok('single fold also has a line',!!(h1.closest('section').querySelector('.secnote')||h1.closest('section').querySelector('.nv-gist')));
// no duplicates on repeat
d.querySelector('.nv-outline').click(); d.querySelector('.nv-outline').click(); d.querySelector('.nv-outline').click();
const dupes=[...d.querySelectorAll('section')].filter(s=>s.querySelectorAll('.nv-gist').length>1);
ok('no duplicate gists after repeated toggling',dupes.length===0);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
