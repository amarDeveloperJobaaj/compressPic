import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { InterviewSetup } from "@/features/ai-interview/components/InterviewSetup";

/** Tool page — never indexed (06-seo.md). */
export const metadata: Metadata = {
  title: { absolute: "AI Mock Interview Setup — Vizo Tool" },
  robots: { index: false, follow: false },
};

export default function AiMockInterviewSetupPage() {
  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "AI Mock Interview", href: "/ai-mock-interview" },
          { label: "Setup" },
        ]}
      />
      <InterviewSetup />
    </PageTransition>
  );
}
