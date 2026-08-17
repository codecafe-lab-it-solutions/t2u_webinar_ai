"use client";

import { useEffect, useState } from "react";
import { WEBINAR_CONFIG } from "@/lib/config";

function getTimeLeft() {
  const diff = new Date(WEBINAR_CONFIG.WEBINAR_DATE_ISO).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    done: diff <= 0,
  };
}

export default function CountdownTimer({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    // Deliberately client-only: Date.now() must not run during SSR, or the
    // server-rendered digits would mismatch the client on hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  if (time.done) {
    return (
      <div className={`font-mono text-sm font-bold text-gradient-end ${className}`}>
        हम लाइव हैं!
      </div>
    );
  }

  const units: [string, number][] = compact
    ? [
        ["D", time.days],
        ["H", time.hours],
        ["M", time.minutes],
      ]
    : [
        ["Days", time.days],
        ["Hours", time.hours],
        ["Min", time.minutes],
        ["Sec", time.seconds],
      ];

  if (compact) {
    return (
      <span className={`font-mono text-xs font-bold tracking-tight ${className}`}>
        Starts in {time.days}d {time.hours}h {time.minutes}m
      </span>
    );
  }

  return (
    <div className={`flex justify-center gap-2.5 ${className}`}>
      {units.map(([label, value]) => (
        <div
          key={label}
          className="min-w-14 rounded-md border border-border bg-surface px-2 py-2.5 text-center"
        >
          <div className="font-mono text-xl font-extrabold text-gradient-end tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-text-faint">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
