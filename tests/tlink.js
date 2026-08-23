const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg,search){
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg+(search||''),virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=m=>{w.__a=m;};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};
    w.HTMLMediaElement.prototype.play=function(){return Promise.resolve();};
    w.HTMLMediaElement.prototype.pause=function(){};w.HTMLMediaElement.prototype.load=function(){};}}).window;
}
const D=()=>JSON.parse(store['its_family_v1']);
const P=()=>D().people[D().current];

// 1. create an exercise in the mirror
let w=open_('practice-mirror.html'),d=w.document,$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="exercises"]').click();
$('xname').value='Sit to stand without hands';$('xwho').value='PT';
$('xcues').value='Feet flat and back. Nose over toes.';$('addex').click();
ok('exercise created',P().practice.ex.length===1);
const exId=P().practice.ex[0].id;

// 2. schedule it on the household board
w=open_('household-board.html');d=w.document;$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="tasks"]').click();
ok('practice option offered',[...d.querySelectorAll('#tkind option')].some(o=>o.value==='prac'));
ok('exercise picker hidden by default',$('exwrap').style.display==='none');
$('tkind').value='prac';$('tkind').dispatchEvent(new w.Event('change'));
ok('picker appears',$('exwrap').style.display==='block');
ok('exercise listed in the picker',$('texercise').innerHTML.includes('Sit to stand'));
$('tname').value='PT practice';
$('addtask').click();
ok('practice task saved',P().home.tasks.length===1);
ok('task points at the exercise',P().home.tasks[0].exId===exId);
ok('practice is unpaid',P().home.tasks[0].pay===0);
const taskId=P().home.tasks[0].id;

// 3. it renders with a link
d.querySelector('.tab[data-k="board"]').click();
ok('practice section shown',$('board').innerHTML.includes('Practice'));
const link=d.querySelector('#board a.go');
ok('practise link rendered',!!link);
ok('link carries the exercise',link.getAttribute('href').includes('ex='+exId));
ok('link carries the task',link.getAttribute('href').includes('task='+taskId));
ok('link points at the mirror',link.getAttribute('href').startsWith('practice-mirror.html?'));

// 4. following it preselects and confirms
const search='?'+link.getAttribute('href').split('?')[1];
w=open_('practice-mirror.html',search);d=w.document;$=id=>d.getElementById(id);
ok('exercise preselected',$('exsel').value===exId);
ok('cues already showing',$('cues').innerHTML.includes('Nose over toes'));
ok('title set to the exercise',$('cuestitle').textContent.includes('Sit to stand'));
ok('arrival message shown',$('p-practice').innerHTML.includes('already selected'));

// 5. logging ticks the board item
d.querySelectorAll('#reps button')[2].click();
$('addlog').click();
ok('practice logged',P().practice.log.length===1);
const t=P().home.ticks;
const dsKeys=Object.keys(t);
ok('board item ticked for today',dsKeys.length===1&&t[dsKeys[0]][taskId]===1);
ok('button confirms the tick',$('addlog').textContent.includes('ticked off'));

// 6. the board now shows it done
w=open_('household-board.html');d=w.document;$=id=>d.getElementById(id);
ok('board shows it complete',d.querySelector('#board .task.done')!==null);
ok('checkbox shows on',d.querySelector('#board .tbox.on')!==null);

// 7. arriving with a bad id degrades safely
w=open_('practice-mirror.html','?ex=nonsense&task=nope');d=w.document;$=id=>d.getElementById(id);
ok('unknown exercise ignored',!$('p-practice').innerHTML.includes('already selected'));
ok('page still works',d.querySelectorAll('.tab').length===4);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
