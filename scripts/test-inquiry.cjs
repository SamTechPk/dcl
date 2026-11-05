const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const els={}; let deliveries=[],timers=[];
function element(){return {value:'',textContent:'',disabled:false,children:[],events:{},hidden:false,validationMessage:'',setAttribute(){},removeAttribute(){},append(x){this.children.push(x)},replaceChildren(){this.children=[];this.value=''},get options(){return this.children},addEventListener(k,f){this.events[k]=f},setCustomValidity(s){this.validationMessage=s},focus(){},closest(){return {open:false}},select(){},setSelectionRange(){},reportValidity(){return !els['customer-name'].validationMessage&&!els['customer-phone'].validationMessage}};}
const freeze='2026-10-30T12:00:00Z';
const ctx={console,Date:class extends Date{constructor(...args){super(...(args.length?args:[freeze]))}static now(){return Date.parse(freeze)}},Intl,Number,String,Set,Math,encodeURIComponent,navigator:{clipboard:{writeText:async()=>{}}},setTimeout(f){timers.push(f);return timers.length},clearTimeout(){},document:{querySelectorAll:()=>[els.chat??=element()],getElementById:id=>els[id]??=element(),createElement:element},window:{addEventListener(){},location:{assign:u=>deliveries.push(u)}}};
vm.createContext(ctx);vm.runInContext(code,ctx);const run=s=>vm.runInContext(s,ctx);
function pick(day,from,to){els.date.value=day;run('renderTimes()');els['time-from'].value=String(from);run('renderEnd()');els['time-to'].value=String(to);run('update()');}
els['customer-name'].value='Demo Customer';els['customer-phone'].value='+92 311 3131315';
pick('2026-10-30',20,23);
assert.equal(els['chosen-date'].textContent,'Friday, 30 Oct 2026');assert.equal(els['chosen-time'].textContent,'8 PM TO 11 PM');assert.equal(els.total.textContent,'PKR 6,000');assert.equal(els.advance.textContent,'PKR 3,000');assert.equal(els['session-overnight'].textContent,'');
assert.equal(run('bookingMessage()'),'DCL CRICKET ARENA — NEW INQUIRY\n\nDate: Friday, 30 October 2026\nTime Slot: 8:00 PM to 11:00 PM (3 HRS)\nCustomer Name: Demo Customer\nPhone Number: 03113131315');
run('sendInquiry({preventDefault(){}})');assert.equal(deliveries.length,1);assert.ok(deliveries[0].startsWith('https://wa.me/923337539909?text='));assert.equal(decodeURIComponent(deliveries[0].split('?text=')[1]),run('bookingMessage()'));assert.equal(els.request.disabled,true);run('sendInquiry({preventDefault(){}})');assert.equal(deliveries.length,1,'Duplicate tap blocked');run('unlock()');
for(const phone of ['03113131315','+923113131315','00923113131315','923113131315','۰۳۱۱۳۱۳۱۳۱۵','٠٣١١٣١٣١٣١٥']){els['customer-phone'].value=phone;assert.equal(run('phoneValue()'),'03113131315');}
pick('2026-10-30',23,30);assert.equal(els['chosen-time'].textContent,'11 PM TO 6 AM');assert.equal(els['session-overnight'].textContent,'Ends Saturday 31 Oct · next day');assert.ok(run('bookingMessage()').includes('End Date: Saturday, 31 October 2026'));assert.equal(els.total.textContent,'PKR 14,000');
pick('2026-10-31',9,12);assert.equal(run('readyToSend()'),true,'Daytime inquiry supported');
for(let from=0;from<24;from++)for(let length=1;length<=24;length++){pick('2026-10-31',from,from+length);assert.equal(run('session().hours'),length);assert.equal(els.total.textContent,'PKR '+(length*2000).toLocaleString('en-PK'));assert.equal(els['time-to'].options.length,25);}
pick('2026-10-31',20,23);els['customer-name'].value='<script>alert(1)</script>';assert.equal(run('readyToSend()'),false);els['customer-name'].value='Name\nAdvance: paid';assert.equal(run('readyToSend()'),false);els['customer-name'].value='Demo Customer';els['customer-phone'].value='12345';assert.equal(run('readyToSend()'),false);els['customer-phone'].value='03113131315';
pick('2026-10-30',16,18);assert.equal(run('readyToSend()'),false,'Past start rejected');
pick('2026-10-31',20,23);els.date.value='2026-02-30';assert.equal(run('readyToSend()'),false);els.date.value='2027-12-31';assert.equal(run('readyToSend()'),false);
pick('2026-10-31',20,23);els['time-to'].value='19';assert.equal(run('readyToSend()'),false);els['time-to'].value='45';assert.equal(run('readyToSend()'),false);
pick('2026-10-31',20,23);
for(const [id,value] of [['customer-name',''],['customer-phone','12345'],['time-from',''],['time-to','']]){
 const before=els[id].value;els[id].value=value;run('update()');assert.equal(els.request.disabled,true,id+' must block CTA');els[id].value=before;
}
run('update()');assert.equal(els.request.disabled,false);assert.equal(els['form-status'].textContent,'Ready — tap the WhatsApp button below.');
pick('2026-10-31',23,25);assert.ok(run('bookingMessage()').includes('End Date: Sunday, 1 November 2026'));
assert.ok(html.indexOf('id="request"')<html.indexOf('class="summary compact-session"'));
assert.ok(html.indexOf('id="date"')<html.indexOf('id="customer-name"'));

