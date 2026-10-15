import Reveal from "./Reveal";
import Image from "next/image";

const mark = (text: string) => <span className="text-sm font-semibold tracking-tight text-white">{text}</span>;

const SLIDES = [
  {
    id: "student",
    title: "College में हैं?",
    description:
      "Graduate होने से पहले ही practical AI automation skills सीखकर बाकी candidates से आगे निकलें।",
    image: "/brand/audience-student.jpg",
    imageAlt: "Students in a classroom watching an AI Automation webinar on the projector",
    overlay: mark("Student"),
    action: "Reserve My Seat",
    href: "#register",
  },
  {
    id: "digital-marketer",
    title: "Digital Marketing करते हैं?",
    description:
      "Content, ads reporting और client follow-up को AI से automate करके ज़्यादा campaigns संभालें।",
    image: "/brand/audience-digital-marketer.jpg",
    imageAlt: "A digital marketer attending an AI for Digital Marketing webinar on his laptop",
    overlay: mark("Digital Marketer"),
    action: "Reserve My Seat",
    href: "#register",
  },
  {
    id: "entrepreneur",
    title: "अपना startup चला रहे हैं?",
    description:
      "Content creation और customer outreach जैसे repetitive काम AI को सौंपकर business पर focus करें।",
    image: "/brand/audience-entrepreneur.jpg",
    imageAlt: "A content creator and entrepreneur watching an AI Tools for Content Creators webinar",
    overlay: mark("Entrepreneur"),
    action: "Reserve My Seat",
    href: "#register",
  },
  {
    id: "business-owner",
    title: "Business चलाते हैं?",
    description:
      "CRM, follow-up और reporting automate करके बिना नई hiring के अपनी team की output बढ़ाएँ।",
    image: "/brand/audience-business-owner.jpg",
    imageAlt: "Two business owners watching an AI in Business Adoption Strategies webinar",
    overlay: mark("Business Owner"),
    action: "Reserve My Seat",
    href: "#register",
  },
  {
    id: "working-professional",
    title: "Job करते हैं?",
    description: "रोज़ के manual tasks AI से automate करके अपने करियर के लिए extra समय निकालें।",
    image: "/brand/audience-working-professional.jpg",
    imageAlt: "A working professional couple watching an AI in Business Future Trends webinar",
    overlay: mark("Working Professional"),
    action: "Reserve My Seat",
    href: "#register",
  },
  {
    id: "freelancer",
    title: "Freelance करते हैं?",
    description: "Client communication और content delivery तेज़ करके एक साथ ज़्यादा projects संभालें।",
    image: "/brand/audience-freelancer.jpg",
    imageAlt: "A freelancer at his desk watching an AI for Creatives webinar",
    overlay: mark("Freelancer"),
    action: "Reserve My Seat",
    href: "#register",
  },
];

export default function TargetAudience() {
  return (
    <section id="audience" className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Who Is This For</span>
          <h2>यह Webinar किसके लिए है?</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SLIDES.map((slide, index) => (
            <Reveal key={slide.id} delay={index * 0.04}>
              <article className="glow-card flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-5 py-4">{slide.overlay}</div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold leading-relaxed text-foreground">{slide.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-text-muted">{slide.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
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
