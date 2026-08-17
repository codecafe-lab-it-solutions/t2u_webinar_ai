import { Camera, Briefcase, PlaySquare } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border px-5 pb-24 pt-11 md:pb-11">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-7 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo height={32} />
            <p className="mt-3 max-w-[36ch] text-sm text-text-muted">
              Practical AI, automation और digital skills training — बिना coding के, beginners के
              लिए।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-text-faint">
              Contact
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <a href={`tel:${WEBINAR_CONFIG.SUPPORT_PHONE_INTL}`}>{WEBINAR_CONFIG.SUPPORT_PHONE}</a>
              </li>
              <li>
                <a href={`mailto:${WEBINAR_CONFIG.SUPPORT_EMAIL}`}>{WEBINAR_CONFIG.SUPPORT_EMAIL}</a>
              </li>
              <li>
                <a href={WEBINAR_CONFIG.WEBSITE} target="_blank" rel="noopener noreferrer">
                  t2upgrade.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-text-faint">
              Legal
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms and Conditions</a>
              </li>
              <li>
                <a href="/refund-policy">Refund Policy</a>
              </li>
              <li>
                <a href="/disclaimer">Disclaimer</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-text-faint">
          <span>
            &copy; {new Date().getFullYear()} {WEBINAR_CONFIG.BRAND_NAME}. All rights reserved.
          </span>
          <div className="flex gap-2.5">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-sm border border-border-strong p-1.5"
            >
              <Camera size={14} strokeWidth={2} />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-sm border border-border-strong p-1.5">
              <Briefcase size={14} strokeWidth={2} />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-sm border border-border-strong p-1.5">
              <PlaySquare size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
