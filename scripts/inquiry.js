'use strict';
// DCL public inquiries by SAM TECH. No accounts, secrets, booking writes or customer storage.
const RATE = 2000;
const $ = id => document.getElementById(id);
const money = n => 'PKR ' + n.toLocaleString('en-PK');
let sending = false, unlockTimer;
const touched = new Set();
const GENERAL_CHAT = 'https://wa.me/923337539909?text=' + encodeURIComponent('Hello DCL, I have a question.');
const chatLinks = [...document.querySelectorAll('[data-dcl-chat]')];
function pakistanNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const get = key => parts.find(p => p.type === key).value;
  return {day:`${get('year')}-${get('month')}-${get('day')}`,hour:Number(get('hour')),minute:Number(get('minute'))};
}
function addDay(day, amount) {
  const date = new Date(day + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0,10);
}
function validDate(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const parsed = new Date(day + 'T12:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === day;
}
function pretty(day, options) {
  return new Intl.DateTimeFormat('en-GB', {timeZone:'UTC',...options}).format(new Date(day + 'T12:00:00Z'));
}
function hour(h) { const n = h % 24; return (n % 12 || 12) + ' ' + (n < 12 ? 'AM' : 'PM'); }
function clock(h) { return hour(h).replace(' ', ':00 '); }
function option(select, value, label, disabled = false) {
  const el = document.createElement('option'); el.value = String(value); el.textContent = label; el.disabled = disabled; select.append(el);
}
function startIsPast(day, from) {
  return Date.parse(day + 'T00:00:00+05:00') + from * 3600000 < Date.now();
}
function session() {
  const day = $('date').value, start = $('time-from').value, end = $('time-to').value;
  if (!validDate(day) || start === '' || end === '') return null;
  const from = Number(start), to = Number(end);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from > 23 || to <= from || to > from + 24) return null;
  return {day, from, to, hours:to-from};
}
function phoneValue() {
  return $('customer-phone').value.trim().replace(/[\u0660-\u0669\u06f0-\u06f9]/g,c => String(c.charCodeAt(0) % 16)).replace(/[\s()-]/g,'').replace(/^(?:\+92|0092|92)(?=3)/,'0');
}
function nameValue() { return $('customer-name').value.trim().replace(/\s+/g,' '); }
function fieldErrors() {
  const now = pakistanNow(), day = $('date').value, name = nameValue(), rawName = $('customer-name').value;
  return {
    'customer-name': name.length < 2 || name.length > 80 || /[<>\x00-\x1f\x7f\u200e\u200f\u202a-\u202e\u2066-\u2069]/.test(rawName) || !/[\p{L}]/u.test(name) ? 'Enter your name (2–80 characters).' : '',
    'customer-phone': /^03\d{9}$/.test(phoneValue()) ? '' : 'Use 11 digits starting with 03, or +92 3XXXXXXXXX.',
    'date': !validDate(day) || day < now.day || day > addDay(now.day,90) ? 'Choose today or a date within the next 90 days.' : '',
    'time-from': $('time-from').value === '' || !Number.isInteger(Number($('time-from').value)) || Number($('time-from').value)<0 || Number($('time-from').value)>23 ? 'Choose a start time.' : validDate(day) && startIsPast(day,Number($('time-from').value)) ? 'This start time has passed. Choose a later time.' : '',
    'time-to': session() ? '' : 'Choose an end time after the start time.'
  };
}
function showValidation() {
  const errors = fieldErrors(), valid = !Object.values(errors).some(Boolean);
  for (const [id, message] of Object.entries(errors)) {
    const visible = touched.has(id) && message;
    $(id + '-error').textContent = visible || '';
    $(id).setAttribute('aria-invalid', visible ? 'true' : 'false');
    $(id).setCustomValidity(message);
  }
  $('form-status').textContent = valid ? 'Ready — tap the WhatsApp button below.' : 'Fill the details, then send on WhatsApp.';
  $('form-status').setAttribute('data-ready',String(valid));
  $('action-instruction').textContent = valid ? 'Ready? Send your inquiry below.' : 'Fill your details to enable this button.';
  return valid;
}
function bookingMessage() {
  const s = session(); if (!s) return '';
  return 'DCL CRICKET ARENA — NEW INQUIRY\n\nDate: ' + pretty(s.day,{weekday:'long',day:'numeric',month:'long',year:'numeric'}) + '\nTime Slot: ' + clock(s.from) + ' to ' + clock(s.to) + ' (' + s.hours + ' HRS)' + (s.to>=24 ? '\nEnd Date: ' + pretty(addDay(s.day,1),{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '') + '\nCustomer Name: ' + (nameValue() || '[Your name]') + '\nPhone Number: ' + (phoneValue() || '[Mobile number]');
}
function renderEnd(preserve = false) {
  const previous = $('time-to').value, value = $('time-from').value;
  $('time-to').replaceChildren(); option($('time-to'),'','End time');
  $('time-to').disabled = value === '';
  if (value !== '') for (let h = Number(value)+1; h <= Number(value)+24; h++) option($('time-to'),h,hour(h)+(h>=24?' · Next day':''));
  if (preserve && [...$('time-to').options].some(o=>o.value===previous)) $('time-to').value = previous;
}
function renderTimes(preserve = false) {
  const previousFrom = $('time-from').value, previousTo = $('time-to').value;
  $('time-from').replaceChildren(); option($('time-from'),'','Start time');
  for (let h=0; h<24; h++) option($('time-from'),h,hour(h),startIsPast($('date').value,h));
  if (preserve && previousFrom !== '' && [...$('time-from').options].some(o=>o.value===previousFrom && !o.disabled)) $('time-from').value=previousFrom;
  else $('time-from').value='';
  renderEnd();
  if (preserve && $('time-from').value !== '' && [...$('time-to').options].some(o=>o.value===previousTo)) $('time-to').value=previousTo;
  update();
}
function chooseQuickDate(offset) {
  $('date').value = addDay(pakistanNow().day, offset);
  renderTimes(true); $('error').textContent=''; $('send-status').textContent='';
}
function update() {
  const s = session(), day = $('date').value;
  const today = pakistanNow().day;
  $('date-today').setAttribute('aria-pressed',String(day===today));
  $('date-tomorrow').setAttribute('aria-pressed',String(day===addDay(today,1)));
  $('chosen-date').textContent = validDate(day) ? pretty(day,{weekday:'long',day:'numeric',month:'short',year:'numeric'}) : 'Choose your date';
  $('chosen-time').textContent = s ? hour(s.from) + ' TO ' + hour(s.to) : 'Choose your time';
  $('session-overnight').textContent = s && s.to>=24 ? 'Ends ' + pretty(addDay(s.day,1),{weekday:'long',day:'numeric',month:'short'}) + ' · next day' : '';
  $('duration').textContent = s ? s.hours + (s.hours===1?' hour':' hours') : '—';
  $('total').textContent = money(s ? s.hours*RATE : 0);
  $('advance').textContent = money(s ? s.hours*RATE/2 : 0);
  const complete = showValidation();
  $('request').disabled = !complete || sending;
  $('copy-message').disabled = !complete;
  updateChatLinks(complete);
  $('message-preview').value = bookingMessage() || 'Select your date and times to preview your inquiry.';
}
function updateChatLinks(complete) {
  const href = complete ? 'https://wa.me/923337539909?text='+encodeURIComponent(bookingMessage()) : GENERAL_CHAT;
  for (const link of chatLinks) link.setAttribute('href',href);
  $('chat-purpose').textContent = complete ? 'Send your inquiry' : 'General questions';
  $('floating-chat').setAttribute('aria-label',complete ? 'Send your completed inquiry to DCL on WhatsApp' : 'Chat with DCL on WhatsApp for general questions');
}
function openDclChat(event) {
  // Revalidate at the tap, including time expiry. Never send a partial inquiry.
  if (!Object.values(fieldErrors()).some(Boolean)) { sendInquiry(event); return; }
  if (sending) { event.preventDefault(); return; }
  updateChatLinks(false);
}
for (const link of chatLinks) link.addEventListener('click',openDclChat);
function readyToSend() {
  $('error').textContent = ''; $('send-status').textContent = '';
  const errors = fieldErrors();
  Object.keys(errors).forEach(id=>touched.add(id));
  if (!showValidation()) {
    const first = Object.keys(errors).find(id=>errors[id]);
    $('error').textContent = 'Please check the highlighted details.';
    $(first).focus(); update(); return false;
  }
  return true;
}
function unlock() { sending=false; clearTimeout(unlockTimer); $('request').removeAttribute('aria-busy'); update(); }
function sendInquiry(event) {
  event.preventDefault(); if (sending || !readyToSend()) return;
  // Navigate within the tap itself: no popup and no network dependency before WhatsApp.
  const message=bookingMessage(); sending=true; $('request').disabled=true; $('request').setAttribute('aria-busy','true');
  $('customer-phone').value=phoneValue(); $('message-preview').value=message;
  $('send-status').textContent='Opening WhatsApp. Tap Send there to deliver your inquiry.';
  try { window.location.assign('https://wa.me/923337539909?text='+encodeURIComponent(message)); }
  catch { $('send-status').textContent='Could not open WhatsApp. Use Copy message or the direct WhatsApp link below.'; }
  unlockTimer=setTimeout(unlock,1800);
}
async function copyInquiry() {
  if (!readyToSend()) return;
  const message=bookingMessage();
  try { if (!navigator.clipboard) throw Error('Clipboard unavailable'); await navigator.clipboard.writeText(message); $('send-status').textContent='Inquiry copied. Paste it into your chat with DCL.'; }
  catch { const field=$('message-preview'); field.closest('details').open=true; field.focus(); field.select(); field.setSelectionRange(0,field.value.length); $('send-status').textContent='Select and copy the message, then open WhatsApp below.'; }
}
const date=$('date'), now=pakistanNow(); date.min=now.day; date.max=addDay(now.day,90); date.value=now.day;
for (const event of ['input','change']) date.addEventListener(event,()=>{ if (!validDate(date.value)) { update(); return; } renderTimes(true); $('error').textContent=''; });
$('date-today').addEventListener('click',()=>chooseQuickDate(0));
$('date-tomorrow').addEventListener('click',()=>chooseQuickDate(1));
// Both events cover native iPhone/Safari pickers without click/touch interception.
for (const event of ['input','change']) {
  $('time-from').addEventListener(event,()=>{renderEnd(true); update(); $('error').textContent='';});
  $('time-to').addEventListener(event,()=>{update(); $('error').textContent='';});
}
for (const id of ['customer-name','customer-phone']) $(id).addEventListener('input',()=>{$(id).setCustomValidity('');$('send-status').textContent='';update();});
$('customer-form').addEventListener('submit',sendInquiry);
$('copy-message').addEventListener('click',copyInquiry);
$('clear').addEventListener('click',()=>{if(!sending){touched.delete('time-from');touched.delete('time-to');renderTimes();$('error').textContent='';$('send-status').textContent='';}});
window.addEventListener('pageshow',()=>{unlock(); const current=pakistanNow(); date.min=current.day; date.max=addDay(current.day,90);});
$('year').textContent=now.day.slice(0,4); $('sam-year').textContent=now.day.slice(0,4);
renderTimes(); $('script-help').hidden=true;

for (const id of ['customer-name','customer-phone','date','time-from','time-to']) {
  $(id).addEventListener('blur',()=>{touched.add(id);update();});
}
// A real winner and photo are published only after owner confirmation. No customer records are read here.
const TEAM_OF_MONTH = null;
function showTeamWinner(winner) {
  if (!winner || !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(winner.month) || typeof winner.name !== 'string' || winner.name.length>80) return;
  $('team-name').textContent = winner.name;
  $('team-month').textContent = pretty(winner.month+'-01',{month:'long',year:'numeric'});
  $('team-announcement').hidden = true; $('team-winner').hidden = false;
  if (typeof winner.photo === 'string' && /^assets\/[A-Za-z0-9_-]+\.(webp|png|jpg|jpeg)$/.test(winner.photo)) {
    const photo = $('team-photo'); photo.alt = winner.name+' team photo'; photo.src = winner.photo;
    photo.addEventListener('error',()=>{$('team-photo-frame').hidden=true;});
    $('team-photo-frame').hidden=false;
  }
}
showTeamWinner(TEAM_OF_MONTH);

// Keep general chat from covering the form or competing with the required inquiry action.
if ('IntersectionObserver' in window) {
  const chatObserver = new IntersectionObserver(entries => {
    $('floating-chat').setAttribute('data-form-visible', String(entries[0].isIntersecting));
  });
  chatObserver.observe($('booking'));
}
