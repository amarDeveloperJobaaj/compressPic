import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { InterviewHistory } from "@/features/ai-interview/components/history/InterviewHistory";

/** History page — never indexed (06-seo.md: session UI is not indexable). */
export const metadata: Metadata = {
  title: { absolute: "Interview History — AI Mock Interview · Vizo Tool" },
  robots: { index: false, follow: false },
};

export default function AiMockInterviewHistoryPage() {
  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "AI Mock Interview", href: "/ai-mock-interview" },
          { label: "History" },
        ]}
      />
      <InterviewHistory />
    </PageTransition>
  );
}
