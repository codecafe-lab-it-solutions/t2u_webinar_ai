import { Users, MonitorPlay, Sparkles, Languages, MessagesSquare } from "lucide-react";
import Reveal from "./Reveal";
import IconBadge from "./IconBadge";

const TRUST_ITEMS = [
  { icon: Users, label: "1000+ Learners Trained" },
  { icon: MonitorPlay, label: "Practical Live Demonstration" },
  { icon: Sparkles, label: "Beginner-Friendly Training" },
  { icon: Languages, label: "Hindi + English Session" },
  { icon: MessagesSquare, label: "Live Q&A Support" },
];

export default function TrustBar() {
  return (
    <div className="border-y border-border bg-surface/40 py-7">
      <Reveal>
        <ul className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-3 px-5">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 text-sm font-semibold text-text-muted"
            >
              <IconBadge icon={Icon} tone="success" size="sm" />
              {label}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
