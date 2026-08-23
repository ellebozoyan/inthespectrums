const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
function open_(pg,store){
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};}});
  return dom.window;
}
const store={};
// ---- medication ----
let w=open_('medication-list.html',store), d=w.document, $=id=>d.getElementById(id);
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];
ok('5 tabs',d.querySelectorAll('.tab').length===5);
ok('8 time slots',d.querySelectorAll('#whenchips .chip').length===8);
$('mname').value='Melatonin';$('mdose').value='3 mg';$('mwhat').value='sleep onset';
$('mhow').value='Crushed into apple sauce, cold.';
d.querySelectorAll('#whenchips .chip')[6].click();
$('addmed').click();
ok('medication saved',P().meds.items.length===1);
ok('timing saved',P().meds.items[0].when[0]==='Bedtime');
ok('how-taken saved',P().meds.items[0].how.includes('apple sauce'));
$('mname').value='Ibuprofen';$('mstatus').value='prn';$('mwhat').value='fever or pain';$('addmed').click();
ok('as-needed saved',P().meds.items[1].status==='prn');
$('allergies').value='Amoxicillin — rash.';$('saveextra').click();
ok('allergies saved',P().meds.allergies.includes('Amoxicillin'));
d.querySelector('.tab[data-k="day"]').click();
ok('day view has 8 slots',d.querySelectorAll('#slots .slot').length===8);
ok('bedtime slot lists it',d.querySelector('#slots').innerHTML.includes('Melatonin'));
ok('as-needed listed separately',$('prnlist').innerHTML.includes('Ibuprofen'));
d.querySelector('.tab[data-k="changes"]').click();
$('ctext').value='Melatonin 3mg to 5mg';$('addchange').click();
ok('change recorded',P().meds.changes.length===1);
d.querySelector('.tab[data-k="print"]').click();
let doc=$('doc').innerHTML;
ok('print shows allergies first',doc.indexOf('Amoxicillin')<doc.indexOf('Melatonin'));
ok('print has how-taken',doc.includes('apple sauce'));
ok('print has changes',doc.includes('3mg to 5mg'));
$('pview').value='wallet';$('pview').dispatchEvent(new w.Event('change'));
ok('wallet layout drops detail',!$('doc').innerHTML.includes('apple sauce'));
$('pview').value='day';$('pview').dispatchEvent(new w.Event('change'));
ok('day layout groups by time',$('doc').innerHTML.includes('Bedtime'));

// ---- food, same shared store ----
w=open_('food-list.html',store); d=w.document; $=id=>d.getElementById(id);
ok('food sees the same person',$('foodcount')!==null);
$('fname').value='Chicken nuggets — Brand X, dinosaur shapes';
$('fhow').value='Oven not microwave. Blue plate. Not touching anything.';
$('addfood').click();
ok('food saved',P().food.items.length===1);
ok('medication survived',P().meds.items.length===2);
$('fname').value='Yogurt tubes';$('fstatus').value='lost';$('addfood').click();
ok('lost food saved',P().food.items[1].status==='lost');
ok('counts render',d.querySelectorAll('#counts .cnt').length===5);
$('allerg').value='No nuts.';$('genrules').value='Nothing is asked at the table.';$('saveinfo').click();
ok('rules saved',P().food.rules.includes('Nothing is asked'));
d.querySelector('.tab[data-k="print"]').click();
doc=$('doc').innerHTML;
ok('print has accepted list',doc.includes('Brand X'));
ok('print has the preparation detail',doc.includes('Blue plate'));
ok('default layout hides lost foods',!doc.includes('Yogurt tubes'));
$('pview').value='clin';$('pview').dispatchEvent(new w.Event('change'));
ok('clinician layout shows lost foods',$('doc').innerHTML.includes('Yogurt tubes'));
ok('clinician layout has summary',$('doc').innerHTML.includes('reliably accepted'));

// ---- share builder picks both up ----
w=open_('share-builder.html',store); d=w.document; $=id=>d.getElementById(id);
const btns=[...d.querySelectorAll('#presets button')];
btns.find(b=>b.textContent.includes('doctor')).click();
doc=$('doc').innerHTML;
ok('doctor packet has medication',doc.includes('Melatonin'));
ok('doctor packet has med changes',doc.includes('3mg to 5mg'));
ok('doctor packet has food list',doc.includes('Brand X'));
btns.find(b=>b.textContent.includes('New teacher')).click();
doc=$('doc').innerHTML;
ok('teacher packet has food',doc.includes('Brand X'));
ok('teacher packet has NO medication',!doc.includes('Melatonin'));
btns.find(b=>b.textContent.includes('babysitter')).click();
doc=$('doc').innerHTML;
ok('sitter packet has medication',doc.includes('Melatonin'));
ok('sitter packet has food',doc.includes('Brand X'));
ok('sitter packet has NO goals',!doc.includes('<th>Status</th>'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
