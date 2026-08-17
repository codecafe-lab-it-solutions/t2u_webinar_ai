"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

const BASE_FAQS = [
  { q: "क्या coding knowledge जरूरी है?", a: "नहीं। यह webinar beginners के लिए बनाया गया है।" },
  { q: "Webinar किस language में होगा?", a: "Webinar Hindi और easy English में होगा।" },
  { q: "क्या webinar live होगा?", a: "हाँ, session live होगा और practical demonstration भी दिया जाएगा।" },
  {
    q: "क्या recording मिलेगी?",
    a: "अगर recording उपलब्ध कराने का निर्णय होगा, तो registered participants को webinar के बाद भेज दी जाएगी।",
  },
  {
    q: "Webinar link कहाँ मिलेगा?",
    a: "Registration के बाद WhatsApp और email पर webinar details भेजी जाएँगी।",
  },
];

const PAID_FAQS = [
  { q: "Payment सुरक्षित है?", a: "हाँ, online payment Razorpay secure checkout के माध्यम से process होगा।" },
  {
    q: "यदि payment deduct हो जाए लेकिन registration confirm न हो तो?",
    a: `Payment ID और registered number के साथ support team से संपर्क करें: ${WEBINAR_CONFIG.SUPPORT_PHONE}`,
  },
];

const FAQS = WEBINAR_CONFIG.WEBINAR_MODE === "PAID" ? [...BASE_FAQS, ...PAID_FAQS] : BASE_FAQS;

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <Reveal className="mx-auto flex max-w-[760px] flex-col gap-2.5">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-lg border bg-card transition-colors duration-200 ${
                  isOpen ? "border-brand-accent/40" : "border-border"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4.5 text-left text-[15px] font-bold transition-colors hover:text-brand-accent"
                >
                  {item.q}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "rotate-45 border-brand-accent/40 bg-brand-accent/10 text-brand-accent"
                        : "border-border-strong text-text-faint"
                    }`}
                  >
                    <Plus size={15} strokeWidth={2} />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-200"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4.5 text-[15px] text-text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
