const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
let html=fs.readFileSync(path.join(dir,'practice-mirror.html'),'utf8').replace('<script src="site-nav.js"></script>','');
const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/practice-mirror.html",virtualConsole:vc,
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
  w.alert=m=>{w.__lastAlert=m;};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};
  w.HTMLMediaElement.prototype.play=function(){return Promise.resolve();};
  w.HTMLMediaElement.prototype.pause=function(){};
  w.HTMLMediaElement.prototype.load=function(){};}});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];

ok('4 tabs',d.querySelectorAll('.tab').length===4);
ok('stage present',!!$('stage'));
ok('live and ghost video layers',!!$('live')&&!!$('ghost'));
ok('opacity control',!!$('opacity'));
ok('honesty warning up front',d.querySelector('.warn').textContent.includes('does not measure anything'));
ok('states nothing is uploaded',d.querySelector('.warn').textContent.includes('Nothing is uploaded, ever'));

// exercises
d.querySelector('.tab[data-k="exercises"]').click();
$('xname').value='Sit to stand without hands';
$('xwho').value='PT';
$('xtarget').value='10 a day';
$('xcues').value='Feet flat and back. Nose over toes. Push through the heels.';
$('addex').click();
ok('exercise saved',P().practice.ex.length===1);
ok('cues saved',P().practice.ex[0].cues.includes('Nose over toes'));
ok('no clip flagged honestly',P().practice.ex[0].hasClip===false);
ok('exercise renders',$('exlist').innerHTML.includes('Sit to stand'));
ok('shows cues-only state',$('exlist').innerHTML.includes('cues only'));
ok('therapist datalist filled',$('wholist').innerHTML.includes('PT'));
$('xname').value='Tongue to spot';$('xwho').value='Myo';$('addex').click();
ok('second exercise',P().practice.ex.length===2);

// selecting one
d.querySelector('.tab[data-k="practice"]').click();
ok('selector has both',$('exsel').querySelectorAll('option').length===3);
$('exsel').value=P().practice.ex[0].id;
$('exsel').dispatchEvent(new w.Event('change'));
ok('cues shown for the chosen one',$('cues').innerHTML.includes('Nose over toes'));
ok('title updates',$('cuestitle').textContent.includes('Sit to stand'));

// controls behave without a camera
$('recbtn').click();
ok('recording refuses without a camera',(w.__lastAlert||'').includes('Turn the camera on'));
$('ghostplay').click();
ok('target play refuses without a clip',(w.__lastAlert||'').includes('Exercises tab'));
$('mirrorbtn').click();
ok('mirror flips the live view',$('live').style.transform==='scaleX(-1)');
$('mirrorbtn').click();
ok('mirror toggles back',$('live').style.transform==='none');
$('opacity').value='70';$('opacity').dispatchEvent(new w.Event('input'));
ok('opacity applies to the ghost',Math.abs(parseFloat($('ghost').style.opacity)-0.7)<0.01);

// log
ok('rep buttons',d.querySelectorAll('#reps button').length===8);
d.querySelectorAll('#reps button')[3].click();
$('loghow').value='Better on the left.';
$('addlog').click();
ok('log entry saved',P().practice.log.length===1);
ok('reps recorded',P().practice.log[0].reps===5);
ok('note recorded',P().practice.log[0].how.includes('Better on the left'));
ok('log tied to the exercise',P().practice.log[0].ex.includes('Sit to stand'));
d.querySelector('.tab[data-k="log"]').click();
ok('log renders',$('loglist').innerHTML.includes('Sit to stand'));
ok('print groups by exercise',$('doc').innerHTML.includes('sessions logged')||$('doc').innerHTML.includes('session logged'));
ok('print states no measurement',$('doc').innerHTML.includes('No measurement was taken'));

// compare
d.querySelector('.tab[data-k="compare"]').click();
ok('two compare videos',!!$('cmpA')&&!!$('cmpB'));
ok('empty states shown',$('emptyA').style.display==='flex'&&$('emptyB').style.display==='flex');
$('saveattempt').click();
ok('saving refuses with no attempt',(w.__lastAlert||'').includes('Record an attempt first'));
$('mirrorA').click();
ok('target mirrors',$('cmpA').style.transform==='scaleX(-1)');
$('cmpspeed').value='25';$('cmpspeed').dispatchEvent(new w.Event('input'));
ok('speed control present',$('cmpspeed').value==='25');

// removing an exercise
d.querySelector('.tab[data-k="exercises"]').click();
d.querySelector('#exlist [data-rm]').click();
ok('exercise removed',P().practice.ex.length===1);
ok('log kept after removal',P().practice.log.length===1);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
