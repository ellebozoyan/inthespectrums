const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg){
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};}}).window;
}
const DBn=()=>JSON.parse(store['its_family_v1']);
const byName=(n)=>{const D=DBn();const k=Object.keys(D.people).find(k=>D.people[k].name===n||k===n);return D.people[k];};
const keyOf=(n)=>{const D=DBn();return Object.keys(D.people).find(k=>D.people[k].name===n||k===n);};
// --- person A: medication + a meal plan
let w=open_('medication-list.html'),d=w.document,$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="setup"]').click();
$('childname').value='Ada';$('savesetup').click();
d.querySelector('.tab[data-k="list"]').click();
$('mname').value='Melatonin';d.querySelectorAll('#whenchips .chip')[6].click();$('addmed').click();
// meal plan for Ada
w=open_('food-list.html');d=w.document;$=id=>d.getElementById(id);
$('fname').value='Toast';$('addfood').click();
w=open_('meal-planner.html');d=w.document;$=id=>d.getElementById(id);
const todayIdx=new Date().getDay();
[...d.querySelectorAll('#week [data-add]')].find(b=>b.dataset.add.startsWith(todayIdx+'|Breakfast')).click();
$('poptions').querySelector('[data-p]').click();
ok('meal planned for Ada',Object.keys(byName('Ada').plan.weeks).length===1);
// --- person B
w=open_('family-calendar.html');d=w.document;$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="setup"]').click();
// add a second person via the goals tracker (shares the layer)
let w2=open_('goals-tracker.html'),d2=w2.document;
d2.querySelector('.tab[data-k="setup"]').click();
d2.getElementById('newperson').value='Ben';d2.getElementById('addperson').click();
ok('two people exist',Object.keys(DBn().people).length===2);
// give Ben a medication
w2=open_('medication-list.html');d2=w2.document;
d2.getElementById('mname').value='Inhaler';
d2.querySelectorAll('#whenchips .chip')[1].click();
d2.getElementById('addmed').click();
ok('Ben has medication',byName('Ben').meds.items.length===1);

// --- calendar with both
w=open_('family-calendar.html');d=w.document;$=id=>d.getElementById(id);
ok('whose bar shows both people plus Everyone',d.querySelectorAll('#whobar button').length===3);
// adding a person switches to them; select Ada explicitly
[...d.querySelectorAll('#whobar button')].find(b=>b.textContent.includes('Ada')).click();
ok('each person has a colour',byName('Ada').color&&byName('Ben').color&&byName('Ada').color!==byName('Ben').color);
ok('meal appears from the planner',$('wall').innerHTML.includes('Toast'));
// everyone view
[...d.querySelectorAll('#whobar button')].find(b=>b.textContent==='Everyone').click();
ok('everyone view shows both medications',$('wall').innerHTML.includes('Melatonin')&&$('wall').innerHTML.includes('Inhaler'));
ok('colour dots rendered',d.querySelectorAll('#wall .pdot').length>0);
ok('names tagged in shared view',$('wall').innerHTML.includes('Ada')&&$('wall').innerHTML.includes('Ben'));
// privacy: hide Ben's medication from the shared screen
d.querySelector('.tab[data-k="people"]').click();
ok('settings show both people',d.querySelectorAll('#peoplesettings .psetting').length===2);
const benCard=[...d.querySelectorAll('#peoplesettings .psetting')].find(c=>c.textContent.includes('Ben'));
const medBox=benCard.querySelector('[data-s="meds"]');
medBox.checked=false;medBox.dispatchEvent(new w.Event('change'));
ok('Ben medication hidden flag saved',byName('Ben').show.meds===false);
d.querySelector('.tab[data-k="today"]').click();
ok('shared view now hides Ben medication',!$('wall').innerHTML.includes('Inhaler'));
ok('shared view still shows Ada medication',$('wall').innerHTML.includes('Melatonin'));
// Ben's own view still shows it
[...d.querySelectorAll('#whobar button')].find(b=>b.textContent.includes('Ben')).click();
ok("Ben's own view still shows it",$('wall').innerHTML.includes('Inhaler'));
// colour change
d.querySelector('.tab[data-k="people"]').click();
const swatch=benCard.querySelectorAll('[data-c]')[3];
swatch.click();
ok('colour changed',byName('Ben').color===swatch.dataset.c);
// month view
d.querySelector('.tab[data-k="today"]').click();
$('span').value='month';$('span').dispatchEvent(new w.Event('change'));
ok('month grid has 42 cells',d.querySelectorAll('#wall .mcell').length===42);
ok('month has weekday headers',d.querySelectorAll('#wall .mhead span').length===7);
ok('month marks today',d.querySelector('#wall .mcell.istoday')!==null);
ok('month greys other months',d.querySelectorAll('#wall .mcell.out').length>0);
$('span').value='week';$('span').dispatchEvent(new w.Event('change'));
ok('week still works',d.querySelectorAll('#wall .wcol').length===7);
$('span').value='day';$('span').dispatchEvent(new w.Event('change'));
ok('day still works',d.querySelectorAll('#wall .wrow').length>0);
ok('ticking still works',d.querySelectorAll('#wall [data-tick]').length>0);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
