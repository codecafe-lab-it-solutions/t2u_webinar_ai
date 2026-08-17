import { Ticket } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";

export default function AnnouncementBar() {
  const isPaid = WEBINAR_CONFIG.WEBINAR_MODE === "PAID";
  const message = isPaid
    ? `Special Launch Price ₹${WEBINAR_CONFIG.WEBINAR_PRICE} — Limited Seats Only`
    : "Limited Seats Available | Registration Closing Soon";

  return (
    <div className="border-b border-border bg-error/10 px-4 py-2.5 text-center text-[13px] font-semibold text-[#ffd0dc]">
      <span className="inline-flex items-center justify-center gap-2">
        {isPaid ? (
          <Ticket size={14} strokeWidth={2} className="shrink-0 text-error" />
        ) : (
          <span className="h-2 w-2 shrink-0 rounded-full bg-error" />
        )}
        {message}
      </span>
    </div>
  );
}
