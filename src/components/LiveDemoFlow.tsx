import Image from "next/image";
import { ArrowDown, FileInput, Database, MessageCircle, Mail, BellRing, Users, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: FileInput, label: "Landing Page Form" },
  { icon: Database, label: "Lead Saved in CRM / Sheet" },
];

const BRANCH: { icon: LucideIcon; label: string }[] = [
  { icon: MessageCircle, label: "WhatsApp Confirmation" },
  { icon: Mail, label: "Email Confirmation" },
];

const TAIL: { icon: LucideIcon; label: string }[] = [
  { icon: BellRing, label: "Webinar Reminder" },
  { icon: Users, label: "Webinar Attendance" },
  { icon: Repeat, label: "Follow-up & Course Offer" },
];

function Node({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="glow-card flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-card px-4 py-4 text-center text-sm font-semibold">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-accent/30 bg-brand-accent/10 text-brand-accent">
        <Icon size={15} strokeWidth={2} />
      </span>
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2 text-brand-accent/70">
      <ArrowDown size={18} strokeWidth={2} />
    </div>
  );
}

export default function LiveDemoFlow() {
  return (
    <section id="demo" className="section relative overflow-hidden">
      <div className="bg-blob -right-24 top-1/3 h-72 w-72 bg-brand-primary opacity-15" />
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Live Demo</span>
          <h2>Webinar में Live Automation बनते हुए देखें</h2>
        </div>

        <Reveal>
          <div className="relative mx-auto mb-10 aspect-video max-w-[900px] overflow-hidden rounded-2xl border border-border-strong">
            <Image
              src="/webinar/image3.jpg"
              alt="AI automation workflow: a customer message is analyzed by an AI assistant, which captures the lead in the CRM, notifies the team, schedules a follow-up, and surfaces growth trends in analytics."
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto flex max-w-[760px] flex-col">
            {STEPS.map((step, i) => (
              <div key={step.label}>
                <Node {...step} />
                {i < STEPS.length - 1 && <Arrow />}
              </div>
            ))}
            <Arrow />
            <div className="grid grid-cols-2 gap-3.5">
              {BRANCH.map((step) => (
                <Node key={step.label} {...step} />
              ))}
            </div>
            <Arrow />
            {TAIL.map((step, i) => (
              <div key={step.label}>
                <Node {...step} />
                {i < TAIL.length - 1 && <Arrow />}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-[640px] text-center text-text-muted">
            हम live दिखाएँगे कि एक lead आने के बाद उसकी information automatically save कैसे होती
            है, confirmation message कैसे जाता है और webinar reminder कैसे automate होता है।
          </p>
        </Reveal>
      </div>
    </section>
  );
}
