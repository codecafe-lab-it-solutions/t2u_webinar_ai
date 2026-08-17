import Image from "next/image";
import { Calendar, Clock, Timer, Monitor, Languages, GraduationCap, Gift, Lock, Radio } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import { formatWebinarDate } from "@/lib/formatDate";
import StatusPill from "./StatusPill";
import CountdownTimer from "./CountdownTimer";
import Reveal from "./Reveal";
import AnimatedHeadline from "./AnimatedHeadline";

const EVENT_CARDS = [
  { icon: Calendar, label: "Date", value: formatWebinarDate().dateLabel },
  { icon: Clock, label: "Time", value: formatWebinarDate().timeLabel },
  { icon: Timer, label: "Duration", value: WEBINAR_CONFIG.WEBINAR_DURATION },
  { icon: Monitor, label: "Mode", value: WEBINAR_CONFIG.WEBINAR_MODE_LABEL },
  { icon: Languages, label: "Language", value: WEBINAR_CONFIG.WEBINAR_LANGUAGE },
  { icon: GraduationCap, label: "Level", value: WEBINAR_CONFIG.WEBINAR_LEVEL },
];

export default function Hero() {
  const isPaid = WEBINAR_CONFIG.WEBINAR_MODE === "PAID";

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-brand-primary opacity-35 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[360px] w-[360px] rounded-full bg-brand-accent opacity-35 blur-[90px]" />

      <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Reveal delay={0.05}>
            <StatusPill tone="error">
              <Radio size={12} strokeWidth={2} />
              Live Webinar
            </StatusPill>
          </Reveal>

          <AnimatedHeadline
            delay={0.12}
            lines={["AI सीखिए नहीं,", "AI से काम करवाना सीखिए!"]}
            className="mt-4 text-[clamp(32px,5.4vw,54px)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          />

          <Reveal delay={0.18}>
            <p className="mt-5 max-w-[58ch] text-text-muted">
              Join Our Live AI Automation Webinar and Discover How to Automate Repetitive Work,
              Create Content Faster, Capture Leads and Grow Your Business Using AI Tools — Without
              Coding.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-3 max-w-[58ch] text-[0.95em] text-text-muted">
              बिना Coding के AI Tools और Automation की मदद से अपना समय बचाएँ, Productivity बढ़ाएँ
              और Online Income के नए अवसर तैयार करें।
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {EVENT_CARDS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg border border-border bg-card px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-text-faint">
                    <Icon size={12} strokeWidth={2} className="text-brand-accent" />
                    {label}
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold">{value}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-6 flex items-baseline gap-3">
              {isPaid ? (
                <>
                  <span className="font-mono text-lg text-text-faint line-through">
                    ₹{WEBINAR_CONFIG.WEBINAR_REGULAR_PRICE}
                  </span>
                  <span className="font-mono text-3xl font-extrabold text-gradient-end">
                    ₹{WEBINAR_CONFIG.WEBINAR_PRICE}
                  </span>
                  <span className="text-sm text-text-muted">Today&rsquo;s Special Price</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-lg text-text-faint line-through">
                    ₹{WEBINAR_CONFIG.WEBINAR_REGULAR_PRICE}
                  </span>
                  <span className="font-mono text-3xl font-extrabold text-gradient-end">FREE</span>
                  <span className="text-sm text-text-muted">आज के लिए</span>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.42}>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#register"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-md px-7 py-4 text-base font-bold"
              >
                🚀 Reserve My Seat Now
              </a>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[13px] text-text-faint">
              <Lock size={14} strokeWidth={2} />
              Secure Registration · Limited Seats · No Technical Knowledge Required
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative">
          <div className="relative rounded-2xl border border-border bg-card px-8 py-10 text-center">
            <span className="absolute left-5 top-5">
              <StatusPill tone="error">
                <Radio size={12} strokeWidth={2} />
                Live
              </StatusPill>
            </span>
            <div className="relative mx-auto mb-5 mt-6 h-[152px] w-[152px] overflow-hidden rounded-full border-[3px] border-white/15">
              <Image
                src="/brand/founder-square.jpg"
                alt={WEBINAR_CONFIG.TRAINER_NAME}
                fill
                sizes="152px"
                className="object-cover"
                priority
              />
            </div>
            <div className="text-[18px] font-bold">{WEBINAR_CONFIG.TRAINER_NAME}</div>
            <div className="mt-1 text-[13px] text-text-muted">{WEBINAR_CONFIG.TRAINER_ROLE}</div>

            <div className="mt-7 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-text-faint">
              <Gift size={12} strokeWidth={2} className="text-brand-accent" />
              Webinar शुरू होने में
            </div>
            <CountdownTimer className="mt-3.5" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
