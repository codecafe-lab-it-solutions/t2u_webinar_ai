/**
 * Webinar runtime configuration.
 * Marketing/ops flip these per event without touching component code.
 * Real order creation + Razorpay signature verification MUST happen on a
 * server — RAZORPAY_KEY_ID below is the client-safe publishable key only,
 * never the secret.
 */
export const WEBINAR_CONFIG = {
  WEBINAR_MODE: "FREE" as "FREE" | "PAID",
  WEBINAR_PRICE: 99,
  WEBINAR_REGULAR_PRICE: 999,
  REGISTRATION_STATUS: "OPEN" as "OPEN" | "CLOSED",
  SEATS_LIMIT: 500,
  WEBINAR_LINK_RELEASE: "BEFORE_EVENT" as "IMMEDIATE" | "BEFORE_EVENT",

  WEBINAR_NAME: "AI Automation Webinar",
  // [Webinar Date/Time] placeholder — replace with the confirmed slot before launch
  WEBINAR_DATE_ISO: "2026-09-20T19:00:00+05:30",
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

  RAZORPAY_KEY_ID: "rzp_test_REPLACE_ME",

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
