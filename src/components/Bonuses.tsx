import { FileText, MessagesSquare, ListChecks, Video, Award, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import StatusPill from "./StatusPill";
import IconBadge from "./IconBadge";

const BONUSES: { icon: LucideIcon; title: string; desc: string; tone: "accent" | "primary" }[] = [
  { icon: FileText, title: "AI Tools Starter Guide", desc: "PDF guide with beginner-friendly AI tool picks.", tone: "accent" },
  { icon: MessagesSquare, title: "Ready-to-Use ChatGPT Prompts", desc: "Copy-paste prompts for content and business tasks.", tone: "primary" },
  { icon: ListChecks, title: "AI Automation Workflow Checklist", desc: "Step-by-step checklist to build your first workflow.", tone: "accent" },
  { icon: Video, title: "Webinar Recording", desc: "यदि उपलब्ध हो, session के बाद access मिलेगा।", tone: "primary" },
  { icon: Award, title: "Certificate of Participation", desc: "यदि उपलब्ध हो, attendance के आधार पर।", tone: "accent" },
  { icon: Users, title: "Exclusive WhatsApp Community", desc: "Updates, reminders और networking के लिए access।", tone: "primary" },
];

export default function Bonuses() {
  return (
    <section className="section relative overflow-hidden">
      <div className="bg-blob -bottom-24 right-0 h-80 w-80 bg-brand-accent opacity-10" />
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Register Today And Get</span>
          <h2>Webinar Bonuses</h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {BONUSES.map(({ icon: Icon, title, desc, tone }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <div className="glow-card relative flex h-full flex-col rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <IconBadge icon={Icon} tone={tone} />
                  <StatusPill tone="success">Free</StatusPill>
                </div>
                <h3 className="mt-3.5 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-text-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
