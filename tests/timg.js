const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..');
const nav=fs.readFileSync(dir+'/site-nav.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const warned=[];
const html=`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div class="wrap">
<figure class="fig"><img src="img/a.webp" width="1200" height="800" alt="First image">
<figcaption>A caption</figcaption></figure>
<figure class="fig side"><img src="img/b.webp" width="600" height="600" alt="Second"></figure>
<div class="figrow">
  <figure class="fig"><img src="img/c.webp" width="400" height="300" alt="Third"></figure>
  <figure class="fig"><img src="img/d.webp" width="400" height="300"></figure>
</div>
</div></body></html>`;
const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/safety.html",
  beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
  w.alert=()=>{};w.scrollTo=()=>{};w.console.warn=(...a)=>warned.push(a.join(" "));}});
const d=dom.window.document;
const s=d.createElement('script');s.textContent=nav;d.body.appendChild(s);

const imgs=[...d.querySelectorAll('.fig img, .figrow img')];
ok('all images found',imgs.length===4);
ok('first image loads eagerly',imgs[0].getAttribute('loading')==='eager');
ok('later images load lazily',imgs.slice(1).every(i=>i.getAttribute('loading')==='lazy'));
ok('decoding set to async',imgs.every(i=>i.getAttribute('decoding')==='async'));
ok('aspect ratio reserved',imgs[0].style.aspectRatio==='1200 / 800');
ok('  matches each image',imgs[1].style.aspectRatio==='600 / 600');
ok('missing alt gets an empty alt rather than none',imgs[3].getAttribute('alt')==='');
ok('and warns in the console',warned.some(w=>w.includes('missing alt text')));
ok('  naming the file',warned.some(w=>w.includes('img/d.webp')));
ok('images with alt are untouched',imgs[0].getAttribute('alt')==='First image');
const cs=dom.window.getComputedStyle(d.querySelector('.fig img'));
ok('images are block level',cs.display==='block');
ok('images fill their column',cs.width==='100%');
ok('caption styled',!!dom.window.getComputedStyle(d.querySelector('.fig figcaption')).borderLeftWidth);
// the folder guide exists
ok('img folder has a guide',fs.existsSync(path.join(dir,'img','README.md')));
const readme=fs.readFileSync(path.join(dir,'img','README.md'),'utf8');
ok('  states the editorial rule',readme.includes('Photograph the situation, not the person'));
ok('  points at Disabled And Here',readme.includes('affecttheverb.com'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
