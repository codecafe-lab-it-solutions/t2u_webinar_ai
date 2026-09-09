import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { WEBINAR_CONFIG } from "@/lib/config";
import { isRateLimited, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(`razorpay-create-order:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  if (WEBINAR_CONFIG.WEBINAR_MODE !== "PAID") {
    return NextResponse.json(
      { error: "This webinar is not configured for paid registration." },
      { status: 400 }
    );
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("create-order: Razorpay keys are not configured (.env.local)");
    return NextResponse.json(
      { error: "Payment isn't set up yet. Please contact support." },
      { status: 503 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // Amount is derived from server config, never trusted from the client —
  // otherwise a tampered request body could create a ₹1 order.
  const amountInPaise = Math.round(WEBINAR_CONFIG.WEBINAR_PRICE * 100);

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `t2u_webinar_${Date.now()}`,
      notes: { webinar: WEBINAR_CONFIG.WEBINAR_NAME },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("create-order: Razorpay order creation failed", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
