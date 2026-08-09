import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { PageTransition } from "@/components/shared/PageTransition";
import { AI_INTERVIEW_FAQS } from "@/features/ai-interview/data/faqs";
import { HeroSection } from "@/features/ai-interview/components/landing/HeroSection";
import { SkillsMarquee } from "@/features/ai-interview/components/landing/SkillsMarquee";
import { HowItWorksSection } from "@/features/ai-interview/components/landing/HowItWorksSection";
import { RolesSection } from "@/features/ai-interview/components/landing/RolesSection";
import { FeaturesSection } from "@/features/ai-interview/components/landing/FeaturesSection";
import { ReportSection } from "@/features/ai-interview/components/landing/ReportSection";
import { FinalCtaSection } from "@/features/ai-interview/components/landing/FinalCtaSection";
import { buildMetadata, softwareApplicationSchema } from "@/lib/seo";

/** Title ≤60 chars, brandless, primary keyword first (06-seo.md map). */
const LANDING_TITLE = "AI Interview — Mock Interview Practice with AI (Free)";
const LANDING_DESCRIPTION =
  "Practice AI mock interviews with a real-time AI interviewer. Get scored feedback, a weaknesses report, and personalized questions for your role. Free.";

export const metadata: Metadata = {
  ...buildMetadata({
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    path: "/ai-mock-interview",
    keywords: [
      "ai mock interview",
      "ai interview practice",
      "free ai interview practice",
      "mock interview online",
      "interview practice ai",
      "ai interview coach",
      "interview questions and answers",
      "behavioral interview questions",
      "tell me about yourself answer",
      "coding interview",
    ],
  }),
  // Brandless title: keep exactly LANDING_TITLE, bypass the "%s | Vizo Tool" template.
  title: { absolute: LANDING_TITLE },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function AiMockInterviewLandingPage() {
  return (
    <PageTransition>
      <JsonLd
        data={softwareApplicationSchema({
          name: "Vizo Tool AI Mock Interview",
          description: LANDING_DESCRIPTION,
          url: "/ai-mock-interview",
        })}
      />
      <HeroSection />
      <SkillsMarquee />
      <HowItWorksSection />
      <RolesSection />
      <FeaturesSection />
      <ReportSection />
      <FaqSection faqs={AI_INTERVIEW_FAQS} />
      <FinalCtaSection />
    </PageTransition>
  );
}
