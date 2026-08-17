import Image from "next/image";

// Trimmed from the source /brand/logo.png, which ships with a lot of
// transparent padding around the mark — the raw aspect ratio would render
// the wordmark illegibly small at header/footer heights.
const ASPECT_RATIO = 678 / 169;

export default function Logo({ height = 40, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/brand/logo-trimmed.png"
      alt="T2Upgrade — Time to Upgrade"
      width={Math.round(height * ASPECT_RATIO)}
      height={height}
      priority
      className={className}
    />
  );
}
