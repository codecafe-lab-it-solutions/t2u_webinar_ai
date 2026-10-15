import { NextRequest, NextResponse } from "next/server";
import { WEBINAR_CONFIG } from "@/lib/config";
import { isRateLimited, clientIp } from "@/lib/rateLimit";
import { orderNotes, paymentClient, PaymentError, registrationPayload } from "@/lib/server/webinar-payment";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (isRateLimited(`razorpay-create-order:${clientIp(req)}`, 10 * 60 * 1000, 10)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  if (WEBINAR_CONFIG.WEBINAR_MODE !== "PAID" || WEBINAR_CONFIG.REGISTRATION_STATUS !== "OPEN") {
    return NextResponse.json({ error: "Paid registration is not open." }, { status: 400 });
  }
  try {
    const input = await req.json().catch(() => { throw new PaymentError("Invalid JSON body."); });
    const payload = registrationPayload(input);
    const { client, keyId } = paymentClient();
    const notes = orderNotes(payload);
    const order = await client.orders.create({
      amount: Math.round(WEBINAR_CONFIG.WEBINAR_PRICE * 100), currency: "INR",
      receipt: notes.registration_id, notes,
    });
    return NextResponse.json({ orderId: order.id, amount: Number(order.amount), currency: order.currency, keyId });
  } catch (error) {
    // Do not log SDK request objects: they may contain Basic Auth credentials.
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : "Could not start payment. Please try again." }, { status: error instanceof PaymentError ? error.status : 502 });
  }
}
