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

// ---------- calendar .ics ----------
let w=open_('family-calendar.html'),d=w.document,$=id=>d.getElementById(id);
d.querySelector('.tab[data-k="share"]').click();
ok('import control present',!!$('icsin'));
ok('import target selector',!!$('impwho'));
ok('how-far-back control',!!$('impback'));
ok('export instructions given',$('p-share').innerHTML.includes('File \u2192 Export')||$('p-share').innerHTML.includes('Import and export'));
ok('states nothing is uploaded',$('p-share').innerHTML.includes('never leaves the device'));

const today=new Date();
const iso=x=>x.getFullYear()+String(x.getMonth()+1).padStart(2,'0')+String(x.getDate()).padStart(2,'0');
const soon=new Date(today);soon.setDate(soon.getDate()+10);
const ics=[
'BEGIN:VCALENDAR','VERSION:2.0',
'BEGIN:VEVENT','SUMMARY:Neurology appointment','DTSTART:'+iso(soon)+'T110000',
'LOCATION:Children\\, 4th floor','DESCRIPTION:Bring the medication list','END:VEVENT',
'BEGIN:VEVENT','SUMMARY:Speech therapy','DTSTART:'+iso(today)+'T150000',
'RRULE:FREQ=WEEKLY;BYDAY=TU,TH','END:VEVENT',
'BEGIN:VEVENT','SUMMARY:A very long summary that is folded acro',' ss two lines in the file',
'DTSTART:'+iso(soon)+'T090000','END:VEVENT',
'BEGIN:VEVENT','DTSTART:'+iso(soon)+'T090000','END:VEVENT',   // no summary -> skipped
'END:VCALENDAR'].join('\r\n');
const parsed=w.eval('parseICS('+JSON.stringify(ics)+')');
ok('parses one-off events',parsed.appts.length===2);
ok('parses weekly repeats',parsed.repeats.length===1);
ok('weekly days decoded',JSON.stringify(parsed.repeats[0].days)==='[2,4]');
ok('time decoded',parsed.repeats[0].time==='15:00');
ok('folded lines rejoined per spec',parsed.appts.some(a=>a.name.includes('folded across two lines')));
ok('escaped comma unescaped',parsed.appts.some(a=>a.where&&a.where.includes('Children,')));
ok('unreadable entries counted, not dropped silently',parsed.skipped===1);
// preview then commit
w.eval('pendingImport = parseICS('+JSON.stringify(ics)+'); showImportPreview();');
ok('preview shown before committing',$('imppreview').innerHTML.includes('Ready to bring in'));
ok('preview counts both kinds',$('imppreview').textContent.includes('repeating item'));
ok('preview warns about unreadable',$('imppreview').textContent.includes('could not be read'));
ok('nothing added yet',(P().cal.repeats||[]).length===0);
$('doimport').click();
ok('repeats added on confirm',P().cal.repeats.length===1);
ok('appointments added on confirm',P().cal.appts.length===2);
ok('imported unshared by default',P().cal.repeats[0].share===false);
ok('imported without reminders',P().cal.repeats[0].alert==='');
ok('confirmation explains that',$('imppreview').textContent.includes('unshared and without reminders'));
// running it again should not duplicate
w.eval('pendingImport = parseICS('+JSON.stringify(ics)+'); showImportPreview();');
$('doimport').click();
ok('duplicates skipped',P().cal.repeats.length===1&&P().cal.appts.length===2);
ok('duplicate count reported',$('imppreview').textContent.includes('skipped'));

// ---------- medication paste ----------
w=open_('medication-list.html');d=w.document;$=id=>d.getElementById(id);
ok('paste box present',!!$('pastebox'));
$('pastebox').value="Melatonin 3 mg \u2014 bedtime\nGuanfacine 3 mL liquid, twice daily, 8am and 8pm\n- Vitamin D 1000 IU, morning\n\n";
$('readpaste').click();
ok('preview before adding',$('pastepreview').innerHTML.includes('Read 3 items'));
ok('nothing added yet',P().meds.items.length===0);
ok('dose extracted',$('pastepreview').innerHTML.includes('3 mg'));
ok('frequency extracted',$('pastepreview').innerHTML.includes('Twice daily'));
ok('bedtime slot extracted',$('pastepreview').innerHTML.includes('Bedtime'));
ok('bullet prefix stripped',!$('pastepreview').innerHTML.includes('- Vitamin'));
$('dopaste').click();
ok('items added',P().meds.items.length===3);
ok('names cleaned',P().meds.items[0].name==='Melatonin');
ok('leftover detail kept as timing',!!P().meds.items[0].timing);
ok('tells you what still needs doing',$('pastepreview').textContent.includes('cannot be guessed'));
$('pastebox').value="Melatonin 3 mg \u2014 bedtime";$('readpaste').click();$('dopaste').click();
ok('duplicate names skipped',P().meds.items.length===3);

// ---------- food paste ----------
w=open_('food-list.html');d=w.document;$=id=>d.getElementById(id);
$('fpaste').value="Chicken nuggets \u2014 Brand X only, dinosaur shapes\nToast, no crusts\nPlain pasta";
$('freadpaste').click();
ok('food preview shown',$('fpastepreview').innerHTML.includes('Read 3 foods'));
ok('preparation detail kept',$('fpastepreview').innerHTML.includes('Brand X only'));
$('fdopaste').click();
ok('foods added',P().food.items.length===3);
ok('detail stored in how',P().food.items[0].how.includes('Brand X'));

// ---------- goals paste ----------
w=open_('goals-tracker.html');d=w.document;$=id=>d.getElementById(id);
$('gpaste').value="SLP 1.1 Will ask wh-questions with fading models\nOT 1.4 Will write the letters of his name on a line\nWill descend stairs with one rail";
$('gpasteprov').value='Speech';
$('greadpaste').click();
ok('goals preview shown',$('gpastepreview').innerHTML.includes('Read 3 goals'));
ok('code separated',$('gpastepreview').innerHTML.includes('SLP 1.1'));
$('gdopaste').click();
ok('goals added',P().goals.items.length===3);
ok('code stored separately',P().goals.items[0].code==='SLP 1.1');
ok('wording kept exactly',P().goals.items[0].text==='Will ask wh-questions with fading models');
ok('uncoded goal still added',P().goals.items[2].code==='');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
