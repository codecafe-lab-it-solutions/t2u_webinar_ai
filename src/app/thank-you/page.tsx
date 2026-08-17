"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CalendarPlus,
  MessageCircle,
  Share2,
  Headphones,
  NotebookPen,
  Clock3,
  Lock,
} from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import { formatWebinarDate } from "@/lib/formatDate";
import { googleCalendarUrl } from "@/lib/calendar";
import { trackEvent } from "@/lib/analytics";
import type { RegistrationResult } from "@/lib/types";
import Reveal from "@/components/Reveal";
import TrackedLink from "@/components/TrackedLink";

export default function ThankYouPage() {
  const [registration, setRegistration] = useState<RegistrationResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // sessionStorage is only available client-side, so this can't be read
    // during render/SSR — the effect is the only place it can happen.
    const stored = sessionStorage.getItem("t2u_registration");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRegistration(JSON.parse(stored) as RegistrationResult);
      } catch {
        setRegistration(null);
      }
    }
    setHydrated(true);
  }, []);

  const { dateLabel, timeLabel } = formatWebinarDate();
  const isPaid = WEBINAR_CONFIG.WEBINAR_MODE === "PAID";

  const handleShare = async () => {
    const shareData = {
      title: WEBINAR_CONFIG.WEBINAR_NAME,
      text: "मैं इस Live AI Automation Webinar में join कर रहा/रही हूँ — आप भी आइए!",
      url: typeof window !== "undefined" ? window.location.origin : WEBINAR_CONFIG.WEBSITE,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share sheet — nothing to do
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  if (!hydrated) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5 py-14">
      <Reveal>
        <div className="rounded-2xl border border-border bg-card p-7 text-center sm:p-9">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/15 text-success">
            <CheckCircle2 size={30} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold sm:text-[26px]">
            🎉 Congratulations! आपका Registration सफल हो गया है।
          </h1>

          {registration ? (
            <p className="mt-3 text-text-muted">
              {registration.payload.fullName}, आपकी seat {WEBINAR_CONFIG.WEBINAR_NAME} के लिए
              confirm हो गई है।
            </p>
          ) : (
            <p className="mt-3 text-text-muted">
              आपका registration दर्ज हो चुका है। WhatsApp और email पर confirmation जल्द भेजा
              जाएगा।
            </p>
          )}

          <div className="mx-auto mt-5 max-w-[360px] rounded-md border border-border bg-surface px-4 py-3 font-mono text-[15px]">
            {registration?.registrationId ?? "REGISTRATION-ID-PENDING"}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 text-left">
            <div className="rounded-lg border border-border bg-surface px-3.5 py-3">
              <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-text-faint">
                Date
              </div>
              <div className="mt-1 font-mono text-sm font-bold">{dateLabel}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface px-3.5 py-3">
              <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-text-faint">
                Time
              </div>
              <div className="mt-1 font-mono text-sm font-bold">{timeLabel}</div>
            </div>
          </div>

          {isPaid && registration && (
            <div className="mt-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Status</span>
                <span className="font-bold text-success">Confirmed</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-text-muted">Amount Paid</span>
                <span className="font-mono font-bold">₹{WEBINAR_CONFIG.WEBINAR_PRICE}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 rounded-md px-5 py-3.5 text-sm font-bold"
            >
              <CalendarPlus size={16} strokeWidth={2} />
              Add to Google Calendar
            </a>
            <TrackedLink
              event="whatsapp_click"
              eventParams={{ location: "thank_you_page" }}
              href={WEBINAR_CONFIG.WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-border-strong px-5 py-3.5 text-sm font-bold transition-colors hover:border-brand-accent hover:text-brand-accent"
            >
              <MessageCircle size={16} strokeWidth={2} />
              Join WhatsApp Community
            </TrackedLink>
            <button
              type="button"
              onClick={() => {
                trackEvent("whatsapp_click", { location: "share_button" });
                handleShare();
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-border-strong px-5 py-3.5 text-sm font-bold text-text-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
            >
              <Share2 size={16} strokeWidth={2} />
              Share With Friends
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-left text-[13px] text-text-muted">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-text-faint">
              <Clock3 size={12} strokeWidth={2} className="text-brand-accent" />
              Important Instructions
            </div>
            <ul className="flex flex-col gap-1.5">
              <li>Webinar शुरू होने से 10 मिनट पहले join करें।</li>
              <li className="flex items-center gap-1.5">
                <NotebookPen size={13} strokeWidth={2} className="shrink-0" />
                Diary और pen साथ रखें।
              </li>
              <li className="flex items-center gap-1.5">
                <Headphones size={13} strokeWidth={2} className="shrink-0" />
                बेहतर experience के लिए earphones का इस्तेमाल करें।
              </li>
              <li className="flex items-center gap-1.5">
                <Lock size={13} strokeWidth={2} className="shrink-0" />
                Webinar link किसी अन्य व्यक्ति के साथ share न करें।
              </li>
            </ul>
          </div>

          <p className="mt-5 text-xs text-text-faint">
            सहायता चाहिए? Call/WhatsApp:{" "}
            <a href={`tel:${WEBINAR_CONFIG.SUPPORT_PHONE_INTL}`} className="underline">
              {WEBINAR_CONFIG.SUPPORT_PHONE}
            </a>
          </p>

          <Link href="/" className="mt-4 inline-block text-xs text-text-faint underline">
            Back to Home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
