import { WEBINAR_CONFIG } from "@/lib/config";
import type { RegistrationPayload, RegistrationResult } from "@/lib/types";

export function generateRegistrationId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `T2U-AIW-${stamp}${rand}`;
}

export function validateMobile(value: string) {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export class RegistrationError extends Error {}

interface T2ULeadResponse {
  id: string;
  created_at: string;
}

/**
 * Submits the lead to T2U's public CRM API (POST /leads) — the same
 * endpoint T2U's own landing page posts to, so registrants land in the
 * same Admin → CRM → Leads list. Public, no auth, open CORS — called
 * directly from the browser (see the api-reference doc this was built
 * against). Throws RegistrationError on failure so the caller can show
 * the user a retry path instead of a fake success state.
 */
export async function submitRegistration(
  payload: RegistrationPayload
): Promise<RegistrationResult> {
  const registrationId = generateRegistrationId();

  let res: Response;
  try {
    res = await fetch(`${WEBINAR_CONFIG.T2U_API_BASE_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: payload.fullName,
        mobile: payload.mobileNumber,
        email: payload.email || undefined,
        city: payload.city || undefined,
        referred_by: payload.referredBy || undefined,
        course_interest: payload.webinarName,
        source: WEBINAR_CONFIG.LEAD_SOURCE,
      }),
    });
  } catch {
    throw new RegistrationError(
      "नेटवर्क समस्या के कारण registration नहीं हो पाया। कृपया दोबारा कोशिश करें।"
    );
  }

  if (!res.ok) {
    let message = `Registration failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // response body wasn't JSON — stick with the generic message
    }
    throw new RegistrationError(message);
  }

  const lead = (await res.json()) as T2ULeadResponse;
  return {
    registrationId,
    registeredAt: lead.created_at ?? new Date().toISOString(),
    payload,
    leadId: lead.id,
  };
}
