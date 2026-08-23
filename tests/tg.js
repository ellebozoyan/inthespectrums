const {JSDOM}=require('jsdom'),fs=require('fs');
let html=fs.readFileSync('/mnt/user-data/outputs/goals-tracker.html','utf8').replace('<script src="site-nav.js"></script>','');
const store={};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]}});
    w.confirm=()=>true;w.alert=()=>{};w.print=()=>{};}});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const DB=()=>JSON.parse(store['its_family_v1']);
const P=()=>DB().people[DB().current];

ok('4 tabs',d.querySelectorAll('.tab').length===4);
// add goals
const add=(prov,code,text,status)=>{$('gprov').value=prov;$('gcode').value=code;$('gtext').value=text;$('gstatus').value=status||'current';$('addgoal').click();};
add('Speech','SLP 1.1','Will ask wh-questions with fading models.');
add('Speech','SLP 1.2','Will retell an event with key story elements.');
add('OT','OT 1.4','Will write the letters of his name on a line.');
add('OT','OT 1.14','Will use zones of regulation and seek a tool.','next');
add('PT','PT 1.1','Will descend stairs holding one rail, reciprocal pattern.');
ok('5 goals saved',P().goals.items.length===5);
ok('3 providers',$('goallist').querySelectorAll('.prov').length===3);
ok('provider datalist filled',$('provlist').querySelectorAll('option').length===3);
// status cycle
const first=$('goallist').querySelector('.goal [data-cycle]');first.click();
ok('status cycles',P().goals.items.some(g=>g.status==='next'));
// filter
$('filterstatus').value='current';$('filterstatus').dispatchEvent(new w.Event('change'));
ok('filter works',$('goallist').querySelectorAll('.goal').length < 5);
$('filterstatus').value='all';$('filterstatus').dispatchEvent(new w.Event('change'));
// generalization
d.querySelector('.tab[data-k="gen"]').click();
ok('gen selector populated',$('gensel').querySelectorAll('option').length>=5);
const gid=P().goals.items[2].id;
$('gensel').value=gid;$('gensel').dispatchEvent(new w.Event('change'));
ok('gen form opens',$('genform').style.display==='block');
ok('3 default settings',$('setchips').querySelectorAll('.chip').length===3);
$('setchips').querySelectorAll('.chip')[0].click();
$('setchips').querySelectorAll('.chip')[2].click();
ok('2 settings ticked',P().goals.items[2].gen.settings.length===2);
$('gwhat').value='Hand over hand fading to verbal cue only.';
$('gwhen').value='Homework and any writing task';
$('gwho').value='Any adult';
$('savegen').click();
ok('gen details saved',P().goals.items[2].gen.what.includes('Hand over hand'));
ok('gen matrix renders',$('genlist').querySelector('table.gm')!==null);
ok('gen detail block renders',$('genlist').innerHTML.includes('Homework and any writing'));
// print
d.querySelector('.tab[data-k="print"]').click();
ok('print provider filter filled',$('printprov').querySelectorAll('option').length===4);
let doc=$('doc').innerHTML;
ok('doc has generalization',doc.includes('Generalization'));
ok('doc has provider section',doc.includes('Speech'));
ok('doc has instructions',doc.includes('For providers'));
$('printwhat').value='genonly';$('printwhat').dispatchEvent(new w.Event('change'));
ok('genonly hides provider tables',!$('doc').innerHTML.includes('<th>Status</th>'));
$('printwhat').value='all';$('printwhat').dispatchEvent(new w.Event('change'));
$('printprov').value='OT';$('printprov').dispatchEvent(new w.Event('change'));
ok('provider filter narrows doc',!$('doc').innerHTML.includes('descend stairs'));
$('printprov').value='';$('printprov').dispatchEvent(new w.Event('change'));
// settings
d.querySelector('.tab[data-k="setup"]').click();
$('newsetting').value='Grandma\u2019s house';$('addsetting').click();
ok('setting added',P().goals.settings.length===4);
$('settingchips').querySelectorAll('.chip')[3].click();
ok('setting removed',P().goals.settings.length===3);
// people isolation
$('newperson').value='Sibling';$('addperson').click();
ok('new person has no goals',P().goals.items.length===0);
ok('new person default settings',P().goals.settings.length===3);
const keys=Object.keys(DB().people);
ok('two people',keys.length===2);
ok('original person intact',DB().people[keys[0]].goals.items.length===5);
// shared schema present for symptom tracker
ok('shared tracker slot exists',!!P().tracker&&Array.isArray(P().tracker.entries));
// escaping
$('gprov').value='<img src=x onerror=alert(1)>';$('gtext').value='safe';$('addgoal').click();
ok('no img element injected',$('goallist').querySelectorAll('img').length===0);
ok('escaped as text',$('goallist').innerHTML.includes('&lt;img'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
