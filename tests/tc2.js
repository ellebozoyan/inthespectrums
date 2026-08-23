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
let w=open_('medication-list.html'),d=w.document,$=id=>d.getElementById(id);
$('mname').value='Melatonin';d.querySelectorAll('#whenchips .chip')[6].click();$('addmed').click();

w=open_('family-calendar.html');d=w.document;$=id=>d.getElementById(id);
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];
ok('span selector exists',!!$('span'));
ok('defaults to one day',$('span').value==='day');
d.querySelector('.tab[data-k="build"]').click();
$('rname').value='Speech therapy';$('rtime').value='15:00';$('addrep').click();
$('rname').value='Breakfast';$('rtime').value='07:30';$('rkind').value='meal';$('rshare').checked=true;$('addrep').click();
$('aname').value='Neurology';$('atime').value='11:00';$('addappt').click();
d.querySelector('.tab[data-k="today"]').click();

// ---- tick boxes ----
ok('tick boxes render in day view',d.querySelectorAll('#wall [data-tick]').length>=3);
ok('hint shown',$('wall').innerHTML.includes('Ticks clear on their own'));
const first=d.querySelector('#wall [data-tick]');
const key=first.dataset.tick;
first.click();
ok('tick saved',Object.keys(P().cal.ticks).length===1);
const ds=Object.keys(P().cal.ticks)[0];
ok('tick keyed to the item',!!P().cal.ticks[ds][key]);
ok('row shows as ticked',d.querySelector('#wall .wrow.ticked')!==null);
ok('box shows as on',d.querySelector('#wall .tickbox.on')!==null);
d.querySelector('#wall [data-tick]').click();
ok('untick removes it',Object.keys(P().cal.ticks).length===0);
// ticks are per item, not per row position
d.querySelectorAll('#wall [data-tick]')[1].click();
const k2=Object.values(P().cal.ticks)[0];
ok('only one item ticked',Object.keys(k2).length===1);

// ---- week view ----
$('span').value='week';$('span').dispatchEvent(new w.Event('change'));
ok('week grid renders',d.querySelectorAll('#wall .wcol').length===7);
ok('week shows the repeating item',$('wall').innerHTML.includes('Speech therapy'));
ok('week shows medication',$('wall').innerHTML.includes('Melatonin'));
ok('week highlights today',d.querySelector('#wall .wcol.istoday')!==null);
ok('week header says week of',$('wall').innerHTML.includes('Week of'));
ok('ticked item struck through in week',$('wall').innerHTML.includes('line-through'));
// kid mode filters the week too
$('mode').value='kid';$('mode').dispatchEvent(new w.Event('change'));
ok('week kid mode keeps shared meal',$('wall').innerHTML.includes('Breakfast'));
ok('week kid mode hides unshared therapy',!$('wall').innerHTML.includes('Speech therapy'));
ok('week kid mode uses large layout',$('wall').className.includes('kid'));
// back to day
$('span').value='day';$('span').dispatchEvent(new w.Event('change'));
ok('returns to day view',d.querySelectorAll('#wall .wrow').length>0);
$('mode').value='full';$('mode').dispatchEvent(new w.Event('change'));
ok('day view still ticks',d.querySelectorAll('#wall [data-tick]').length>=3);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