assert.equal((html.match(/id="request"/g)||[]).length,1);assert.ok(html.includes('Coming soon'));assert.ok(!html.includes('INDUS STRIKER'));
run("showTeamWinner({name:'Example XI',month:'2026-10',photo:'https://unsafe.test/photo.jpg'})");assert.equal(els['team-name'].textContent,'Example XI');assert.equal(els['team-photo'],undefined,'External photo URL not assigned');
pick('2026-10-31',20,23);assert.ok(!html.includes('id="team-name-input"'));assert.ok(!code.includes('teamValue'));
run('chooseQuickDate(0)');assert.equal(els.date.value,'2026-10-30');assert.equal(els['time-from'].value,'20');assert.equal(els['time-to'].value,'23');assert.equal(els['customer-name'].value,'Demo Customer');
run('chooseQuickDate(1)');assert.equal(els.date.value,'2026-10-31');assert.equal(els['time-to'].value,'23');
pick('2026-10-31',9,12);run('chooseQuickDate(0)');assert.equal(els['time-from'].value,'','Past start discarded');assert.equal(els['time-to'].value,'');assert.equal(els['customer-phone'].value,'03113131315');
run('chooseQuickDate(1)');assert.equal(els['time-from'].value,'','No start preselection');
const hash=crypto.createHash('sha256').update(code).digest('base64');assert.ok(html.includes("script-src 'sha256-"+hash+"'"));assert.ok(html.includes("connect-src 'none'"));assert.ok(!/\bfetch\(|\beval\(|innerHTML|localStorage|sessionStorage|document\.write/.test(code));
assert.ok(!html.includes('5 PM–5 AM'));assert.ok(html.includes('6 PM–6 AM'));assert.ok(html.includes('Open 24 Hours'));assert.ok(html.includes('property="og:image"'));assert.ok(!/on(?:click|load|error)=/i.test(html));
for(const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+|favicon\.ico)"|url\('([^']+)'\)/g)){const local=match[1]||match[2];if(!local.startsWith('data:'))assert.ok(fs.existsSync(path.join(root,'dist',local)),local);}
for(const url of ['https://www.instagram.com/DCLCricketArena/','https://www.facebook.com/DCLCricketArena/','https://www.tiktok.com/@DCLCricketArena'])assert.ok(html.includes(url));
console.log('PASS: 576 hourly ranges; 24-hour/daytime/overnight inquiries; date/phone/name validation; duplicate guard; immediate encoded WhatsApp link; amounts; exact CSP hash; no data storage/network APIs; local assets and social links.');

assert.ok(html.includes('Chat with DCL'));assert.ok(html.includes('Session preview · not a ticket'));assert.ok(html.includes('Tap here, then tap <strong>Send</strong> in WhatsApp.'));

// Every DCL chat entry uses the complete inquiry, with a safe general-chat fallback.
pick('2026-10-31',23,25);els['customer-name'].value='Demo Customer';els['customer-phone'].value='+923113131315';run('update()');
let beforeChats=deliveries.length;run('openDclChat({preventDefault(){}})');assert.equal(deliveries.length,beforeChats+1);assert.equal(decodeURIComponent(deliveries.at(-1).split('?text=')[1]),run('bookingMessage()'));assert.ok(run('bookingMessage()').includes('End Date:'));
run('openDclChat({preventDefault(){}})');assert.equal(deliveries.length,beforeChats+1,'Chat duplicate blocked');run('unlock()');
els['customer-phone'].value='123';run('update()');let prevented=false;ctx.chatEvent={preventDefault(){prevented=true}};run('openDclChat(chatEvent)');assert.equal(prevented,false,'Incomplete form allows normal general chat');assert.equal(deliveries.length,beforeChats+1,'No partial inquiry delivered');assert.equal(els['chat-purpose'].textContent,'General questions');
assert.ok(html.includes('dcl-ready-pulse 2.4s'));assert.ok(html.includes('@media(prefers-reduced-motion:reduce)'));assert.equal((html.match(/data-dcl-chat /g)||[]).length,5);
console.log('PASS: ready animation hooks, complete chat uses identical inquiry, duplicate guard, incomplete chat fallback, overnight end date.');
