# Deployment runbook — webinar landing page

Target: **https://aimastery.t2upgrade.com**
Stack: Next.js 16 (App Router, Node runtime) · Node 20+ · payments via Razorpay **live** keys.

> **Read §1 first.** Credentials are deliberately not in this repository.
> Pushing and deploying the code alone will produce a site that cannot take payments.

---

## 1. Secrets are NOT in Git

`.gitignore` excludes `.env*` except `.env.example`. Verified: no `.env` file with real
values has ever been committed, and no live key appears in any tracked file.

The production values live in a single gitignored file in the developer's workspace:

```
.env.production.local
```

Transfer that file to the host through a secure channel (secret manager, password
manager, encrypted transfer) — **not** Git, Slack, or email. Either place the file at the
project root on the server, or copy its variables into the host's environment/secret
manager. Host environment variables take precedence over the file.

### Variables that must be set in production

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | **Yes** | Live publishable key (`rzp_live_…`). Public by design; baked into the browser bundle **at build time** — see §3. |
| `RAZORPAY_KEY_SECRET` | **Yes** | Server-only. Never prefix with `NEXT_PUBLIC_`. |
| `RAZORPAY_WEBHOOK_SECRET` | **Yes** | Must byte-match the secret entered in the Razorpay dashboard (§4). |
| `T2U_API_BASE_URL` | **Yes** | `https://t2upgrade.com/api` |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` | **Yes** | Hostinger mailbox `support@t2upgrade.com`. Credentials verified against the live server. |
| `SMTP_PORT` / `SMTP_SECURE` | **Yes** | **`465` with `SMTP_SECURE=true`** (implicit TLS). If the host blocks 465, switch to `587` **and** `SMTP_SECURE=false` — the two must change together or sending breaks. |
| `SMTP_FROM_EMAIL` / `SMTP_FROM_NAME` / `SMTP_REPLY_TO` | **Yes** | `support@t2upgrade.com` / `T2Upgrade`. |

Remove any stale `rzp_test_…` values from the hosting environment — host variables
override the file and would silently put production into test mode.

---

## 2. Razorpay dashboard — register the website (BLOCKING)

**Until this is done, every live payment fails.** Razorpay live accounts enforce an
account-level registered-website check and reject payments from any other origin with
`Payment blocked as website does not match registered website(s)`.

1. Razorpay Dashboard → **Account & Settings → Website and App Settings**.
2. Add `https://aimastery.t2upgrade.com`.
3. Wait for approval (a few hours to ~1 business day).
4. Under **Payment Methods**, confirm **UPI** is enabled on the live account.

`localhost` cannot be registered. All live verification happens on the deployed domain.

---

## 3. Build and start

`NEXT_PUBLIC_RAZORPAY_KEY_ID` is inlined into the client bundle during `next build`.
**Secrets must be present before the build runs**, not just before start — otherwise the
checkout opens with an empty key.

```bash
npm ci
npm run check:payments:production   # read-only: asserts live keys authenticate
npm run test:payments               # 4 payment-logic tests, offline
npm run build
npm start                           # behind the process manager / reverse proxy
```

Serve over HTTPS. The app must respond on the apex path and on
`/api/webinar/razorpay/webhook`.

---

## 4. Razorpay dashboard — register the webhook

This is the recovery path for a customer who pays and then closes the browser before the
confirmation request completes. Without it, those customers are charged but never
registered.

1. Razorpay Dashboard → **Live Mode** → Settings → **Webhooks** → Add New Webhook.
2. URL: `https://aimastery.t2upgrade.com/api/webinar/razorpay/webhook`
3. Secret: the exact `RAZORPAY_WEBHOOK_SECRET` value from the production environment.
4. Active events: **`payment.captured`** and **`order.paid`** (both).
5. Save, then confirm delivery shows HTTP 200 after the §5 smoke test.

The route verifies the raw request body HMAC and returns 503 if the secret is unset,
400 on a signature mismatch.

---

## 5. Post-deploy smoke test (one real payment)

The live price is **₹299**. `WEBINAR_PRICE` in `src/lib/config.ts` is the single
source of truth. The hero,
announcement bar, pay button, sticky mobile bar, the Razorpay order amount and the
server-side amount check all derive from it — there is no second place to change.

While it is not ₹299, a red **"LIVE TEST PRICING"** banner shows at the top of the
page and above the pay button, and `npm run test:payments` prints a reminder line.

