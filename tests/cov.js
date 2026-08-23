const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs', nav=fs.readFileSync(dir+'/site-nav.js','utf8');
const pages=fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='index.html');
let tot=0,cov=0,bad=[];
pages.forEach(pg=>{
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();}});
  const d=dom.window.document;
  const s=d.createElement('script');s.textContent=nav;d.body.appendChild(s);
  const b=d.querySelector('.nv-outline'); if(!b) return;
  b.click();
  [...d.querySelectorAll('h2.sec')].forEach(h=>{
    const sec=h.closest('section'); tot++;
    if(sec.querySelector('.secnote')||sec.querySelector('.nv-gist')) cov++;
    else bad.push(pg.replace('.html','')+' — '+h.textContent.trim().slice(0,38));
  });
});
console.log(`sections across the site: ${tot}`);
console.log(`described in skim view:   ${cov} (${Math.round(cov/tot*100)}%)`);
console.log('undescribed:', bad.length?bad:'none');
