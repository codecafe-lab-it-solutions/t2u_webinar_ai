# Webinar payments

Production site: **https://aimastery.t2upgrade.com/**

Live webhook URL: **https://aimastery.t2upgrade.com/api/webinar/razorpay/webhook**

Development checkout uses the supplied **test** keys in `.env.local`.
Production build/start uses the supplied **live** keys in `.env.production.local`,
with a separate generated production webhook secret. Both files are gitignored.
No live charges have been made. Do not put a secret in a
`NEXT_PUBLIC_` variable.

## Current flow

1. Validate the form on the server and create a Razorpay order for ₹299 / 29,900 paise.
2. Store all form answers, consent timestamp and registration ID in the order's notes.
3. Open Standard Checkout with the server-created order and customer prefill.
4. Verify the callback HMAC; fetch the actual order and payment; check ownership,
   amount, currency, refunds and capture status. Capture an authorized payment.
5. POST the supported contact fields and `payment_status: "PAID"` to
   `https://t2upgrade.com/api/leads`, and require the response to confirm `PAID`.
6. Save the CRM lead ID and registration timestamp back on the Razorpay order.
7. Show the booking confirmation only after capture and CRM sync succeed.

Sources are `ai_automation_webinar_test_paid` in test mode and
`ai_automation_webinar_paid` in live mode. These distinguish CRM leads, but the
public leads endpoint is unauthenticated: its source field is **not proof of
payment**. Razorpay remains the payment ledger.

Successful checkout receipts stay in session storage until confirmation succeeds.
The form can retry confirmation after a network/CRM failure without another
payment. Order markers skip repeat CRM writes after successful synchronization;
simultaneous requests in one server worker share the same operation.

## Webhook activation after deployment

The route `/api/webinar/razorpay/webhook` verifies the raw request body with
`RAZORPAY_WEBHOOK_SECRET` and recovers captured payments when the browser closes.
A random local secret has been generated in `.env.local`.

In Razorpay Dashboard, configure the deployed HTTPS URL for this route, subscribe
to `payment.captured` and `order.paid`, and set the matching webhook secret in both
Razorpay and the hosting environment. Localhost cannot receive public webhooks.
The endpoint is implemented; dashboard delivery is not configured by this repo.
Webhook recovery syncs the CRM; email delivery still needs SMTP configuration.

## Live activation

The supplied live key pair is configured in `.env.production.local` in this
workspace. `npm run build` and `npm start` load it; `npm run dev` continues to use
test keys. Host environment variables override the files, so DevOps must remove
any old test values from production hosting settings.

DevOps handoff:

1. Push the code normally. Credentials are intentionally excluded from Git.
2. Securely provision this workspace's `.env.production.local` on the production
   server, or copy its three Razorpay settings to the host's secret manager:
   `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and
   `RAZORPAY_WEBHOOK_SECRET`. Also set `T2U_API_BASE_URL=https://t2upgrade.com/api`.
3. With production secrets available, run `npm ci`,
   `npm run check:payments:production`, `npm run test:payments`, `npm run build`,
   then `npm start` using the host's process manager.
4. In the Razorpay **Live Mode** dashboard, register
   `https://aimastery.t2upgrade.com/api/webinar/razorpay/webhook`, use the matching
   production webhook secret, and subscribe to `payment.captured` and `order.paid`.
5. Verify delivery after deployment. The public URL/dashboard webhook is not
   configured from this workspace, and no real payment has been performed.

The public key is embedded at build time, so set production secrets **before**
building. Configure SMTP separately for confirmation email delivery. Do not commit
either key pair or the webhook secret. Deployment requires the ignored environment
file or equivalent hosting secrets; pushing code alone does not transfer them.

## Admin API limitation verified during setup

The supplied API saves `full_name`, `mobile`, `email`, `city`, `referred_by`,
`course_interest`, `source` and `payment_status`. A labeled integration-test POST with a `notes`
field returned `notes: null`: arbitrary form/payment metadata is ignored.

Consequently, contact details appear in Admin → CRM. Payment IDs, fee, WhatsApp
number, profession, learning goal, UTM values and consent are retained on the
Razorpay order, but cannot currently be displayed as admin fields by this site.

Payment status was independently verified: POSTing `payment_status: "paid"`
returns `payment_status: "PAID"`. The integration sends the canonical uppercase
value only after captured payment. The separate CRM workflow `status` remains
`new`; it is not the payment status. Leads are created after payment in this flow,
so they enter the CRM already paid rather than creating a pending duplicate.
PATCH `/api/leads/:id` requires authentication (verified HTTP 401 without a token).
Updating historical pending leads therefore needs an admin API token/backend access.

To complete a unified paid-seat ledger, the admin backend needs an authenticated
registration endpoint accepting an idempotent `razorpay_order_id`,
`razorpay_payment_id`, registration ID, verified amount/status and all form fields.
It must independently validate payment, enforce unique order/payment IDs and
atomically reserve capacity. Sending an `Idempotency-Key` is already implemented,
but support is not documented by the current public endpoint. Without that backend
change, a multi-worker race or a crash between creating a lead and updating the
Razorpay marker can duplicate a CRM lead. The advertised 500 seats is currently
content, not an inventory limit enforced by the CRM API.

## Verification

Production preparation: the supplied live API keys authenticated successfully
using a read-only Razorpay request. The production build embeds the live public
key, excludes server secrets from browser bundles, and starts successfully with
HTTP 200 on the homepage and no test-mode banner. No live order or charge was
created by these checks. Run `npm run check:payments:production` on the host again
after provisioning its secrets.

`npm run test:payments` checks forged receipts, invalid form input, amount/order
tampering, capture-before-CRM, retry behavior and CRM failure recovery using
isolated SDK/network doubles. `npm run lint` and `npm run build` validate the app.
Manual sandbox checkout uses Razorpay's demo bank Success/Failure controls and
synthetic contact details, never live cards or real charges.

Verified sandbox order: `order_To7V5LxXbZH2km`, captured payment
`pay_To7VjWxCZI092D`, CRM lead `0ee09539-a67c-44b3-8c84-491353764847`.
Repeating server confirmation returns that same lead. A later demo-bank popup
was unresponsive to browser control and that second attempt was cancelled.
