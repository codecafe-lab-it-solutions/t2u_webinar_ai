import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Automation Webinar | T2Upgrade",
  description:
    "बिना Coding के AI Tools और Automation की मदद से अपना समय बचाएँ, Productivity बढ़ाएँ और Online Income के नए अवसर तैयार करें। Join our live AI Automation webinar.",
  icons: {
    icon: "/brand/T2U_Fav_icon.png",
    shortcut: "/brand/T2U_Fav_icon.png",
    apple: "/brand/T2U_Fav_icon.png",
  },
  openGraph: {
    title: "AI Automation Webinar | T2Upgrade",
    description: "AI सीखिए नहीं, AI से काम करवाना सीखिए! Live webinar — reserve your seat.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${plusJakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