### Running a ₹1 smoke test

Set `const WEBINAR_PRICE: number = 1;` in `src/lib/config.ts`, rebuild, test, then
set it back to `STANDARD_PRICE` and rebuild again. The price is baked into the page
at build time, so a restart alone will not change it. Confirm on the live page that
it reads **₹299** with **no red banner** before sending any traffic.

Alternatively, pay the real ₹299 and refund it from the Razorpay dashboard
(Razorpay keeps ~₹7 in fees) — no code change, nothing to remember to revert.

Complete a registration on the live site, then verify **all five**:

- [ ] Razorpay dashboard shows the payment as **captured** (not just authorized)
- [ ] Admin → CRM shows the lead with `payment_status: PAID` and source `ai_automation_webinar_paid`
- [ ] Browser landed on `/thank-you` with the WhatsApp community link
- [ ] Razorpay → Webhooks shows a **200** delivery for that payment
- [ ] Confirmation email received at the registrant's address

Then refund the test payment from the Razorpay dashboard.

### Verified live run — 16 Oct 2026

The paid path is proven end to end on the live domain:

| | |
|---|---|
| Order | `order_ToSG9FenuLXTjr` — ₹1, status `paid` |
| Payment | `pay_ToSGadCWxyNByM` — UPI, status `captured`, 04:54:23 UTC |
| CRM lead | `c36c721e-38cf-4da7-a908-6db9e19aff95`, `crm_payment_status: PAID` |
| Order marker | `registered_at: 2026-10-16T04:54:38Z` written back to Razorpay |

No `website does not match registered website(s)` rejections occurred on the live
domain; that error only ever appeared for checkouts opened from localhost.

**What this run does not prove:** the CRM sync above was performed by the browser's
confirmation request, not by the webhook. The webhook has still never fired — see
§4 and the gaps table.

---

## 6. How the payment flow works (for triage)

1. Browser POSTs the form to `/api/webinar/razorpay/create-order`; the **server** validates
   it and creates the order for the server-side price. The browser cannot choose the amount.
2. All form answers are stored in the Razorpay order's `notes`, so the server never trusts
   a later client body.
3. Checkout returns a receipt → `/api/webinar/razorpay/verify` validates the HMAC, re-fetches
   the real order and payment from Razorpay, and checks ownership, amount, currency, refunds
   and capture status.
4. Only after capture does the server POST the lead to `T2U_API_BASE_URL/leads` with
   `payment_status: "PAID"`, then writes the CRM lead id back onto the Razorpay order.
5. The confirmation page is shown only after capture **and** CRM sync succeed.

Razorpay is the payment ledger — the public leads endpoint is unauthenticated, so its
`source` field is not proof of payment.

---

## 7. Email (SMTP) — verified

Outbound mail is configured and **proven working** against Hostinger:

- `nodemailer.verify()` — server accepted the connection and the credentials on
  `smtp.hostinger.com:465` (implicit TLS).
- A real message was delivered: queued by the server as `250 2.0.0 Ok`, zero rejections.

Not yet exercised: the `/api/send-confirmation` route end-to-end with the real
booking template. That is covered by the §5 smoke test — confirm the registrant
actually receives the confirmation mail.

Deliverability note: check that SPF (and ideally DKIM/DMARC) for `t2upgrade.com`
authorises Hostinger to send, or confirmations may land in spam.

## 8. Known gaps at handoff

| Gap | Impact | Owner |
|---|---|---|
| **No webhook is registered in Razorpay** (verified: the account lists **0** webhooks) | **Blocking.** A customer who pays and then closes the browser before confirmation completes is charged but never registered, and nothing recovers them. See §4. | DevOps |
| Checkout dismissal is silent after a UPI QR scan | Three ₹1 payments on 16 Oct (`pay_ToQfIUyY6cuX3z`, `pay_ToQehFIrTloaQa`, `pay_ToQdrdE3vzGkw8`) arrived with no order attached and were auto-refunded. The payer's app shows a successful debit; the page shows nothing. | Dev |
| `INTRO_VIDEO_YOUTUBE_ID` empty | Intro video slot unpopulated. | Marketing |
| CRM has no authenticated registration endpoint | A crash between lead creation and the Razorpay marker write can duplicate a lead; the 500-seat cap is content, not enforced inventory. | Backend |
