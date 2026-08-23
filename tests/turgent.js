const {JSDOM}=require('jsdom'),fs=require('fs');
const dir='/mnt/user-data/outputs';
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), sidx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
let html=fs.readFileSync(dir+'/index.html','utf8')
  .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/index.html",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
  w.alert=()=>{};w.scrollTo=()=>{};}});
const w=dom.window,d=w.document;
[sidx,nav].forEach(s=>{const e=d.createElement('script');e.textContent=s;d.body.appendChild(e);});
const u=d.querySelector('.urgent');
ok('urgent block present',!!u);
const ps=u.querySelectorAll('p');
ok('two separate paragraphs',ps.length===2);
ok('first is what to do this minute',ps[0].textContent.includes('stop reading and call someone'));
ok('first names the three places to call',['emergency services','nurse line','urgent care'].every(x=>ps[0].textContent.includes(x)));
ok('first has no links to follow',ps[0].querySelectorAll('a').length===0);
ok('second is where to go next',ps[1].textContent.includes('For where to go and what to do first'));
ok('second links to When something happens',!!ps[1].querySelector('a[href="injuries-and-illness.html"]'));
ok('second links to Safety',!!ps[1].querySelector('a[href="safety.html"]'));
ok('missing-child line kept with the links',ps[1].textContent.includes('search water first'));
ok('heading still above both',u.querySelector('b').textContent.includes('If something is happening right now'));
const s1=w.getComputedStyle(ps[0]);
ok('paragraphs are visually separated',parseFloat(s1.marginBottom)>=10);
const sb=w.getComputedStyle(u.querySelector('b'));
ok('heading sits on its own line',sb.display==='block');
ok('urgent block appears before everything else',
   [...d.querySelectorAll('.urgent, .namebox')][0].className.includes('urgent'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
