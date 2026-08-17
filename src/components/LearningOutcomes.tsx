import Reveal from "./Reveal";

const OUTCOMES = [
  "AI Automation क्या है और यह कैसे काम करती है?",
  "ChatGPT और दूसरे AI tools का effective इस्तेमाल",
  "बिना coding के automation workflows बनाना",
  "Social media content को automate करना",
  "WhatsApp और Email follow-up automation",
  "Lead capture और lead nurturing system",
  "Forms, Google Sheets, CRM और AI को connect करना",
  "AI की मदद से productivity कई गुना बढ़ाना",
  "Business owners और freelancers के लिए useful AI workflows",
  "AI Automation skills से income के अवसर",
  "Real-time workflow demonstration",
  "Step-by-step learning roadmap",
];

export default function LearningOutcomes() {
  return (
    <section id="agenda" className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Agenda</span>
          <h2>इस Webinar में आप क्या सीखेंगे?</h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {OUTCOMES.map((item, i) => (
            <Reveal key={item} delay={(i % 4) * 0.06}>
              <div className="glow-card flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-accent to-brand-primary font-mono text-sm font-extrabold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-1.5">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
