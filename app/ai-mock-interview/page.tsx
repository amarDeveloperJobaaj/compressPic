import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { PageTransition } from "@/components/shared/PageTransition";
import { AI_INTERVIEW_FAQS } from "@/features/ai-interview/data/faqs";
import { ScrollProgress } from "@/features/ai-interview/components/motion/ScrollProgress";
import { InterviewHero } from "@/features/ai-interview/components/interview/InterviewHero";
import { TrustBar } from "@/features/ai-interview/components/interview/TrustBar";
import { HowItWorks } from "@/features/ai-interview/components/interview/HowItWorks";
import { InterviewPreview } from "@/features/ai-interview/components/interview/InterviewPreview";
import { FeatureGrid } from "@/features/ai-interview/components/interview/FeatureGrid";
import { AdaptiveFlow } from "@/features/ai-interview/components/interview/AdaptiveFlow";
import { CompanyShowcase } from "@/features/ai-interview/components/interview/CompanyShowcase";
import { RoleShowcase } from "@/features/ai-interview/components/interview/RoleShowcase";
import { ReportPreview } from "@/features/ai-interview/components/interview/ReportPreview";
import { WhyCandidates } from "@/features/ai-interview/components/interview/WhyCandidates";
import { PricingPreview } from "@/features/ai-interview/components/interview/PricingPreview";
import { InterviewCta } from "@/features/ai-interview/components/interview/InterviewCta";
import {
  breadcrumbListSchema,
  buildMetadata,
  softwareApplicationSchema,
} from "@/lib/seo";

/** Optimized title per premium landing spec §33 (keyword-first, ≤60 chars). */
const LANDING_TITLE = "AI Mock Interview – Practice Technical & HR Interviews";
const LANDING_DESCRIPTION =
  "Practice realistic AI mock interviews tailored to your resume, role, and target company. Technical, HR, behavioral, and coding interviews with instant AI feedback and a detailed score report. Free.";

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
      "technical interview practice",
      "hr interview practice",
      "behavioral interview questions",
      "coding interview",
      "company interview practice",
      "resume based interview questions",
    ],
  }),
  // Keyword-first title, brandless per 06-seo.md — bypass the "%s | Vizo Tool" template.
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
      <ScrollProgress />
      <JsonLd
        data={softwareApplicationSchema({
          name: "Vizo Tool AI Mock Interview",
          description: LANDING_DESCRIPTION,
          url: "/ai-mock-interview",
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "AI Mock Interview", url: "/ai-mock-interview" },
        ])}
      />
      <InterviewHero />
      <TrustBar />
      <HowItWorks />
      <InterviewPreview />
      <FeatureGrid />
      <AdaptiveFlow />
      <CompanyShowcase />
      <RoleShowcase />
      <ReportPreview />
      <WhyCandidates />
      <PricingPreview />
      <FaqSection faqs={AI_INTERVIEW_FAQS} />
      <InterviewCta />
    </PageTransition>
  );
}
