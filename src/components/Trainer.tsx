import Image from "next/image";
import { Award } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

const STATS = [
  { num: "1000+", label: "Students Trained" },
  { num: "5+", label: "Years Experience" },
  { num: "10+", label: "AI Workflows Built" },
];

const CO_INSTRUCTOR_HIGHLIGHTS = [
  "IT Product Manager, AI-powered automation",
  "Digital transformation specialist",
  "AI, IoT & ERP solutions",
];

export default function Trainer() {
  return (
    <section id="speaker" className="section relative overflow-hidden">
      <div className="bg-blob left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-brand-primary opacity-10" />
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Meet Your Trainer</span>
          <h2>अपने Trainer से मिलिए</h2>
        </div>

        <Reveal>
          <div className="mx-auto grid max-w-[900px] items-center gap-7 rounded-2xl border border-border-strong bg-card p-8 sm:grid-cols-[auto_1fr] sm:p-9">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-brand-primary/15">
              <Image
                src="/brand/founder-square.jpg"
                alt={WEBINAR_CONFIG.TRAINER_NAME}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">{WEBINAR_CONFIG.TRAINER_NAME}</h3>
              <p className="mt-0.5 text-sm font-semibold text-brand-accent">
                Founder – {WEBINAR_CONFIG.BRAND_NAME}
              </p>
              <p className="mt-4 text-[15px] text-text-muted">
                Kishan Khatri एक entrepreneur और skill-development trainer हैं। उनका उद्देश्य
                students, professionals और business owners को practical digital skills, AI tools
                और automation के माध्यम से आगे बढ़ने में मदद करना है।
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-border bg-surface px-4 py-2.5"
                  >
                    <div className="font-mono text-xl font-extrabold text-gradient-end">
                      {s.num}
                    </div>
                    <div className="text-xs text-text-faint">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-center text-lg font-bold sm:text-xl">
            Led by an industry practitioner
          </p>
          <div className="mx-auto mt-6 grid max-w-[900px] items-center gap-7 rounded-2xl border border-border-strong bg-card p-8 sm:grid-cols-[auto_1fr] sm:p-9">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-brand-primary/15">
              <Image
                src="/brand/instructor.png"
                alt="Gaurav Saini"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">Gaurav Saini</h3>
              <p className="mt-0.5 text-sm font-semibold text-brand-accent">
                Operations &amp; Product Roadmap Specialist, CodeCafeLabs
              </p>
              <p className="mt-4 text-[15px] text-text-muted">
                Gaurav Saini is an IT Product Manager specializing in AI-powered automation and
                digital transformation, helping businesses streamline operations, build
                intelligent workflows, and scale efficiently through AI, IoT, and ERP solutions.
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {CO_INSTRUCTOR_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                    <Award size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
