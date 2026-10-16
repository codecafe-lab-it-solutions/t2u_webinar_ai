/**
 * Webinar runtime configuration.
 * Marketing/ops flip these per event without touching component code.
 * Real order creation + Razorpay signature verification MUST happen on a
 * server — RAZORPAY_KEY_ID below is the client-safe publishable key only,
 * never the secret.
 */
// Deliberately gated on development: even if the flag reaches a production host,
// next build/next start must continue to charge the standard webinar price.
const localPaymentTest = process.env.NODE_ENV === "development"
  && process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST === "true";

const STANDARD_PRICE: number = 299;

// The live charge. Single source of truth: the hero, announcement bar, pay
// button, sticky mobile bar, the Razorpay order amount and the server-side
// amount check all derive from this one value.
//
// For a live smoke test, set this to 1 temporarily and rebuild. Any value other
// than STANDARD_PRICE raises a red "LIVE TEST PRICING" banner at the top of the
// page and above the pay button, so a test price cannot ship unnoticed.
const WEBINAR_PRICE: number = STANDARD_PRICE;

export const WEBINAR_CONFIG = {
  WEBINAR_MODE: "PAID" as "FREE" | "PAID",
  WEBINAR_PRICE,
  LOCAL_PAYMENT_TEST: localPaymentTest,
  // Follows the price automatically. Drives the warning banners, so reverting
  // the price above is all that is needed to clear them.
  LIVE_TEST_PRICE_ACTIVE: WEBINAR_PRICE !== STANDARD_PRICE,
  STANDARD_PRICE,
  WEBINAR_REGULAR_PRICE: 999,
  REGISTRATION_STATUS: "OPEN" as "OPEN" | "CLOSED",
  SEATS_LIMIT: 500,
  WEBINAR_LINK_RELEASE: "BEFORE_EVENT" as "IMMEDIATE" | "BEFORE_EVENT",

  WEBINAR_NAME: "AI Automation Webinar",
  // Confirmed slot: Tue, 20 Oct 2026, 7:00 PM IST. Single source of truth —
  // countdown, calendar invite, page copy and the confirmation email all derive
  // from this one value.
  WEBINAR_DATE_ISO: "2026-10-20T19:00:00+05:30",
  WEBINAR_DURATION: "90–120 मिनट",
  WEBINAR_MODE_LABEL: "Live Online Webinar",
  WEBINAR_LANGUAGE: "Hindi + English",
  WEBINAR_LEVEL: "Beginner Friendly",

  BRAND_NAME: "T2Upgrade Pvt. Ltd.",
  TRAINER_NAME: "Kishan Khatri",
  TRAINER_ROLE: "Founder, T2Upgrade",
  SUPPORT_PHONE: "9269488028",
  SUPPORT_PHONE_INTL: "+919269488028",
  SUPPORT_EMAIL: "t2upgradeofficial@gmail.com",
  WEBSITE: "https://t2upgrade.com",
  // [WhatsApp community invite link] placeholder — replace before launch
  WHATSAPP_COMMUNITY_LINK: "https://chat.whatsapp.com/HUwL4GnIpyZ7WkP0KCcDxo",
  // [Intro video] placeholder — set the unlisted YouTube ID before launch
  INTRO_VIDEO_YOUTUBE_ID: "",

  // Client-safe publishable key (fine to expose in the browser bundle — it's
  // not the secret). Order creation + signature verification happen only in
  // the API routes below, using RAZORPAY_KEY_SECRET, which stays server-only.
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",

  // T2U's public Courses & Leads API (see api-reference doc). Open CORS,
  // no auth required — called directly from the browser, in both dev and
  // prod. This site is standalone (not T2U's own monorepo), so there's no
  // local T2U backend to fall back to — always hit production unless
  // NEXT_PUBLIC_T2U_API_BASE_URL explicitly points somewhere else (e.g. a
  // staging backend someone is actually running).
  T2U_API_BASE_URL: process.env.NEXT_PUBLIC_T2U_API_BASE_URL ?? "https://t2upgrade.com/api",
  // Distinct from "landing_page" (reserved for T2U's own main site) so this
  // webinar page's leads are identifiable in the CRM.
  LEAD_SOURCE: "ai_automation_webinar",

  API: {
    CREATE_ORDER: "/api/webinar/razorpay/create-order",
    VERIFY_PAYMENT: "/api/webinar/razorpay/verify",
  },
} as const;

export type WebinarConfig = typeof WEBINAR_CONFIG;
