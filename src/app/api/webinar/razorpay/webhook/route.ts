import { NextRequest, NextResponse } from "next/server";
import { finalizePayment, paymentClient, PaymentError, validSignature } from "@/lib/server/webinar-payment";
import { WEBINAR_CONFIG } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const rawBody = await req.text();
  if (!validSignature(rawBody, req.headers.get("x-razorpay-signature"), secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }
  try {
    const event = JSON.parse(rawBody);
    if (!["payment.captured", "order.paid"].includes(event.event)) return NextResponse.json({ received: true });
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id || !payment?.id) return NextResponse.json({ error: "Missing payment." }, { status: 400 });
    const { client } = paymentClient();
    const order = await client.orders.fetch(payment.order_id);
    if (!order.notes || order.notes.webinar !== WEBINAR_CONFIG.WEBINAR_NAME || !order.notes.registration_id) {
      return NextResponse.json({ received: true, ignored: true });
    }
    // Fetch the actual payment/order again; do not rely on event fields as the ledger.
    await finalizePayment(payment.order_id, payment.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : "Registration sync pending." }, { status: 502 });
  }
}
