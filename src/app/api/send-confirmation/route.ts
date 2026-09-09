import { NextRequest, NextResponse } from "next/server";
import { WEBINAR_CONFIG } from "@/lib/config";
import { formatWebinarDate } from "@/lib/formatDate";
import { googleCalendarUrl } from "@/lib/calendar";
import { validateEmail } from "@/lib/registration";
import { sendMail } from "@/lib/email/mailer";
import { isRateLimited, clientIp } from "@/lib/rateLimit";
import {
  confirmationEmailPreheader,
  confirmationEmailSubject,
  renderConfirmationEmailHtml,
  renderConfirmationEmailText,
  type ConfirmationEmailData,
} from "@/lib/email/confirmationEmail";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

interface SendConfirmationRequestBody {
  email?: string;
  userName?: string;
  registrationId?: string;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(`send-confirmation:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
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
