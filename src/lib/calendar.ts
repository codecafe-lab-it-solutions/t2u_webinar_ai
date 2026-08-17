import { WEBINAR_CONFIG } from "@/lib/config";

function toGoogleDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function googleCalendarUrl() {
  const start = new Date(WEBINAR_CONFIG.WEBINAR_DATE_ISO);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: WEBINAR_CONFIG.WEBINAR_NAME,
    dates: `${toGoogleDate(start.toISOString())}/${toGoogleDate(end.toISOString())}`,
    details: `${WEBINAR_CONFIG.WEBINAR_NAME} — ${WEBINAR_CONFIG.BRAND_NAME}. Join link WhatsApp/email पर भेजा जाएगा।`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
