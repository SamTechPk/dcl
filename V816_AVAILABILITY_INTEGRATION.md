# DCL V8.16 ↔ GitHub Pages public availability — staged integration

**Status: NOT CONNECTED. Do not merge as a claim of working live availability.**

## Verified
- Public website repository: SamTechPk/dcl. The current website is a static GitHub Pages HTML page.
- Manager repository: SamTechPk/dclbooking. index.html only redirects to a hosted app; it does not contain the server.
- V8.16 setup guide states that already-connected online devices poll for updates approximately every 15 seconds and that the initial full backup must be uploaded from the Manager. This was NOT verified against the production database.
- Public site's existing CSP has connect-src 'none', blocking browser availability API requests.

## To enable
1. Obtain/control the deployed hosted Manager server code and identify an existing (or implement a) read-only, authenticated-internally public availability endpoint.
2. Confirm real synced bookings exist and an updated booking on Phone A is visible on Phone B before exposing availability publicly.
3. Endpoint contract: GET with date=YYYY-MM-DD, startHour=<0..23>, endHour=<start+1..start+24>. Interpret DCL local timezone Asia/Karachi. Reject invalid dates, past times, long spans and overlapping bookings. Handle next-day sessions without ambiguity.
4. Response for successful authoritative checks:
   {"verified":true,"date":"2026-11-12","startHour":20,"endHour":22,"status":"available"}
   or status="booked". No name, phone, payment, booking IDs, or customer data.
5. Server should reflect committed confirmed bookings atomically; never claim available based on stale/offline devices; rate-limit and prevent enumeration abuse. Use Access-Control-Allow-Origin: https://samtechpk.github.io for GET and suitable Cache-Control: no-store. Recheck availability server-side at confirmation.
6. After deployment and security tests, set API_URL in availability-integration.js to the **verified** HTTPS API endpoint and test responses against known booked and free slots. Do not use a browser API secret.
7. Test two phones with fresh synchronized backups; test midnight, conflicts, offline, backend unavailable, invalid inputs, CORS, request timeout, and private-data exposure.
8. Review this PR, then merge only after all checks pass.

The staged button fails closed with LIVE CHECK NOT CONNECTED until API_URL is confirmed. Existing WhatsApp inquiry remains usable; checking a slot does not reserve it.
