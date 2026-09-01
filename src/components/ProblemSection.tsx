import Image from "next/image";
import { XCircle } from "lucide-react";
import Reveal from "./Reveal";
import IconBadge from "./IconBadge";

const PROBLEMS = [
  "हर दिन repetitive कामों में कई घंटे बर्बाद हो जाते हैं",
  "Leads आती हैं, लेकिन proper follow-up नहीं हो पाता",
  "AI Tools के बारे में सुना है, लेकिन इस्तेमाल करना नहीं आता",
  "Online income शुरू करना चाहते हैं, लेकिन roadmap नहीं है",
];

export default function ProblemSection() {
  return (
    <section className="section relative overflow-hidden">
      <div className="bg-blob -left-24 top-10 h-72 w-72 bg-error opacity-10" />
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Sound Familiar?</span>
          <h2>क्या आप भी इन समस्याओं का सामना कर रहे हैं?</h2>
        </div>

        <Reveal>
          <div className="relative mx-auto mb-10 aspect-video max-w-[980px] overflow-hidden rounded-2xl border border-border-strong">
            <Image
              src="/webinar/image1.jpg"
              alt="Before automation: an overwhelmed professional buried in manual tasks. After AI automation: the same work handled by CRM sync, automated follow-ups, and smart reporting."
              fill
              sizes="(max-width: 980px) 100vw, 980px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-2">
          {PROBLEMS.map((problem, i) => (
            <Reveal key={problem} delay={i * 0.05}>
              <div className="glow-card flex h-full items-start gap-3.5 rounded-lg border border-border bg-card p-5">
                <IconBadge icon={XCircle} tone="error" size="sm" />
                <p className="pt-1">{problem}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="relative mx-auto mt-9 max-w-[720px] rounded-xl border border-brand-primary/30 bg-brand-primary/10 p-6 text-center text-[1.05em] font-medium">
            इस Live Webinar में आपको AI और Automation का practical roadmap मिलेगा — बिना coding
            और बिना technical background के।
          </p>
        </Reveal>
      </div>
    </section>
  );
}
