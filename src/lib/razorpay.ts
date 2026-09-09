"use client";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions & {
        handler: (response: RazorpaySuccessResponse) => void;
        modal?: { ondismiss?: () => void };
      }
    ) => RazorpayInstance;
  }
}

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout")));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

/** User-cancelled-the-modal is a distinct, expected outcome — not a real error. */
export class PaymentCancelledError extends Error {}

/**
 * Opens Razorpay's Checkout modal and resolves with the raw success payload
 * once the user completes payment. That payload is NOT proof of a real
 * payment on its own — the caller must send it to a server route that
 * verifies the signature with the account secret before treating the
 * registration as paid.
 */
export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions
): Promise<RazorpaySuccessResponse> {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay checkout failed to load"));
      return;
    }
    const rzp = new window.Razorpay({
      ...options,
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new PaymentCancelledError("Payment was cancelled")),
      },
    });
    rzp.open();
  });
}
