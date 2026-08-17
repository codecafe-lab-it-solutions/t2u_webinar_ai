/**
 * Thin wrapper around GA4/GTM dataLayer + Meta Pixel.
 * Both are no-ops until the real GTM container / Pixel ID are wired into
 * layout.tsx — calls are safe in dev and simply log to console instead.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "form_start"
  | "form_submit"
  | "whatsapp_click"
  | "course_module_click"
  | "related_course_click"
  | "video_play"
  | "scroll_depth";

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, params);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

export function captureUtmParams(): { source: string; medium: string; campaign: string } {
  if (typeof window === "undefined") return { source: "", medium: "", campaign: "" };
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") ?? "",
    medium: params.get("utm_medium") ?? "",
    campaign: params.get("utm_campaign") ?? "",
  };
}

/** T2U referral code, same `?ref=CODE` convention T2U's own landing page uses. */
export function captureReferralCode(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("ref") ?? "";
}
