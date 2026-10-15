import nextEnv from "@next/env";

// Match next build/next start's production environment precedence. Host-provided
// environment variables still take precedence over local files.
nextEnv.loadEnvConfig(process.cwd(), false);

try {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId?.startsWith("rzp_live_") || !secret) {
    throw new Error("Set the live Razorpay key pair in the production environment.");
  }
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    throw new Error("Set RAZORPAY_WEBHOOK_SECRET in the production environment.");
  }
  // Read-only credential check. Do not create orders, capture payments, or print
  // the returned orders, credentials, headers, or customer information.
  const response = await fetch("https://api.razorpay.com/v1/orders?count=1", {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Razorpay live authentication failed (HTTP ${response.status}).`);
  await response.body?.cancel();
  console.log("PASS: Live Razorpay API credentials authenticated (read-only check).");
  console.log("PASS: Production webhook secret configured locally; dashboard delivery must be activated after deployment.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Production payment check failed.");
  process.exitCode = 1;
}
