import { WEBINAR_CONFIG } from "@/lib/config";
import { openRazorpayCheckout, PaymentCancelledError } from "@/lib/razorpay";
import type { RegistrationPayload, RegistrationResult } from "@/lib/types";

export { PaymentCancelledError };
export const PENDING_PAYMENT_KEY = "t2u_pending_payment";

export function generateRegistrationId() {
  return `T2U-AIW-${crypto.randomUUID().slice(0, 18).toUpperCase()}`;
}
export function validateMobile(value: string) { return /^[6-9]\d{9}$/.test(value.trim()); }
export function validateEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
export class RegistrationError extends Error {}

// Only used for free registration. Paid leads are created by the server after
// verified capture; the browser cannot choose the price or mark a lead paid.
export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResult> {
  const res = await fetch(`${WEBINAR_CONFIG.T2U_API_BASE_URL}/leads`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: payload.fullName, mobile: payload.mobileNumber,
      email: payload.email, city: payload.city, referred_by: payload.referredBy || undefined,
      course_interest: payload.webinarName, source: WEBINAR_CONFIG.LEAD_SOURCE }),
  });
  if (!res.ok) throw new RegistrationError("Registration could not be saved. Please try again.");
  const lead = await res.json();
  if (!lead.id) throw new RegistrationError("Admin confirmation is pending. Please contact support.");
  return { registrationId: generateRegistrationId(), registeredAt: lead.created_at ?? new Date().toISOString(), payload, leadId: lead.id };
}

export async function payForWebinar(payload: RegistrationPayload): Promise<RegistrationResult> {
  const saved = sessionStorage.getItem(PENDING_PAYMENT_KEY);
  let checkoutResult;
  if (saved) {
    checkoutResult = JSON.parse(saved).checkout;
  } else {
    let res: Response;
    try {
      res = await fetch(WEBINAR_CONFIG.API.CREATE_ORDER, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    } catch { throw new RegistrationError("Could not start payment. Check your connection and try again."); }
    const order = await res.json();
    if (!res.ok) throw new RegistrationError(order.error ?? "Could not start payment.");
    try {
      checkoutResult = await openRazorpayCheckout({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: WEBINAR_CONFIG.BRAND_NAME, description: payload.webinarName,
        prefill: { name: payload.fullName, email: payload.email, contact: payload.mobileNumber },
        theme: { color: "#7c3aed" },
      });
    } catch (error) {
      if (error instanceof PaymentCancelledError) throw error;
      throw new RegistrationError("Checkout could not be loaded. Please check your connection and try again.");
    }
    // Keep the successful checkout receipt until both verification and CRM sync
    // succeed. A retry/reload confirms the same payment instead of charging again.
    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({ checkout: checkoutResult, payload }));
  }
  let response: Response;
  try {
    response = await fetch(WEBINAR_CONFIG.API.VERIFY_PAYMENT, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(checkoutResult),
    });
  } catch { throw new RegistrationError("Payment confirmation is pending. Retry confirmation; do not pay again."); }
  const data = await response.json();
  if (!response.ok || !data.verified || !data.registration?.leadId) {
    throw new RegistrationError(data.error ?? "Payment confirmation is pending. Retry confirmation; do not pay again.");
  }
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
  return data.registration as RegistrationResult;
}
