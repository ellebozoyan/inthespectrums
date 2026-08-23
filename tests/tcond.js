const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
function open_(hash){
  let html=fs.readFileSync(path.join(dir,'conditions-library.html'),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/conditions-library.html"+(hash||''),virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
    w.alert=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();w.history.replaceState=()=>{};}}).window;
}
const w=open_();
const ids=w.eval('C.map(c=>c.id)');
ok('entries load',ids.length>=36);

// EVERY entry must render. A missing field throws and the entry silently
// cannot be opened — this has happened twice.
const broken=[];
ids.forEach(id=>{try{w.eval(`open_("${id}")`);}catch(e){broken.push(id);}});
ok('every entry renders without throwing',broken.length===0);
if(broken.length)console.log('     broken:',broken.join(', '));

// required schema
const REQ=['id','cat','name','hook','what','range','axes','signs','helps','missed','unlock','learn'];
const missing=[];
w.eval('C').forEach?0:0;
const data=JSON.parse(w.eval('JSON.stringify(C)'));
data.forEach(c=>{REQ.forEach(k=>{if(c[k]===undefined)missing.push(c.id+'.'+k);});});
ok('every entry has all required fields',missing.length===0);
if(missing.length)console.log('     missing:',missing.slice(0,8).join(', '));
ok('no entry uses the wrong field names',!data.some(c=>c.watch!==undefined||c.myth!==undefined||c.money!==undefined));
ok('axes are well formed',data.every(c=>Array.isArray(c.axes)&&c.axes.every(a=>a.l&&typeof a.f==='number'&&typeof a.t==='number')));
ok('list fields are arrays',data.every(c=>Array.isArray(c.signs)&&Array.isArray(c.helps)&&Array.isArray(c.missed)));
ok('categories are valid',data.every(c=>['neuro','body','mind','access'].includes(c.cat)));
ok('ids are unique',new Set(data.map(c=>c.id)).size===data.length);

// deep linking from search
const w2=open_('#fnd');
ok('a deep link opens the entry',w2.document.getElementById('detail').className.includes('open'));
ok('  and shows the right one',w2.document.getElementById('dname').textContent.includes('Functional neurological'));
const w3=open_('#nonsense-id');
ok('an unknown hash is ignored safely',!w3.document.getElementById('detail').className.includes('open'));

// FND specifically
const fnd=data.find(c=>c.id==='fnd');
ok('FND present',!!fnd);
ok('  says it is not a diagnosis of exclusion',JSON.stringify(fnd).includes('ruled in'));
ok('  corrects the imagined myth',JSON.stringify(fnd).includes('not in control of them'));
ok('  notes it can coexist with other conditions',JSON.stringify(fnd).includes('coexists'));

// cross-category notes
const withAlso=data.filter(c=>c.also);
ok('some entries carry a cross-category note',withAlso.length>=15);
ok('CVI says it is brain-based, not ocular',(data.find(c=>c.id==='cvi')||{}).also?.includes('not an eye condition'));
ok('the note renders',(()=>{const w4=open_('#cvi');return !!w4.document.querySelector('.dalso');})());
ok('entries without the field still render',(()=>{const c=data.find(x=>!x.also);if(!c)return true;
  try{w.eval(`open_("${c.id}")`);return true;}catch(e){return false;}})());

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
