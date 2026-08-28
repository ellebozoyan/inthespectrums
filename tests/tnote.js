const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(){
  let html=fs.readFileSync(path.join(dir,'heads-up-note.html'),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/heads-up-note.html",virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=m=>{w.__alert=m;};w.scrollTo=()=>{};
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:t=>{w.__copied=t;return Promise.resolve();}},configurable:true});
    w.document.execCommand=()=>true;}}).window;
}
let w=open_(),d=w.document;
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];

ok('situations offered',d.querySelectorAll('#situ button').length===7);
ok('detail chips offered',d.querySelectorAll('#bits .chip').length===12);
ok('starts empty',d.getElementById('out').className.includes('empty'));

// build a playdate note
[...d.querySelectorAll('#situ button')].find(b=>b.textContent.includes('playdate at our house')).click();
ok('choosing a situation writes something',!d.getElementById('out').className.includes('empty'));
const base=d.getElementById('out').textContent;
ok('  with an opening line',base.includes('Looking forward'));
ok('  and a warm close',base.includes("glad they're coming"));

d.getElementById('who').value='Sam';
d.getElementById('who').dispatchEvent(new w.Event('input'));
ok('the name appears',d.getElementById('out').textContent.includes('Sam'));

// the sibling case Elle described
[...d.querySelectorAll('#bits .chip')].find(b=>b.textContent==='About a sibling').click();
const sib=d.getElementById('out').textContent;
ok('sibling line included',sib.includes('sibling, who has additional needs'));
ok('  phrased as what to do',sib.includes('Say hello the same as anyone'));

[...d.querySelectorAll('#bits .chip')].find(b=>b.textContent==='Loud rooms are hard').click();
ok('a second detail adds on',d.getElementById('out').textContent.includes('Loud or busy rooms'));

d.getElementById('extra').value='He will show you his train book.';
d.getElementById('extra').dispatchEvent(new w.Event('input'));
ok('own words included verbatim',d.getElementById('out').textContent.includes('train book'));

// length
const charc=d.getElementById('charc').textContent;
ok('character count shown',/\d+ characters/.test(charc));
ok('  and says it fits',charc.includes('fits comfortably'));
d.getElementById('tone').value='short';
d.getElementById('tone').dispatchEvent(new w.Event('change'));
ok('short drops the closing line',!d.getElementById('out').textContent.includes("glad they're coming"));
ok('  but keeps the details',d.getElementById('out').textContent.includes('train book'));

// copy
d.getElementById('copy').click();
ok('copies to clipboard',(w.__copied||'').includes('Sam'));

// save and reuse
d.getElementById('savenote').click();
ok('note saved',P().notes.length===1);
ok('  labelled by situation',P().notes[0].label.includes('playdate'));
const w2=open_();
ok('saved note survives reload',w2.document.querySelectorAll('#savedlist .gen').length===1);

// reset
d.getElementById('reset').click();
ok('reset clears the situation',d.getElementById('out').className.includes('empty'));
ok('  and the fields',d.getElementById('who').value===''&&d.getElementById('extra').value==='');

// guards
d.getElementById('copy').click();
ok('copying nothing is refused',(w.__alert||'').includes('Pick a situation'));
// every situation produces a note
let broken=[];
[...d.querySelectorAll('#situ button')].forEach(b=>{
  b.click(); if(d.getElementById('out').textContent.length<60) broken.push(b.textContent.slice(0,20));});
ok('every situation produces a note',broken.length===0);
ok('storage warning present',d.body.textContent.includes('device that you are currently using'));
ok('points at the share builder for longer needs',d.body.textContent.includes('share builder'));
ok('raises whose information it is',d.body.textContent.includes('Whose information is it'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
