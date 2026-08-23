const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path');
const dir='/mnt/user-data/outputs';
const store={};
let captured=null;
function open_(pg){
  let html=fs.readFileSync(path.join(dir,pg),'utf8').replace('<script src="site-nav.js"></script>','');
  return new JSDOM(html,{runScripts:"dangerously",url:"https://x.test/"+pg,
    beforeParse(w){Object.defineProperty(w,'localStorage',{value:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
    w.alert=()=>{};w.confirm=()=>true;w.print=()=>{};w.scrollTo=()=>{};
    class B{constructor(parts){captured=parts.join('');}}
    w.Blob=B; w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};}}).window;
}
let w=open_('medication-list.html'),d=w.document;
d.getElementById('mname').value='Melatonin';d.getElementById('mdose').value='3 mg';
d.querySelectorAll('#whenchips .chip')[6].click();
d.getElementById('addmed').click();

w=open_('family-calendar.html');d=w.document;
const $=id=>d.getElementById(id);
d.querySelector('.tab[data-k="build"]').click();
$('rname').value='Speech therapy';$('rtime').value='15:00';$('addrep').click();
$('aname').value='Neurology; Dr Patel, floor 4';$('atime').value='11:00';$('addappt').click();
d.querySelector('.tab[data-k="share"]').click();
$('icsbtn').click();
const ics=captured;
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL:',n));};
ok('has calendar wrapper',/^BEGIN:VCALENDAR/.test(ics)&&/END:VCALENDAR$/.test(ics.trim()));
ok('declares version',ics.includes('VERSION:2.0'));
ok('has a calendar name',ics.includes('X-WR-CALNAME'));
ok('CRLF line endings',ics.includes('\r\n'));
const events=(ics.match(/BEGIN:VEVENT/g)||[]).length;
const ends=(ics.match(/END:VEVENT/g)||[]).length;
ok(`events balanced (${events})`,events===ends&&events>=3);
ok('every event has a UID',(ics.match(/UID:/g)||[]).length===events);
ok('every event has DTSTART',(ics.match(/DTSTART:/g)||[]).length===events);
ok('every event has SUMMARY',(ics.match(/SUMMARY:/g)||[]).length===events);
ok('weekly rule for the repeat',/RRULE:FREQ=WEEKLY;BYDAY=[A-Z,]+;UNTIL=\d{8}T\d{6}Z/.test(ics));
ok('daily rule for medication',/RRULE:FREQ=DAILY;UNTIL=/.test(ics));
ok('DTSTART format is valid',/DTSTART:\d{8}T\d{6}/.test(ics));
ok('semicolons escaped in titles',ics.includes('Neurology\\;'));
ok('medication carried into the file',ics.includes('Melatonin'));
ok('no unescaped commas in summaries',!/SUMMARY:[^\\\r\n]*,/.test(ics));
console.log(`\n${pass} passed, ${fail} failed`);
console.log('--- first event ---');
console.log(ics.split('BEGIN:VEVENT')[1].split('END:VEVENT')[0].trim());
process.exit(fail?1:0);
