import { MessageCircle } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import Reveal from "./Reveal";
import TrackedLink from "./TrackedLink";

export default function WhatsAppCallout() {
  return (
    <section className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <Reveal>
          <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-brand-primary/55 to-brand-accent/40 px-7 py-10 text-center">
            <div className="absolute inset-0 bg-ground/35 backdrop-blur-lg" />
            <div className="bg-blob -top-16 left-1/4 h-56 w-56 bg-white opacity-10" />
            <div className="relative">
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                <MessageCircle size={24} strokeWidth={2} className="relative" />
              </span>
              <h3 className="mt-4 text-2xl font-bold sm:text-[26px]">
                Join Our WhatsApp Community
              </h3>
              <p className="mx-auto mt-2.5 max-w-[52ch] text-white/85">
                Updates, reminders & networking के लिए हमारी WhatsApp community से जुड़ें — हर
                registrant के लिए खुला है।
              </p>
              <TrackedLink
                event="whatsapp_click"
                eventParams={{ location: "whatsapp_section" }}
                href={WEBINAR_CONFIG.WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-bold text-brand-primary shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Join WhatsApp Community
              </TrackedLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
