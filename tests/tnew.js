const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg){let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
 const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
 return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,virtualConsole:vc,
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
  w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};}}).window;}
const D=()=>JSON.parse(store['its_family_v1']);
const P=()=>D().people[D().current];

// ---------- choice planner ----------
let w=open_('choice-planner.html'),d=w.document,$=id=>d.getElementById(id);
ok('4 tabs',d.querySelectorAll('.tab').length===4);
ok('three mechanisms explained',d.querySelectorAll('#p-about .kind').length===3);
ok('capacity warning present',d.querySelector('.capcheck').textContent.includes('they are not choosing'));
d.querySelector('.tab[data-k="build"]').click();
$('sname').value='Using the robot vacuum roughly';
$('ssay').value="Sending it down the stairs isn't using it the right way. You can choose to use it properly and keep going, or choose to be all done with it today.";
$('srepair').value='We can try again tomorrow morning.';
$('swho').value='Whoever is with him';
$('addscript').click();
ok('script saved',P().scripts.length===1);
ok('defaults to logical',P().scripts[0].kind==='log');
ok('script renders',$('scriptlist').innerHTML.includes('down the stairs'));
ok('repair shown',$('scriptlist').innerHTML.includes('try again tomorrow'));
// a script the person cannot yet do gets flagged
$('sname').value='Clearing the whole table alone';
$('ssay').value='You can choose to clear it or choose to skip the iPad.';
$('skind').value='ft';$('scap').value='no';
$('addscript').click();
ok('first-then saved',P().scripts[1].kind==='ft');
ok('capacity flag raised',$('scriptlist').innerHTML.includes('a consequence is not the right response'));
d.querySelector('.tab[data-k="print"]').click();
ok('print shows the exact words',$('doc').innerHTML.includes('down the stairs'));
ok('print reminds to say it once',$('doc').innerHTML.includes('Repeating turns it into an argument'));

// ---------- household board ----------
w=open_('household-board.html');d=w.document;$=id=>d.getElementById(id);
ok('board loads',!!$('board'));
d.querySelector('.tab[data-k="tasks"]').click();
$('tname').value='Put your plate in the dishwasher';$('tkind').value='contrib';$('addtask').click();
$('tname').value='Wash the car';$('tkind').value='job';$('tpay').value='5';$('addtask').click();
ok('two tasks saved',P().home.tasks.length===2);
ok('contribution is unpaid',P().home.tasks[0].pay===0);
ok('job carries pay',P().home.tasks[1].pay===5);
d.querySelector('.tab[data-k="board"]').click();
ok('board shows a column',d.querySelectorAll('#board .pcol').length>=1);
ok('lists kept apart',$('board').innerHTML.includes('Because we live here')&&$('board').innerHTML.includes('Jobs, if you want them'));
ok('pay shown on the job',$('board').innerHTML.includes('>5<'));
const box=d.querySelector('#board [data-t]');
box.click();
ok('tick saved',Object.keys(P().home.ticks).length===1);
ok('shows as done',d.querySelector('#board .task.done')!==null);
box.click();
// no scoring language anywhere
const bodyText=d.body.textContent;
ok('no scoring mechanics offered',!d.querySelector('#board').innerHTML.match(/point|star|streak|level/i));
ok('no earned-reward language',!/you earned!/i.test(bodyText));
ok('says nothing is taken away',bodyText.includes('nothing is ever taken away'));
// goal
d.querySelector('.tab[data-k="goal"]').click();
$('gwhat').value='The Lego set with the crane';$('gcost').value='60';$('gsaved').value='10';$('savegoal').click();
ok('goal saved',P().home.goal.what.includes('Lego'));
ok('goal renders with progress',$('goalview').innerHTML.includes('10 of 60'));
$('eamt').value='5';$('ewhat').value='Washing the car';$('addearn').click();
ok('earning added',P().home.earned.length===1);
ok('goal total updated',P().home.goal.saved===15);
ok('earnings listed',$('earnlist').innerHTML.includes('Washing the car'));
d.querySelector('.tab[data-k="print"]').click();
ok('print separates the lists',$('doc').innerHTML.includes('Because we live here')&&$('doc').innerHTML.includes('Jobs, if you want them'));

// ---------- calendar photos ----------
w=open_('family-calendar.html');d=w.document;$=id=>d.getElementById(id);
ok('photo field on repeats',!!$('rphoto'));
ok('photo field on appointments',!!$('aphoto'));
ok('shrink helper present',typeof w.eval('typeof shrink')==='string'&&w.eval('typeof shrink')==='function');
// simulate a stored photo directly (canvas is unavailable in jsdom)
w.eval(`
 C().repeats.push({id:'ph1',name:'Speech therapy',time:'15:00',days:[0,1,2,3,4,5,6],
  kind:'therapy',note:'',who:'',photo:'data:image/jpeg;base64,AAAA',share:true});
 save();drawWall();`);
ok('photo renders in the day view',$('wall').innerHTML.includes('class="thumb"'));
$('span').value='week';$('span').dispatchEvent(new w.Event('change'));
ok('photo renders in the week view',$('wall').innerHTML.includes('class="thumb"'));
$('mode').value='kid';$('mode').dispatchEvent(new w.Event('change'));
$('span').value='day';$('span').dispatchEvent(new w.Event('change'));
ok('photo shows in the simple view too',$('wall').innerHTML.includes('class="thumb"'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
