/**
 * Read-only payment triage. Prints recent Razorpay orders and payments with
 * failure reasons, so a failed checkout can be diagnosed without the dashboard.
 *
 * Creates nothing, captures nothing, refunds nothing. Never prints credentials
 * or customer contact details.
 *
 *   npm run inspect:payments
 */
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const secret = process.env.RAZORPAY_KEY_SECRET;
if (!keyId || !secret) {
  console.error("Razorpay keys are not set in this environment.");
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`;
const mode = keyId.startsWith("rzp_live_") ? "LIVE" : "TEST";

async function get(path) {
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    headers: { Authorization: auth },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Razorpay request failed (HTTP ${res.status}).`);
  return res.json();
}

const when = (ts) => new Date(ts * 1000).toISOString().replace("T", " ").slice(0, 19);

try {
  console.log(`Mode: ${mode}\n`);

  const { items: orders } = await get("/orders?count=10");
  console.log("RECENT ORDERS");
  for (const o of orders) {
    const mine = o.notes?.registration_id ? "  [this webinar]" : "";
    console.log(`  ${o.id}  ${String(o.amount / 100).padStart(6)} ${o.currency}  ${o.status.padEnd(9)} attempts=${o.attempts}  ${when(o.created_at)}${mine}`);
    if (o.notes?.crm_lead_id) console.log(`      synced to CRM lead ${o.notes.crm_lead_id} (${o.notes.crm_payment_status ?? "?"})`);
  }

  const { items: payments } = await get("/payments?count=10");
  console.log("\nRECENT PAYMENTS");
  for (const p of payments) {
    console.log(`  ${p.id}  ${String(p.amount / 100).padStart(6)} ${p.currency}  ${p.status.padEnd(10)} ${String(p.method).padEnd(6)} ${when(p.created_at)}`);
    if (!p.order_id) console.log(`      ⚠ no order attached — orphan payment, Razorpay auto-refunds these`);
    if (p.amount_refunded > 0) console.log(`      refunded ${p.amount_refunded / 100} ${p.currency} (${p.refund_status})`);
    if (p.error_description) {
      console.log(`      ✖ ${p.error_description}`);
      console.log(`        reason=${p.error_reason} step=${p.error_step} source=${p.error_source}`);
    }
  }

  const failed = payments.filter((p) => p.status === "failed");
  console.log(
    failed.length
      ? `\n${failed.length} of the last ${payments.length} payments failed. The ✖ lines above are Razorpay's own verdict — quote those payment IDs to Razorpay support.`
      : `\nNo failures in the last ${payments.length} payments.`
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : "Payment inspection failed.");
  process.exitCode = 1;
}
