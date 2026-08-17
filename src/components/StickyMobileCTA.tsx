"use client";

import { useEffect, useState } from "react";
import { WEBINAR_CONFIG } from "@/lib/config";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const isPaid = WEBINAR_CONFIG.WEBINAR_MODE === "PAID";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-border bg-ground/92 px-3.5 py-2.5 backdrop-blur-md md:hidden">
      <span className="shrink-0 font-mono text-sm font-extrabold text-gradient-end">
        {isPaid ? `₹${WEBINAR_CONFIG.WEBINAR_PRICE}` : "FREE"}
      </span>
      <a
        href="#register"
        className="btn-primary flex flex-1 items-center justify-center rounded-md px-4 py-3 text-sm font-bold"
      >
        अभी रजिस्टर करें
      </a>
    </div>
  );
}
