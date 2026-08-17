import { WEBINAR_CONFIG } from "@/lib/config";

export function formatWebinarDate() {
  const date = new Date(WEBINAR_CONFIG.WEBINAR_DATE_ISO);
  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const timeLabel = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  return { dateLabel, timeLabel: `${timeLabel} IST` };
}
