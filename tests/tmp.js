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
// seed foods including a target
let w=open_('food-list.html'),d=w.document,$=id=>d.getElementById(id);
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];
ok('target option exists',[...d.querySelectorAll('#fstatus option')].some(o=>o.value==='target'));
$('fname').value='Chicken nuggets';$('addfood').click();
$('fname').value='Toast';$('addfood').click();
$('fname').value='Strawberries';$('fstatus').value='target';$('addfood').click();
$('fname').value='Peas';$('fstatus').value='trying';$('addfood').click();
ok('4 foods saved',P().food.items.length===4);
ok('target saved',P().food.items[2].status==='target');
ok('5 count tiles',d.querySelectorAll('#counts .cnt').length===5);
d.querySelector('.tab[data-k="print"]').click();
$('pview').value='clin';$('pview').dispatchEvent(new w.Event('change'));
ok('clinician print separates target',$('doc').innerHTML.includes('hoping to get to'));
ok('summary counts targets',$('doc').innerHTML.includes('targeted'));

// planner
w=open_('meal-planner.html');d=w.document;$=id=>d.getElementById(id);
ok('3 tabs',d.querySelectorAll('.tab').length===3);
ok('goal 0..7 offered',d.querySelectorAll('#goalrow button').length===8);
ok('7 day cards',d.querySelectorAll('#week .dayc').length===7);
ok('4 meals per day',d.querySelectorAll('#week .dayc')[0].querySelectorAll('.mealslot').length===4);
ok('everyone option in who',[...d.querySelectorAll('#who option')].some(o=>o.value==='__all'));
// zero goal is honoured and affirmed
d.querySelectorAll('#goalrow button')[0].click();
ok('goal 0 saved',P().plan.goal===0);
ok('zero framed positively',$('prog').textContent.includes('perfectly good plan'));
d.querySelectorAll('#goalrow button')[2].click();
ok('goal 2 saved',P().plan.goal===2);
// pick an accepted food
d.querySelector('#week [data-add]').click();
ok('picker opens',$('picker').className.includes('on'));
ok('accepted group shown',$('poptions').innerHTML.includes('Foods that work'));
ok('new group shown',$('poptions').innerHTML.includes('Something new'));
ok('target marked as chosen by them',$('poptions').innerHTML.includes('a target you set'));
$('poptions').querySelector('[data-p]').click();
ok('picker closes after choosing',!$('picker').className.includes('on'));
const wkKey=Object.keys(P().plan.weeks)[0];
ok('meal saved',Object.keys(P().plan.weeks[wkKey]).length===1);
ok('chosen item renders',$('week').innerHTML.includes('Chicken nuggets'));
ok('not counted as new',P().plan.weeks[wkKey][Object.keys(P().plan.weeks[wkKey])[0]][0].isNew===false);
// pick a target food — counts toward the goal
d.querySelectorAll('#week [data-add]')[1].click();
const tgtBtn=[...$('poptions').querySelectorAll('[data-p]')].find(b=>b.textContent.includes('Strawberries'));
tgtBtn.click();
ok('new food flagged',$('prog').textContent.includes('1 of 2'));
ok('new badge shown',$('week').innerHTML.includes('something new'));
// free text
d.querySelectorAll('#week [data-add]')[2].click();
$('freetext').value="Grandma's pasta";$('addfree').click();
ok('free text added',$('week').innerHTML.includes('Grandma'));
// exceeding own goal is gentle
d.querySelectorAll('#week [data-add]')[3].click();
[...$('poptions').querySelectorAll('[data-p]')].find(b=>b.textContent.includes('Peas')).click();
d.querySelectorAll('#week [data-add]')[4].click();
[...$('poptions').querySelectorAll('[data-p]')].find(b=>b.textContent.includes('Strawberries')).click();
ok('over goal phrased gently',$('prog').textContent.includes('Only if you want to'));
// shopping list
d.querySelector('.tab[data-k="list"]').click();
ok('shopping list built',$('shopping').innerHTML.includes('Chicken nuggets'));
ok('week written out',$('weeklist').innerHTML.includes('(new)')||$('weeklist').innerHTML.includes('Strawberries'));
// print
d.querySelector('.tab[data-k="print"]').click();
ok('menu prints',$('doc').innerHTML.includes('The week'));
ok('print notes it was their choice',$('doc').innerHTML.includes('chosen by the person eating'));
$('pview').value='shop';$('pview').dispatchEvent(new w.Event('change'));
ok('shopping print works',$('doc').innerHTML.includes('Shopping list'));
// clear
d.querySelector('.tab[data-k="plan"]').click();
$('clearweek').click();
ok('week cleared',!Object.keys(P().plan.weeks[wkKey]||{}).length);
ok('food list untouched',P().food.items.length===4);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
