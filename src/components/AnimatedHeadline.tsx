"use client";

import { motion, type Variants } from "framer-motion";

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

const container: Variants = {
  hidden: {},
  visible: (delayStart: number) => ({
    transition: { staggerChildren: 0.035, delayChildren: delayStart },
  }),
};

const charVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function AnimatedHeadline({
  lines,
  className,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  return (
    <h1 className={className}>
      {/* Screen readers get the clean, un-fragmented text; the split spans below are decorative. */}
      <span className="sr-only">{lines.join(" ")}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate="visible"
        variants={container}
        custom={delay}
      >
        {lines.map((line, li) => (
          <span key={li} className="text-gradient-animate block">
            {splitGraphemes(line).map((grapheme, gi) => (
              <motion.span key={gi} variants={charVariant} className="inline-block">
                {grapheme === " " ? " " : grapheme}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </h1>
  );
}
