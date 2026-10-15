import { NextRequest, NextResponse } from "next/server";
import { isRateLimited, clientIp } from "@/lib/rateLimit";
import { finalizePayment, paymentClient, PaymentError, validSignature } from "@/lib/server/webinar-payment";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (isRateLimited(`razorpay-verify:${clientIp(req)}`, 10 * 60 * 1000, 20)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  try {
    const body = await req.json().catch(() => { throw new PaymentError("Invalid JSON body."); });
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
    if (typeof orderId !== "string" || !/^order_[a-zA-Z0-9]+$/.test(orderId) || typeof paymentId !== "string" || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) {
      throw new PaymentError("Missing or invalid payment verification fields.");
    }
    const { keySecret } = paymentClient();
    if (!validSignature(`${orderId}|${paymentId}`, signature, keySecret)) throw new PaymentError("Payment verification failed.");
    const registration = await finalizePayment(orderId, paymentId);
    return NextResponse.json({ verified: true, registration });
  } catch (error) {
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : "Payment confirmation is pending. Retry confirmation without paying again." }, { status: error instanceof PaymentError ? error.status : 502 });
  }
}
