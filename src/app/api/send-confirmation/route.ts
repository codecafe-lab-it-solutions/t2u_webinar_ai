import { NextRequest, NextResponse } from "next/server";
import { WEBINAR_CONFIG } from "@/lib/config";
import { formatWebinarDate } from "@/lib/formatDate";
import { googleCalendarUrl } from "@/lib/calendar";
import { validateEmail } from "@/lib/registration";
import { sendMail } from "@/lib/email/mailer";
import {
  confirmationEmailPreheader,
  confirmationEmailSubject,
  renderConfirmationEmailHtml,
  renderConfirmationEmailText,
  type ConfirmationEmailData,
} from "@/lib/email/confirmationEmail";

export const runtime = "nodejs";

/**
 * Best-effort per-IP rate limit. In-memory, so it resets on cold start and
 * doesn't share state across serverless instances — good enough as a first
 * line of defense against casual abuse of an unauthenticated mail-sending
 * endpoint, not a substitute for a shared store (e.g. Upstash Redis) if
 * this ever needs to hold up under real scale/attack traffic.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

interface SendConfirmationRequestBody {
  email?: string;
  userName?: string;
  registrationId?: string;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: SendConfirmationRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const userName = body.userName?.trim() ?? "";
  const registrationId = body.registrationId?.trim() ?? "";

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!userName || userName.length > 200) {
    return NextResponse.json({ error: "userName is required" }, { status: 400 });
  }
  if (!registrationId || registrationId.length > 100) {
    return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
  }

  const { dateLabel, timeLabel } = formatWebinarDate();
  const origin = req.nextUrl.origin;

  const data: ConfirmationEmailData = {
    userName,
    registrationId,
    webinarName: WEBINAR_CONFIG.WEBINAR_NAME,
    webinarDate: dateLabel,
    webinarTime: timeLabel,
    webinarDuration: WEBINAR_CONFIG.WEBINAR_DURATION,
    webinarMode: WEBINAR_CONFIG.WEBINAR_MODE_LABEL,
    bookingUrl: origin,
    calendarUrl: googleCalendarUrl(),
    whatsappUrl: WEBINAR_CONFIG.WHATSAPP_COMMUNITY_LINK,
    supportEmail: WEBINAR_CONFIG.SUPPORT_EMAIL,
    supportPhone: WEBINAR_CONFIG.SUPPORT_PHONE_INTL,
    // No real preference-center exists yet — replace with a proper
    // unsubscribe link once one is built.
    unsubscribeUrl: `mailto:${WEBINAR_CONFIG.SUPPORT_EMAIL}?subject=Unsubscribe`,
  };

  try {
    await sendMail({
      to: email,
      subject: confirmationEmailSubject(data.webinarName),
      html: renderConfirmationEmailHtml(data),
      text: renderConfirmationEmailText(data),
    });
  } catch (err) {
    console.error("send-confirmation: SMTP send failed", err);
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 502 });
  }

  return NextResponse.json({ success: true, preheader: confirmationEmailPreheader(data) });
}
