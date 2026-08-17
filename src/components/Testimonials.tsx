import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "इस session के बाद मुझे समझ आया कि AI का इस्तेमाल केवल content लिखने के लिए नहीं, बल्कि पूरे business workflow को automate करने के लिए किया जा सकता है।",
    name: "Rahul Sharma",
    role: "Business Owner, Jaipur",
  },
  {
    quote:
      "बिना coding के मैंने अपना पहला automation workflow बना लिया। अब leads का follow-up automatically हो जाता है।",
    name: "Priya Verma",
    role: "Digital Marketer, Indore",
  },
  {
    quote:
      "Freelancing में content और client communication दोनों में समय बच रहा है। Practical demo बहुत काम आया।",
    name: "Ankit Joshi",
    role: "Freelancer, Pune",
  },
  {
    quote:
      "Working professional होने के कारण समय कम मिलता था, इस webinar ने सीधा roadmap दे दिया।",
    name: "Neha Gupta",
    role: "Working Professional, Delhi",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Success Stories</span>
          <h2>हमारे Attendees क्या कहते हैं</h2>
        </div>

        <Reveal>
          <div className="testi-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="glow-card relative w-[86%] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card p-6 sm:w-75"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-accent to-brand-primary" />
                <Quote size={28} strokeWidth={2} className="text-brand-accent/35" fill="currentColor" />
                <div className="mt-2.5 flex gap-0.5 text-gradient-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} strokeWidth={0} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-2.5 text-[15px] leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-text-faint">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
