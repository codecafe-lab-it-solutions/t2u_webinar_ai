import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isRateLimited, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 15;

interface VerifyRequestBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(`razorpay-verify:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: VerifyRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("verify: RAZORPAY_KEY_SECRET is not configured (.env.local)");
    return NextResponse.json({ error: "Payment isn't set up yet. Please contact support." }, { status: 503 });
  }

  // Razorpay's documented check: HMAC-SHA256 of "order_id|payment_id" using
  // the account secret must match what the client received from Checkout.
  // This is the ONLY trustworthy way to confirm a payment actually went
  // through — the client-side success callback alone can be spoofed.
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(razorpay_signature);
  const isValid = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

  if (!isValid) {
    console.warn("verify: signature mismatch", { razorpay_order_id, razorpay_payment_id });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
}
