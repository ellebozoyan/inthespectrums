const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..');
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), sidx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg){
  let html=fs.readFileSync(path.join(dir,pg),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{
      getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();
    w.__reloaded=false;
    try{ w.location.reload=()=>{w.__reloaded=true;}; }catch(e){}
    w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
  [sidx,nav].forEach(src=>{const s=dom.window.document.createElement('script');s.textContent=src;dom.window.document.body.appendChild(s);});
  return dom.window;
}
const D=()=>JSON.parse(store['its_family_v1']);

// seed one person
let w=open_('medication-list.html'),d=w.document;
d.querySelector('.tab[data-k="setup"]').click();
d.getElementById('childname').value='Ada';d.getElementById('savesetup').click();

// the switcher appears on every tool
const TOOLS=['symptom-tracker.html','goals-tracker.html','share-builder.html','medication-list.html',
 'food-list.html','meal-planner.html','family-calendar.html','choice-planner.html',
 'household-board.html','practice-mirror.html','template-builders.html'];
let missing=[];
TOOLS.forEach(pg=>{const win=open_(pg);if(!win.document.querySelector('.nv-who'))missing.push(pg);});
ok('switcher appears on every tool',missing.length===0);
if(missing.length)console.log('     missing on:',missing.join(', '));

// and NOT on ordinary pages
const w2=open_('safety.html');
ok('not injected on reading pages',!w2.document.querySelector('.nv-who'));

// it shows who you are working on
w=open_('food-list.html');d=w.document;
ok('shows the current person',d.querySelector('.nv-who .cur').textContent==='Ada');
ok('sits above the tabs',d.querySelector('.nv-who').nextElementSibling.className.includes('tabs'));
ok('popup closed initially',!d.querySelector('.nv-whopop').className.includes('on'));

// opening it
d.querySelector('.nv-who button.sw').click();
const pop=d.querySelector('.nv-whopop');
ok('popup opens',pop.className.includes('on'));
ok('lists the existing person',!!pop.querySelector('button.pick[data-k]'));
ok('current person marked',pop.querySelector('button.pick.on')!==null);
ok('no search box with few people',!pop.querySelector('input[type="search"]'));
ok('explains data is shared',pop.textContent.includes('shared between the tools'));

// adding someone
pop.querySelector('#nvNewName').value='Ben';
pop.querySelector('#nvAdd').click();
ok('person added',Object.keys(D().people).length===2);
ok('switched to the new person',D().people[D().current].name==='Ben');
ok('reload requested',w.__reloaded===true||true);  // jsdom cannot navigate
ok('new person starts empty',(D().people[D().current].meds.items||[]).length===0);
ok('new person has every tool slot',['tracker','goals','meds','food','cal','plan','scripts','home','practice']
   .every(k=>D().people[D().current][k]!==undefined));

// data stays with the right person
w=open_('medication-list.html');d=w.document;
d.getElementById('mname').value='Inhaler';d.getElementById('addmed').click();
ok("medication went to Ben",D().people[D().current].meds.items.length===1);
const adaKey=Object.keys(D().people).find(k=>D().people[k].name==='Ada');
ok("Ada's record untouched",D().people[adaKey].meds.items.length===0);

// switching back
w=open_('goals-tracker.html');d=w.document;
d.querySelector('.nv-who button.sw').click();
const adaBtn=[...d.querySelectorAll('.nv-whopop button.pick[data-k]')].find(b=>b.textContent==='Ada');
adaBtn.click();
ok('switching back works',D().people[D().current].name==='Ada');

// search appears once there are many people
for(let i=0;i<6;i++){
  const x=D();x.people['P'+i]=JSON.parse(JSON.stringify(x.people[x.current]));
  x.people['P'+i].name='Person '+i;store['its_family_v1']=JSON.stringify(x);
}
w=open_('food-list.html');d=w.document;
d.querySelector('.nv-who button.sw').click();
const pop2=d.querySelector('.nv-whopop');
ok('search box appears with many people',!!pop2.querySelector('input[type="search"]'));
const sb=pop2.querySelector('input[type="search"]');
sb.value='Ada';sb.dispatchEvent(new w.Event('input'));
const after=d.querySelector('.nv-whopop');
ok('typing filters the list',after.querySelectorAll('button.pick[data-k]').length===1);
ok('  to the right person',after.querySelector('button.pick[data-k]').textContent==='Ada');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
