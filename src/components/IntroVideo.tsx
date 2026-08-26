"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import Reveal from "./Reveal";

export default function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(WEBINAR_CONFIG.INTRO_VIDEO_YOUTUBE_ID);

  const handlePlay = () => {
    trackEvent("video_play", { video: "intro" });
    setPlaying(true);
  };

  return (
    <section className="section">
      <div className="container mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Why This Webinar</span>
          <h2>यह Webinar आपके लिए क्यों महत्वपूर्ण है?</h2>
        </div>

        <Reveal>
          <div className="relative mx-auto flex aspect-video max-w-[820px] items-center justify-center overflow-hidden rounded-2xl border border-border-strong shadow-[0_30px_70px_-30px_rgba(124,58,237,0.45)]">
            {!(playing && hasVideo) && (
              <>
                <Image
                  src="/webinar/image4.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 820px) 100vw, 820px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/70 to-brand-accent/55" />
              </>
            )}
            {playing && hasVideo ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${WEBINAR_CONFIG.INTRO_VIDEO_YOUTUBE_ID}?autoplay=1`}
                title="Webinar Introduction"
                allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : playing && !hasVideo ? (
              <p className="max-w-xs px-6 text-center text-sm text-text-muted">
                वीडियो जल्द जोड़ा जाएगा — YouTube (unlisted) ID को <code>INTRO_VIDEO_YOUTUBE_ID</code>{" "}
                में सेट करें।
              </p>
            ) : (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play introduction video"
                className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/25"
              >
                <span className="absolute inset-0 rounded-full border border-white/30 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100" />
                <Play size={28} strokeWidth={2} fill="currentColor" className="relative ml-1" />
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
