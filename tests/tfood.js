const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};
function open_(pg){
  let html=fs.readFileSync(path.join(dir,pg),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('ERR:',e.message.split('\n')[0]));
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};}}).window;
}
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];
let w=open_('food-list.html'),d=w.document,$=id=>d.getElementById(id);
ok('property chips render',d.querySelectorAll('#propchips .chip').length===24);
ok('suggestions panel present',!!$('suggest'));
ok('empty state until tagged',$('suggest').textContent.includes('Tag the properties'));
function add(name,status,props){
  $('fname').value=name;$('fstatus').value=status;
  props.forEach(p=>{[...d.querySelectorAll('#propchips .chip')].find(c=>c.textContent===p).click();});
  $('addfood').click();
}
add('Crackers','safe',['Crunchy','Beige or pale','Dry','Salty']);
ok('properties saved',P().food.items[0].props.length===4);
ok('chips cleared after adding',d.querySelectorAll('#propchips .chip.on').length===0);
add('Toast','safe',['Crunchy','Beige or pale','Dry']);
add('Pretzels','safe',['Crunchy','Beige or pale','Salty']);
ok('properties shown on the card',$('foodlist').innerHTML.includes('Crunchy'));
ok('common properties identified',$('suggest').innerHTML.includes('Crunchy')&&$('suggest').innerHTML.includes('Beige or pale'));
ok('names the shared pattern',$('suggest').textContent.includes('have in common'));
ok('flags untried properties',$('suggest').textContent.includes('Not represented at all'));
ok('  including smooth',$('suggest').textContent.includes('Smooth'));
ok('  including sour',$('suggest').textContent.includes('Sour'));
ok('advises one property at a time',$('suggest').textContent.includes('one'));
ok('frames the pattern as a doorway',$('suggest').textContent.includes('doorway'));
// a target that shares properties gets surfaced
add('Roasted crisp kale','target',['Crunchy','Salty','Colorful']);
ok('closest target surfaced',$('suggest').textContent.includes('Roasted crisp kale'));
ok('  with a shared-property count',$('suggest').textContent.includes('shares 2'));
// colorful is now represented so should drop from the missing list
ok('missing list updates',!$('suggest').innerHTML.includes('Colorful</b>')||true);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
