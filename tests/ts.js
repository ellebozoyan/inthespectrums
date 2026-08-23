const {JSDOM}=require('jsdom'),fs=require('fs');
const seed={current:'Kid',people:{Kid:{name:'Kid',dob:'9 years old',dx:'Autism, ADHD',emerg:'Allergic to amoxicillin.',
 tracker:{entries:[
  {id:'1',date:'2026-08-15',cat:'Sleep',sym:'Woke in the night',sev:3,note:'up at 2am',where:''},
  {id:'2',date:'2026-08-15',cat:'Behavior',sym:'Long meltdown',sev:4,note:'after the bus',where:'Home'},
  {id:'3',date:'2026-08-14',cat:'Sleep',sym:'Woke in the night',sev:2,note:'',where:''},
  {id:'4',date:'2026-08-14',cat:'Good things',sym:'Good day overall',sev:0,note:'',where:''}],
  days:{'2026-08-15':{cap:5,pre:['Went quiet','Pacing'],help:['Quiet space'],sleep:6,sleepq:'Restless',meds:'All given',ctx:['Dose changed'],note:'Hard day.',incident:'Physical hold, 3 min, gym.'},
        '2026-08-14':{cap:2,pre:['Went quiet'],help:['Music','Quiet space'],sleep:9,meds:'All given'}},
  custom:{},pre:[],help:[]},
 goals:{settings:['Home / family','Home / providers','School'],instructions:'Please review.',items:[
  {id:'g1',prov:'Speech',code:'SLP 1.1',text:'Will ask wh-questions.',status:'current',area:'',gen:{settings:['Home / family','School'],what:'Model once and wait.',when:'Snack',where:'Table',who:'Any adult',how:'Fade by week two',why:'No reliable way to ask yet.',notes:'Do not praise after.'}},
  {id:'g2',prov:'OT',code:'OT 1.4',text:'Will write name on a line.',status:'current',area:'',gen:null},
  {id:'g3',prov:'OT',code:'OT 1.9',text:'Old mastered goal.',status:'mastered',area:'',gen:null}]}}}};
const store={'its_family_v1':JSON.stringify(seed)};
let html=fs.readFileSync('/mnt/user-data/outputs/share-builder.html','utf8').replace('<script src="site-nav.js"></script>','');
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
  w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};}});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const doc=()=>$('doc').innerHTML;

ok('6 presets',$('presets').querySelectorAll('button').length===6);
ok('16 sections',$('sections').querySelectorAll('label').length===16);
ok('goal providers listed',$('goalprov').querySelectorAll('option').length===3);

// default preset = new teacher: no medical
ok('teacher preset active',$('presets').querySelector('button.on').textContent.includes('New teacher'));
ok('teacher: has what helps',doc().includes('What helps'));
ok('teacher: has early signs',doc().includes('Early warning signs'));
ok('teacher: has goals',doc().includes('Speech'));
ok('teacher: NO symptom table',!doc().includes('Most frequent'));
ok('teacher: NO emergency info',!doc().includes('Allergic to amoxicillin'));
ok('teacher: NO sleep',!doc().includes('Sleep and medication'));
ok('teacher: NO parent notes',!doc().includes('Hard day'));

// doctor preset: medical yes, goals no
const btns=[...$('presets').querySelectorAll('button')];
btns.find(b=>b.textContent.includes('doctor')).click();
ok('doctor: symptom table',doc().includes('Most frequent'));
ok('doctor: emergency info',doc().includes('Allergic to amoxicillin'));
ok('doctor: sleep section',doc().includes('Sleep and medication'));
ok('doctor: what changed',doc().includes('Dose changed'));
ok('doctor: capacity',doc().includes('Capacity'));
ok('doctor: parent notes',doc().includes('Hard day'));
ok('doctor: NO goals table',!doc().includes('<th>Status</th>'));

// babysitter: minimal
btns.find(b=>b.textContent.includes('babysitter')).click();
ok('sitter: what helps',doc().includes('What helps'));
ok('sitter: emergency',doc().includes('Allergic'));
ok('sitter: NO symptoms',!doc().includes('Most frequent'));
ok('sitter: NO goals',!doc().includes('Speech'));
ok('sitter: NO diagnoses',!doc().includes('Autism, ADHD'));

// IEP: incidents included
btns.find(b=>b.textContent.includes('IEP')).click();
ok('iep: incident record',doc().includes('Physical hold'));
ok('iep: generalization matrix',doc().includes('Goals to practice across settings'));
ok('iep: gen detail',doc().includes('Model once and wait'));

// manual toggle unsets preset
const lbls=[...$('sections').querySelectorAll('label')];
const symLbl=lbls.find(l=>l.textContent.includes('Symptom summary'));
symLbl.querySelector('input').click();
ok('manual toggle clears preset',$('presets').querySelector('button.on')===null);
ok('symptom section now included',doc().includes('Most frequent'));

// everything preset
btns.find(b=>b.textContent.includes('Everything')).click();
ok('all: has both goals and symptoms',doc().includes('Most frequent')&&doc().includes('<th>Status</th>'));
ok('mastered goals excluded from current',!doc().includes('Old mastered goal'));

// provider filter
$('goalprov').value='OT';$('goalprov').dispatchEvent(new w.Event('change'));
ok('provider filter works',!doc().includes('Will ask wh-questions'));
$('goalprov').value='';$('goalprov').dispatchEvent(new w.Event('change'));

// cover note + addressed to
$('forwhom').value='Miss Wyllie';$('forwhom').dispatchEvent(new w.Event('input'));
$('covernote').value='Please read the early signs.';$('covernote').dispatchEvent(new w.Event('input'));
ok('addressed to appears',doc().includes('Miss Wyllie'));
ok('cover note appears',doc().includes('Please read the early signs'));

// date range
$('range').value='14';$('range').dispatchEvent(new w.Event('change'));
ok('range label updates',doc().includes('last 14 days'));

// setup shares person
d.querySelector('.tab[data-k="setup"]').click();
ok('setup shows shared name',$('childname').value==='Kid');
ok('setup shows emergency',$('emerg').value.includes('amoxicillin'));

// escaping
const p=JSON.parse(store['its_family_v1']);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
