import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import LearningOutcomes from "@/components/LearningOutcomes";
import LiveDemoFlow from "@/components/LiveDemoFlow";
import IntroVideo from "@/components/IntroVideo";
import TargetAudience from "@/components/TargetAudience";
import Trainer from "@/components/Trainer";
import Testimonials from "@/components/Testimonials";
import Bonuses from "@/components/Bonuses";
import WhatsAppCallout from "@/components/WhatsAppCallout";
import RegistrationForm from "@/components/RegistrationForm";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <ProblemSection />
        <LearningOutcomes />
        <LiveDemoFlow />
        <IntroVideo />
        <TargetAudience />
        <Trainer />
        <Testimonials />
        <Bonuses />
        <WhatsAppCallout />
        <RegistrationForm />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
