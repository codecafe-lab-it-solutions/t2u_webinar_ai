"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import CountdownTimer from "./CountdownTimer";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#agenda", label: "Agenda" },
  { href: "#demo", label: "Live Demo" },
  { href: "#speaker", label: "Speaker" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Threshold must clear the sticky header before it pins to the
    // viewport top (it starts sticking once scrollY exceeds the
    // announcement bar's height, ~42px) — otherwise there's a window
    // where the header is pinned at y=0 but still rendered transparent,
    // letting whatever's behind it (announcement bar, during scroll-
    // restore repaint, etc.) show through instead of the hero backdrop.
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex h-20 items-center border-b backdrop-blur-md transition-colors duration-300 ${
          scrolled ? "border-border bg-ground/85" : "border-transparent bg-ground/35"
        }`}
      >
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5">
          <a href="#top" className="flex items-center">
            <Logo height={42} />
          </a>

          <nav className="hidden items-center justify-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.09em] text-text-muted transition-colors hover:text-brand-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            {scrolled && (
              <span className="hidden items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-warning sm:inline-flex">
                <Zap size={12} strokeWidth={2} />
                <CountdownTimer compact />
              </span>
            )}
            <a
              href="#register"
              className="btn-primary hidden rounded-md px-5 py-3 text-sm font-bold sm:inline-flex"
            >
              Reserve My Seat
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="inline-flex rounded-md border border-border-strong p-2 text-text md:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ground/98 p-5 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between">
            <Logo height={34} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex rounded-md border border-border-strong p-2 text-text"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl font-bold"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-4 inline-flex justify-center rounded-md px-5 py-3.5 text-base font-bold"
            >
              Reserve My Seat
            </a>
            <a
              href={WEBINAR_CONFIG.WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm text-text-muted underline"
            >
              WhatsApp Community Join करें
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
