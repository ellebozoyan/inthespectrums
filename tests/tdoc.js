const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), sidx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg,withNav){
  let html=fs.readFileSync(path.join(dir,pg),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('CSS/JS ERROR in '+pg+':',e.message.split('\n')[0]));
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();}});
  if(withNav){[sidx,nav].forEach(src=>{const s=dom.window.document.createElement('script');s.textContent=src;dom.window.document.body.appendChild(s);});}
  return dom.window;
}
// seed one person with data across the tools
let w=open_('medication-list.html'),d=w.document,$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="setup"]').click();
$('childname').value='A.B.';$('childdob').value='9 years old';$('weight').value='28 kg';$('savesetup').click();
d.querySelector('.tab[data-k="list"]').click();
$('mname').value='Something';$('mbrand').value='AMaker';$('mdose').value='3 mg';
$('mroute').value='Oral syringe';$('mfreq').value='Once daily';$('mkind').value='supp';
d.querySelectorAll('#whenchips .chip')[6].click();$('addmed').click();
$('allergies').value='Amoxicillin — rash.';$('delivery').value='Everything by oral syringe.';$('saveextra').click();

// medication doc, with the nav stylesheet applied
w=open_('medication-list.html',true);d=w.document;$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="print"]').click();
let doc=d.querySelector('.doc');
ok('med: info block rendered',!!doc.querySelector('.info dl'));
ok('med: name in the info block',doc.querySelector('.info').textContent.includes('A.B.'));
ok('med: weight in the info block',doc.querySelector('.info').textContent.includes('28 kg'));
ok('med: delivery route in the info block',doc.querySelector('.info').textContent.includes('oral syringe'));
ok('med: allergies flagged as alert',!!doc.querySelector('h2.alert'));
ok('med: subtitle is just the date',doc.querySelector('.sub').textContent.trim().startsWith('Updated'));
ok('med: table has a header row',!!doc.querySelector('table th'));
const st=w.getComputedStyle(doc);
ok('med: document is white',/rgb\(255, 255, 255\)|#fff/i.test(st.background+st.backgroundColor));
const h1=w.getComputedStyle(doc.querySelector('h1'));
ok('med: title centred',h1.textAlign==='center');
const h2=w.getComputedStyle(doc.querySelector('h2'));
ok('med: headings have a rule beneath',parseFloat(h2.borderBottomWidth)>=2);
const th=w.getComputedStyle(doc.querySelector('table th'));
ok('med: table header is solid dark',/27, 48, 73/.test(th.backgroundColor));
ok('med: table header text is white',/255, 255, 255/.test(th.color));

// the other documents pick up the same style
[['food-list.html','food'],['goals-tracker.html','goals'],['symptom-tracker.html','symptoms'],
 ['share-builder.html','share'],['meal-planner.html','meals'],['household-board.html','board'],
 ['choice-planner.html','scripts'],['practice-mirror.html','practice']].forEach(function(pair){
  const win=open_(pair[0],true), dd=win.document;
  const dc=dd.querySelector('.doc');
  if(!dc){ok(pair[1]+': has a document',false);return;}
  const s2=win.getComputedStyle(dc);
  ok(pair[1]+': white document',/rgb\(255, 255, 255\)/.test(s2.backgroundColor));
  ok(pair[1]+': serif body',/Georgia/i.test(s2.fontFamily));
});
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
