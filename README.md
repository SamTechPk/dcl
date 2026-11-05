# DCL Cricket Arena — by SAM TECH

Live website: https://samtechpk.github.io/dcl/

## November 5, 2026 — Compact release
- Approved Option 1: one Compact card, date/time first, then contact details and optional team name.
- Today and Tomorrow shortcuts use Pakistan time. Times are never preselected.
- Valid times and contact details survive date changes; past start times are cleared.
- Price, duration and minimum advance are grouped directly above the WhatsApp action.
- Copy inquiry fallback is visible beside reset and preview tools.
- Optional Team Name is appended to the WhatsApp inquiry; customer name remains separate.
- Booking number and directions are beside the form. No new live availability or Manager sync is implied.
- Locked hero, imagery, branding, rates, hours, team reward section and footer are preserved.

### Development
Run `node scripts/build.cjs` after editing `scripts/inquiry.js`. It updates the inline script and its CSP hash and prepares `dist/` for local preview. Run `node scripts/test-inquiry.cjs` to validate. GitHub Pages serves the root index.html and assets. Do not publish temporary QA pages, preview manifests or customer data.

### Validation limits
576 hourly combinations, overnight dates, date shortcuts, preserved selections, invalid field blocking, team names and duplicate-submit guards passed automated checks. Desktop and phone-width Chrome layouts were inspected. Physical iPhone/Safari and Android device checks are still outstanding. Customers must tap Send in WhatsApp; opening WhatsApp is not delivery or confirmation.

## November 1, 2026 update
- One prominent Check availability on WhatsApp button directly below the form. It remains disabled until every field is valid.
- Inline field errors and a number-format indicator; no phone ownership verification is implied.
- Your requested session is explicitly labeled as an inquiry, not a confirmed booking.
- Overnight WhatsApp inquiries include an End Date.
- Team of the Month is introduced as Coming soon. No example team or generated photo is announced as a winner.
- Approved hero, official logo, PKR 2,000/hour, 24-hour opening, night session 6 PM–6 AM, directions and social accounts are preserved.

## Team of the Month publication
The source uses TEAM_OF_MONTH = null until a winner is confirmed. To publish a real winner, provide an object with name, month (YYYY-MM), and photo (an assets/filename.webp, .jpg, .jpeg or .png local path). Use the actual team photo with their agreement. The page displays the award month and hides a failed photo. Recalculate the inline script CSP hash after any script edit. Do not put private records, phone numbers, credentials or Manager exports in this public repository. The reward is one complimentary hour at the next booking, subject to DCL confirmation and slot availability. Promotion launch, tie handling and redemption rules still require the owner’s decision. There is no automatic Manager ranking/sync.

## Previous release changes
- A single session date and separate time range, with next-day clarification for overnight sessions.
- Clear WhatsApp inquiry button, immediate WhatsApp handoff, and message preview/copy fallback.
- Open 24 hours; night cricket 6 PM–6 AM. PKR 2,000 per hour; estimated minimum advance 50%.
- Pakistani mobile number normalization; date, time, name and phone validation.
- Original approved hero and separate experience artwork preserved; updated social sharing image.
- Local cacheable images/fonts, no third-party scripts, no public API dependency, no customer storage.

## Security and operation
The HTTPS static page uses a hash-based script Content Security Policy and blocks API connections, form submission and object embedding. Customer input is rendered as text and encoded into a fixed WhatsApp destination. No credentials or booking records are included. GitHub Pages does not support arbitrary custom response headers; the policy is applied using HTML metadata. Account security and access permissions remain the owner’s responsibility.

An inquiry does not reserve a slot. DCL confirms availability and advance payment on WhatsApp. Customers must tap Send in WhatsApp. This release does not save inquiries in the Booking Manager or show live slot availability.

## Validation
Automated checks passed for 576 hourly time ranges, overnight pricing, Pakistani phone normalization, invalid inputs, duplicate-click protection, encoded WhatsApp handoff, asset references and the exact script CSP hash. Desktop and mobile-width Chrome layouts were inspected. A physical iPhone/Safari check and WhatsApp’s actual share-preview refresh have not been verified. No website can be guaranteed free of all bugs or attacks.

## Files
Keep index.html, favicon.ico, .nojekyll and assets together for hosting. The separate standalone HTML included in the download is for convenient offline viewing; some mobile file-preview apps disable JavaScript, so use the live link for booking-form testing.

Powered by SAM TECH
© 2026 SAM TECH. All Rights Reserved.

## WhatsApp clarity update — 5 November 2026
- Required send step placed immediately after the fields, above the session preview.
- Explicit Send inquiry on WhatsApp label, clear next-step status and instructions to tap Send in WhatsApp.
- Session preview marked as not a ticket; filling the form does not submit an inquiry.
- Floating Chat with DCL icon for general questions, separate from the prepared inquiry.
