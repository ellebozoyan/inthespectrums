const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=require('path').join(__dirname,'..');
const nav=fs.readFileSync(dir+'/site-nav.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
function run(page){
  let html=fs.readFileSync(path.join(dir,page),'utf8').replace('<script src="site-nav.js"></script>','');
  const store={};
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+page,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};
    w.matchMedia=w.matchMedia||(()=>({matches:false,addListener(){},removeListener(){}}));}});
  const s=dom.window.document.createElement('script');s.textContent=nav;
  dom.window.document.body.appendChild(s);
  if(typeof dom.window.ITS_PAINT_MARKS==='function')dom.window.ITS_PAINT_MARKS(dom.window.document);
  return dom.window.document;
}
// index
let d=run('index.html');
ok('index: header renders',!!d.querySelector('.nv-bar'));
ok('index: drawer built',d.querySelectorAll('.nv-grp').length>=9);
ok('index: footer built',!!d.querySelector('.nv-foot'));
ok('index: terms link in footer',d.querySelector('.nv-foot').innerHTML.includes('terms-and-privacy'));
ok('index: correctly has NO short version',!d.querySelector('.nv-short'));
const marks=d.querySelectorAll('a.pg .mark, a.pg svg, a.sit .mark, a.sit svg');
ok('index: icons injected on cards',marks.length>=6);  // home is deliberately short now
const pgNoMark=[...d.querySelectorAll('a.pg')].filter(a=>!a.querySelector('svg,img,.mark'));
ok('index: every page card has a mark ('+pgNoMark.length+' missing)',pgNoMark.length===0);
const sitNoMark=[...d.querySelectorAll('a.sit')].filter(a=>!a.querySelector('svg,img,.mark'));
ok('index: every router card has a mark ('+sitNoMark.length+' missing)',sitNoMark.length===0);
ok('index: no breadcrumb on home',!d.querySelector('.nv-crumb'));
// a new page
d=run('share-builder.html');
ok('share-builder: breadcrumb',!!d.querySelector('.nv-crumb'));
ok('share-builder: breadcrumb names group',d.querySelector('.nv-crumb').textContent.includes('Money'));
ok('share-builder: short version',!!d.querySelector('.nv-short'));
ok('share-builder: drawer link present',d.querySelector('.nv-drawer').innerHTML.includes('share-builder.html'));
d=run('terms-and-privacy.html');
ok('terms: breadcrumb group is About',d.querySelector('.nv-crumb').textContent.includes('About'));
ok('terms: short version',!!d.querySelector('.nv-short'));
d=run('de-escalation.html');
ok('de-escalation: breadcrumb group is Behavior',d.querySelector('.nv-crumb').textContent.includes('Behavior'));
ok('de-escalation: outline button',!!d.querySelector('.nv-outline'));
ok('de-escalation: contents box',!!d.querySelector('.nv-toc'));
d=run('goals-tracker.html');
ok('goals-tracker: nav loads',!!d.querySelector('.nv-bar'));
ok('goals-tracker: short version',!!d.querySelector('.nv-short'));

// every page must offer a real way back to the home page - and as links, so
// they can be opened in a new tab and are announced as links
{
  const pages=['safety.html','food-list.html','conditions-library.html','about.html','siblings-and-family.html'];
  let bad=[];
  pages.forEach(pg=>{
    let h=fs.readFileSync(path.join(dir,pg),'utf8')
      .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
    const dm=new JSDOM(h,{runScripts:'dangerously',url:'https://x.test/'+pg,
      beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
      w.alert=()=>{};w.scrollTo=()=>{};}});
    const dd=dm.window.document;
    const e=dd.createElement('script');e.textContent=nav;dd.body.appendChild(e);
    const burger=dd.querySelector('.nv-burger'); if(burger) burger.click();
    if(dd.querySelectorAll('a[href="index.html"]').length < 2) bad.push(pg);
  });
  ok('every page links home more than once', bad.length===0);
  if(bad.length) console.log('     thin on:',bad.join(', '));
  ok('drawer home is a link, not a button',
     !/nv-gbtn[^>]*onclick="location\.href/.test(nav));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
