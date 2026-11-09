/* DCL V8.16 availability integration — fail closed until backend endpoint is verified.
   Public endpoint MUST return only status; never customer names/phones or booking details.
   This file intentionally does not send names, phone numbers, or save bookings. */
(() => {
  'use strict';
  // Set only after confirming server path, CORS, security and actual synced booking records.
  const API_URL = '';
  const button = document.getElementById('dcl-live-check-button');
  const status = document.getElementById('dcl-live-check-status');
  const date = document.getElementById('date');
  const from = document.getElementById('time-from');
  const to = document.getElementById('time-to');
  if (!button || !status || !date || !from || !to) return;
  const show = (message, color) => { status.textContent = message; status.style.color = color || ''; };
  [date, from, to].forEach(el => el.addEventListener('change', () => {
    show('Slot changed. Check again before contacting DCL.');
  }));
  button.addEventListener('click', async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value) || from.value === '' || to.value === '') {
      show('Please select a date, start time and end time first.'); return;
    }
    const start = Number(from.value), end = Number(to.value);
    if (!Number.isInteger(start) || !Number.isInteger(end) || end <= start || end > start + 24) {
      show('Please select a valid time range.'); return;
    }
    if (!API_URL) {
      show('LIVE CHECK NOT CONNECTED — please confirm availability with DCL on WhatsApp.','#855b14');
      return;
    }
    const endpoint = new URL(API_URL);
    if (endpoint.protocol !== 'https:' || endpoint.origin !== 'https://dcl-arena-manager-mobile.dclcricketarena.chatgpt.site') {
      show('LIVE CHECK UNAVAILABLE — backend configuration must be verified.'); return;
    }
    endpoint.searchParams.set('date',date.value);
    endpoint.searchParams.set('startHour',String(start));
    endpoint.searchParams.set('endHour',String(end));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),8000);
    button.disabled = true;
    show('Checking the synchronized DCL booking calendar…');
    try {
      const response = await fetch(endpoint.href,{method:'GET',mode:'cors',credentials:'omit',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error('HTTP failure');
      const data = await response.json();
      if (!data || data.verified !== true || data.date !== date.value || data.startHour !== start || data.endHour !== end ||
        !['available','booked'].includes(data.status)) throw new Error('Unverified response');
      show(data.status === 'available'
        ? 'AVAILABLE — this is a live check, not a reservation. DCL must confirm your booking.'
        : 'BOOKED — please choose another time or contact DCL.',data.status === 'available' ? '#227242' : '#a12626');
    } catch (_) {
      show('UNABLE TO VERIFY ONLINE — please contact DCL before making payment.','#a12626');
    } finally {
      clearTimeout(timeout); button.disabled = false;
    }
  });
})();
