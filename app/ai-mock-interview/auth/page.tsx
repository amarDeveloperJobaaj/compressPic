import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { AuthCard } from "@/features/ai-interview/components/auth/AuthCard";

/** Auth page — never indexed (06-seo.md). */
export const metadata: Metadata = {
  title: { absolute: "Sign in — AI Mock Interview · Vizo Tool" },
  robots: { index: false, follow: false },
};

export default function AiMockInterviewAuthPage() {
  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "AI Mock Interview", href: "/ai-mock-interview" },
          { label: "Sign in" },
        ]}
      />
      <AuthCard />
    </PageTransition>
  );
}
