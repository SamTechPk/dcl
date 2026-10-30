# DCL Cricket Arena — by SAM TECH

Live website: https://samtechpk.github.io/dcl/

## Release changes
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
