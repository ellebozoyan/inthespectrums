const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
const nav=fs.readFileSync(dir+'/site-nav.js','utf8'), idx=fs.readFileSync(dir+'/search-index.js','utf8');
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
const store={};let captured=null;
function open_(pg,withNav){
  let html=fs.readFileSync(path.join(dir,pg),'utf8')
    .replace('<script src="search-index.js"></script>','').replace('<script src="site-nav.js"></script>','');
  const vc=new (require('jsdom').VirtualConsole)();vc.on('jsdomError',e=>console.log('PAGE ERROR:',e.message.split('\n')[0]));
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,virtualConsole:vc,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=m=>{w.__a=m;};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};w.requestAnimationFrame=f=>f();
    class B{constructor(p){captured=p.join('');}} w.Blob=B;
    w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};}});
  if(withNav){[idx,nav].forEach(src=>{const s=dom.window.document.createElement('script');s.textContent=src;dom.window.document.body.appendChild(s);});}
  return dom.window;
}
const P=()=>JSON.parse(store['its_family_v1']).people[JSON.parse(store['its_family_v1']).current];

// ---------- medication list ----------
let w=open_('medication-list.html'),d=w.document,$=id=>d.getElementById(id);
ok('brand field',!!$('mbrand'));
ok('route field',!!$('mroute'));
ok('frequency field',!!$('mfreq'));
ok('precise timing field',!!$('mtiming'));
ok('handling chips',d.querySelectorAll('#handlechips .chip').length===10);
ok('delivery note field',!!$('delivery'));
$('mname').value='A supplement';$('mbrand').value='SomeMaker';$('mdose').value='10 drops';
$('mroute').value='Oral syringe';$('mfreq').value='Once daily';$('mkind').value='supp';
$('mtiming').value='empty stomach, 30 minutes before food';
d.querySelectorAll('#handlechips .chip')[1].click();
d.querySelectorAll('#whenchips .chip')[1].click();
$('addmed').click();
ok('supplement saved with brand',P().meds.items[0].brand==='SomeMaker');
ok('route saved',P().meds.items[0].route==='Oral syringe');
ok('frequency saved',P().meds.items[0].freq==='Once daily');
ok('precise timing saved',P().meds.items[0].timing.includes('empty stomach'));
ok('handling saved',P().meds.items[0].handling.length===1);
$('mname').value='A prescription';$('mkind').value='rx';$('mroute').value='By mouth';$('mfreq').value='Twice daily';
d.querySelectorAll('#whenchips .chip')[1].click();$('addmed').click();
ok('two items',P().meds.items.length===2);
ok('brand shown in list',$('medlist').innerHTML.includes('SomeMaker'));
ok('timing shown in list',$('medlist').innerHTML.includes('empty stomach'));
$('delivery').value='Everything by oral syringe. Capsules opened.';$('saveextra').click();
ok('delivery note saved',P().meds.delivery.includes('oral syringe'));
d.querySelector('.tab[data-k="print"]').click();
let doc=$('doc').innerHTML;
ok('print has delivery note in the info block',doc.includes('Delivery route')&&doc.includes('oral syringe'));
ok('print separates prescriptions',doc.includes('Prescription medications'));
ok('print separates supplements',doc.includes('Supplements and herbals'));
ok('print has a Route column',doc.includes('<th>Route</th>'));
ok('print has How often',doc.includes('<th>How often</th>'));
ok('print shows brand under the name',doc.includes('SomeMaker'));
ok('print lists special handling',doc.includes('Special handling'));

// ---------- calendar reminders + split export ----------
w=open_('family-calendar.html');d=w.document;$=id=>d.getElementById(id);
ok('repeat reminder field',!!$('ralert'));
ok('appointment reminder field',!!$('aalert'));
d.querySelector('.tab[data-k="build"]').click();
$('rname').value='Speech therapy';$('rtime').value='15:00';$('ralert').value='15';$('addrep').click();
ok('reminder saved on repeat',P().cal.repeats[0].alert==='15');
$('aname').value='Neurology';$('atime').value='11:00';$('aalert').value='1440';$('addappt').click();
ok('reminder saved on appointment',P().cal.appts[0].alert==='1440');
d.querySelector('.tab[data-k="people"]').click();
ok('medication reminder default',!!$('medalert'));
$('medalert').value='0';$('medalert').dispatchEvent(new w.Event('change'));
ok('medication reminder saved',P().medAlert==='0');
d.querySelector('.tab[data-k="share"]').click();
ok('whose-calendar selector',!!$('icswho'));
ok('six include options',$('icswhat').querySelectorAll('option').length===6);
ok('subscription guidance present',$('p-share').innerHTML.includes('silence the whole calendar'));
$('icsbtn').click();
let ics=captured;
ok('alarm written into the file',/BEGIN:VALARM/.test(ics));
ok('15-minute trigger correct',/TRIGGER:-PT15M/.test(ics));
ok('day-before trigger correct',/TRIGGER:-PT1440M/.test(ics));
ok('at-time trigger correct',/TRIGGER:PT0M/.test(ics));
ok('alarms balanced',(ics.match(/BEGIN:VALARM/g)||[]).length===(ics.match(/END:VALARM/g)||[]).length);
// appointments-only export excludes medication
$('icswhat').value='appts';$('icsbtn').click();
ok('appointments-only excludes routines',!captured.includes('Speech therapy'));
ok('appointments-only keeps the appointment',captured.includes('Neurology'));
ok('calendar named for its contents',/X-WR-CALNAME:.*appointments/i.test(captured));
$('icswhat').value='meds';$('icsbtn').click();
ok('medication-only excludes appointments',!captured.includes('Neurology'));

// ---------- reading modes + header ----------
w=open_('adult-life.html',true);d=w.document;
const btn=d.querySelector('.nv-outline');
ok('reading-mode control exists',!!btn);
ok('both options visible',btn.textContent.includes('Skim it')&&btn.textContent.includes('Show everything'));
ok('skim explained',btn.textContent.includes('one-line summary'));
ok('full explained',btn.textContent.includes('the full page'));
ok('starts un-collapsed',!btn.classList.contains('nv-showing'));
btn.click();
ok('collapses and flips emphasis',btn.classList.contains('nv-showing'));
ok('still shows both labels',btn.textContent.includes('Skim it')&&btn.textContent.includes('Show everything'));
btn.click();
ok('flips back',!btn.classList.contains('nv-showing'));
const labels=[...d.querySelectorAll('.nv-menu .nv-mb, .nv-menu .nv-mone')].map(e=>e.textContent.trim());
ok('full section titles in the bar',labels.some(l=>l.includes('School and services')));
ok('  keeps tracking',labels.some(l=>l.includes('Money, paperwork and tracking')));
ok('  keeps attention',labels.some(l=>l.includes('Learning, attention and mood')));
ok('  keeps health',labels.some(l=>l.includes('Safety and health')));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
