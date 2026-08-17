import Reveal from "./Reveal";

const AUDIENCE = [
  "Students",
  "Working Professionals",
  "Business Owners",
  "Entrepreneurs",
  "Digital Marketers",
  "Freelancers",
  "Content Creators",
  "Coaches and Trainers",
  "Direct Selling Professionals",
  "Anyone interested in AI and online income",
];

export default function TargetAudience() {
  return (
    <section className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Who Is This For</span>
          <h2>यह Webinar किसके लिए है?</h2>
        </div>

        <Reveal>
          <div className="mx-auto flex max-w-[900px] flex-wrap justify-center gap-2.5">
            {AUDIENCE.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border-strong px-4 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-7 text-center">
          <a
            href="#register"
            className="btn-primary inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-bold"
          >
            Yes, This Webinar Is For Me
          </a>
        </Reveal>
      </div>
    </section>
  );
}
