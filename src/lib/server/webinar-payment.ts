import crypto from "node:crypto";
import Razorpay from "razorpay";
import { WEBINAR_CONFIG } from "@/lib/config";
import type { RegistrationPayload, RegistrationResult } from "@/lib/types";

export class PaymentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function paymentClient() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new PaymentError("Payment is not configured. Please contact support.", 503);
  return { client: new Razorpay({ key_id: keyId, key_secret: keySecret }), keyId, keySecret };
}

export function validSignature(message: string, signature: unknown, secret: string) {
  if (typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha256", secret).update(message).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export function registrationPayload(input: unknown): RegistrationPayload {
  if (!input || typeof input !== "object") throw new PaymentError("Registration details are required.");
  const body = input as Record<string, unknown>;
  const text = (key: string, max = 200) => {
    if (typeof body[key] !== "string" || body[key].length > max) throw new PaymentError(`Invalid ${key}.`);
    return body[key].trim();
  };
  const fullName = text("fullName");
  const mobileNumber = text("mobileNumber", 10);
  const email = text("email", 254);
  const city = text("city", 100);
  const whatsappNumber = body.whatsappSameAsMobile === true ? mobileNumber : text("whatsappNumber", 10);
  const profession = text("profession", 50);
  const learningGoal = text("learningGoal", 50);
  if (!fullName || !city || !/^[6-9]\d{9}$/.test(mobileNumber) || !/^[6-9]\d{9}$/.test(whatsappNumber) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PaymentError("Please enter valid name, mobile, email, WhatsApp number and city.");
  }
  if (!["Student", "Working Professional", "Business Owner", "Freelancer", "Trainer/Coach", "Digital Marketer", "Other"].includes(profession)) throw new PaymentError("Please select a profession.");
  if (!["", "Business Automation", "Career Growth", "Freelancing", "Content Creation", "Online Income", "Personal Productivity"].includes(learningGoal)) throw new PaymentError("Invalid learning goal.");
  if (body.consent !== true) throw new PaymentError("Consent is required to register.");
  return {
    fullName, mobileNumber, whatsappNumber, whatsappSameAsMobile: whatsappNumber === mobileNumber,
    email, city, profession: profession as RegistrationPayload["profession"],
    learningGoal: learningGoal as RegistrationPayload["learningGoal"], consent: true,
    consentTimestamp: new Date().toISOString(), webinarName: WEBINAR_CONFIG.WEBINAR_NAME,
    webinarMode: WEBINAR_CONFIG.WEBINAR_MODE,
    referredBy: text("referredBy", 100), utmSource: text("utmSource", 100),
    utmMedium: text("utmMedium", 100), utmCampaign: text("utmCampaign", 100),
  };
}

export function orderNotes(payload: RegistrationPayload) {
  const json = JSON.stringify(payload);
  // Razorpay allows 15 note fields of 256 characters each. Preserve all form
  // answers on the server-created order, rather than trusting a later client body.
  const parts = Array.from(json.matchAll(/[\s\S]{1,240}/g), (match) => match[0]);
  if (parts.length > 10) throw new PaymentError("Registration details are too long.");
  return {
    webinar: WEBINAR_CONFIG.WEBINAR_NAME,
    registration_id: `T2U-AIW-${crypto.randomUUID().slice(0, 18).toUpperCase()}`,
    ...Object.fromEntries(parts.map((part, i) => [`registration_${i}`, part])),
  };
}

// Coalesce Checkout/webhook retries within one worker. The order's CRM marker
// survives restarts; cross-worker atomic deduplication needs CRM idempotency.
const inFlight = new Map<string, Promise<RegistrationResult>>();

export function finalizePayment(orderId: string, paymentId: string): Promise<RegistrationResult> {
  const pending = inFlight.get(orderId);
  if (pending) return pending;
  const task = finalize(orderId, paymentId).finally(() => inFlight.delete(orderId));
  inFlight.set(orderId, task);
  return task;
}

async function finalize(orderId: string, paymentId: string): Promise<RegistrationResult> {
  const { client, keyId } = paymentClient();
  const [order, payment] = await Promise.all([client.orders.fetch(orderId), client.payments.fetch(paymentId)]);
  const notes = order.notes as Record<string, string>;
  if (!notes?.registration_id || notes.webinar !== WEBINAR_CONFIG.WEBINAR_NAME || payment.order_id !== order.id) throw new PaymentError("This payment does not belong to this webinar registration.");
  if (Number(order.amount) !== WEBINAR_CONFIG.WEBINAR_PRICE * 100 || Number(payment.amount) !== Number(order.amount) || order.currency !== "INR" || payment.currency !== "INR" || Number(payment.amount_refunded) > 0) throw new PaymentError("Payment amount or currency does not match this registration.");
  // Capture only this server-created webinar order, for the exact configured fee.
  if (payment.status === "authorized") {
    const captured = await client.payments.capture(paymentId, order.amount, "INR");
    if (captured.status !== "captured") throw new PaymentError("Payment capture is pending. Retry confirmation without paying again.", 409);
  } else if (payment.status !== "captured") {
    throw new PaymentError("Payment is not completed. Your seat has not been confirmed.", 409);
  }
  const json = Array.from({ length: 10 }, (_, i) => notes[`registration_${i}`] ?? "").join("");
  const payload = JSON.parse(json) as RegistrationPayload;
  let leadId = notes.crm_lead_id;
  let registeredAt = notes.registered_at;
  const statusSyncError = "Payment received, but the admin payment status was not saved. Please contact support; do not pay again.";
  if (leadId && notes.crm_payment_status && notes.crm_payment_status !== "PAID") {
    throw new PaymentError(statusSyncError, 502);
  }
  if (!leadId) {
    const response = await fetch(`${process.env.T2U_API_BASE_URL ?? WEBINAR_CONFIG.T2U_API_BASE_URL}/leads`, {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": order.id },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        full_name: payload.fullName, mobile: payload.mobileNumber, email: payload.email,
        city: payload.city, referred_by: payload.referredBy || undefined,
        course_interest: payload.webinarName,
        payment_status: "PAID",
        source: `${WEBINAR_CONFIG.LEAD_SOURCE}_${keyId.startsWith("rzp_test_") ? "test_paid" : "paid"}`,
      }),
    });
    if (!response.ok) throw new PaymentError("Payment received, but admin sync is pending. Retry confirmation; do not pay again.", 502);
    const lead = await response.json() as { id?: string; created_at?: string; payment_status?: string };
    if (!lead.id) throw new PaymentError("Payment received, but admin confirmation is pending. Do not pay again.", 502);
    leadId = lead.id;
    registeredAt = lead.created_at ?? new Date().toISOString();
    await client.orders.edit(order.id, { notes: {
      ...notes, crm_lead_id: leadId, registered_at: registeredAt,
      crm_payment_status: lead.payment_status === "PAID" ? "PAID" : "PENDING",
    } });
    if (lead.payment_status !== "PAID") throw new PaymentError(statusSyncError, 502);
  }
  return {
    registrationId: notes.registration_id, registeredAt, payload, leadId,
    payment: { orderId: order.id, paymentId: payment.id, amount: Number(payment.amount), currency: payment.currency, mode: keyId.startsWith("rzp_test_") ? "test" : "live" },
  };
}
