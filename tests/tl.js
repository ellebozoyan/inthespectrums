const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs', nav=fs.readFileSync(dir+'/site-nav.js','utf8');
// pull the page keys out of the LIFTS block
const blk=nav.slice(nav.indexOf('16. LIFTS'));
const want={};
const re=/^  '([a-z0-9-]+\.html)': \[/gm; let m;
while((m=re.exec(blk))) want[m[1]]=(blk.slice(m.index).split(/\n  \]/)[0].match(/\n    \['/g)||[]).length;
let tot=0, placed=0, bad=[];
Object.keys(want).forEach(pg=>{
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();}});
  const d=dom.window.document;
  const s=d.createElement('script');s.textContent=nav;d.body.appendChild(s);
  const got=d.querySelectorAll('.lift').length;
  const exp=want[pg];
  tot+=exp; placed+=got;
  if(got<exp) bad.push(`${pg}: expected ${exp}, placed ${got}`);
});
console.log('pages with lifts:', Object.keys(want).length);
console.log(`callouts expected: ${tot} · placed: ${placed}`);
console.log(bad.length? 'MISPLACED:\n  '+bad.join('\n  ') : 'every callout found its anchor');
