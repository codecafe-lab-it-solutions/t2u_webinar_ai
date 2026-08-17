import { WEBINAR_CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="section text-center">
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="bg-blob left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-brand-primary opacity-25" />
        <Reveal className="relative">
          <span className="kicker">Last Call</span>
          <h2 className="mx-auto mt-2 max-w-[720px] text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.25]">
            <span className="text-gradient">AI से पीछे मत रहिए</span> — AI को अपने लिए काम पर
            लगाइए!
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-text-muted">
            Limited seats के साथ इस practical live webinar में आज ही अपना registration confirm
            करें।
          </p>
          <a
            href="#register"
            className="btn-primary mt-7 inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-base font-bold"
          >
            🚀 Reserve My Seat Now
          </a>
          <p className="mt-4 text-sm text-text-faint">
            Registration में सहायता के लिए Call/WhatsApp:{" "}
            <a
              href={`https://wa.me/${WEBINAR_CONFIG.SUPPORT_PHONE_INTL.replace("+", "")}`}
              className="text-text-muted underline underline-offset-2 hover:text-brand-accent"
            >
              {WEBINAR_CONFIG.SUPPORT_PHONE}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
