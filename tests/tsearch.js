const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
const nav=fs.readFileSync(dir+'/site-nav.js','utf8');
const idx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
let html=fs.readFileSync(dir+'/index.html','utf8')
  .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/index.html",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
  w.alert=()=>{};w.scrollTo=()=>{};}});
const w=dom.window,d=w.document;
[idx,nav].forEach(src=>{const s=d.createElement('script');s.textContent=src;d.body.appendChild(s);});

ok('index loaded',Array.isArray(w.ITS_SEARCH)&&w.ITS_SEARCH.length>200);
ok('synonyms loaded',w.ITS_SYNONYMS&&Object.keys(w.ITS_SYNONYMS).length>50);
ok('search button added',!!d.querySelector('.nv-searchbtn'));
w.ITS_OPEN_SEARCH();
const overlay=d.querySelector('.nv-sr');
ok('overlay opens',overlay.classList.contains('on'));
const input=overlay.querySelector('input');
const results=()=>[...overlay.querySelectorAll('.nv-srhit')];
function search(q){input.value=q;input.dispatchEvent(new w.Event('input'));return results();}
function pages(q){return search(q).map(a=>a.getAttribute('href').split('#')[0]);}

// the exact query she described
let p=pages('arms flap, not eating and aggression');
ok('her query returns results',p.length>0);
ok('  finds feeding',p.some(x=>x.includes('feeding')||x.includes('food')));
ok('  finds behavior',p.some(x=>x.includes('behavior')||x.includes('de-escalation')));
ok('  finds sensory or OT',p.some(x=>x.includes('occupational')||x.includes('conditions')||x.includes('behavior')));

// plain language that never appears literally on the site
ok('"wont sleep" finds sleep content',pages('wont sleep').some(x=>/myofunctional|conditions|whole-picture|adhd/.test(x)));
ok('"cant read" finds literacy',pages('cant read').some(x=>x.includes('learning-and-literacy')));
ok('"runs off" finds safety',pages('runs off').some(x=>x.includes('safety')));
ok('"turning 18" finds adult life',pages('turning 18').some(x=>x.includes('adult')));
ok('"burnt out" finds caregivers',pages('burnt out').some(x=>x.includes('caregivers')));
ok('"wont poo" finds constipation',pages('wont poo').some(x=>/injuries|conditions|feeding|symptom/.test(x)));
ok('"who pays" style query works',pages('insurance denied').length>0);
ok('"rdi" finds caregivers',pages('rdi').some(x=>x.includes('caregivers')));

// clinical terms still work
ok('clinical term works',pages('dyslexia').some(x=>x.includes('learning-and-literacy')));
ok('AAC works',pages('AAC').some(x=>x.includes('speech')));

// quality of results
const hits=search('aggression');
ok('results deep-link to sections',hits.some(a=>a.getAttribute('href').includes('#sec-')));
ok('results name the page',hits[0].querySelector('.pg').textContent.length>3);
ok('results show a snippet',hits[0].querySelector('.sn').textContent.length>20);
ok('snippet highlights the match',hits.some(a=>a.querySelector('.sn').innerHTML.includes('<mark>')));
ok('no more than 18 results',hits.length<=18);
const counts={};hits.forEach(a=>{const pg=a.getAttribute('href').split('#')[0];counts[pg]=(counts[pg]||0)+1;});
ok('at most two hits per page',Object.values(counts).every(v=>v<=2));

// edge cases
ok('short query shows nothing',search('a').length===0);
ok('nonsense query says so',(search('zzzqqqxxx'),overlay.querySelector('.nv-srnone')!==null));
ok('empty query clears',(search(''),results().length===0));
// every result points at a real page
const allPages=new Set(fs.readdirSync(dir).filter(f=>f.endsWith('.html')));
const bad=search('school').map(a=>a.getAttribute('href').split('#')[0]).filter(x=>!allPages.has(x));
ok('every result is a real page',bad.length===0);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
