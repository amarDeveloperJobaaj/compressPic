import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { InterviewRoom } from "@/features/ai-interview/components/room/InterviewRoom";

/** Room page — never indexed (06-seo.md: session UI is not indexable). */
export const metadata: Metadata = {
  title: { absolute: "Interview Room — AI Mock Interview · Vizo Tool" },
  robots: { index: false, follow: false },
};

export default function AiMockInterviewRoomPage() {
  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "AI Mock Interview", href: "/ai-mock-interview" },
          { label: "Interview Room" },
        ]}
      />
      <InterviewRoom />
    </PageTransition>
  );
}
