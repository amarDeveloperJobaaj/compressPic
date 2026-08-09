"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Bot, Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Capsule } from "@/components/ui/capsule";
import { Progress } from "@/components/ui/progress";
import { stepOneSchema, stepThreeSchema, stepTwoSchema } from "@/features/ai-interview/schemas/interview";
import {
  SETUP_STEPS,
  TOTAL_STEPS,
  useInterviewStore,
} from "@/features/ai-interview/store/interview-store";
import { CompanyLevelStep } from "./setup/CompanyLevelStep";
import { RoleDomainStep } from "./setup/RoleDomainStep";
import { TypeDurationStep } from "./setup/TypeDurationStep";

/** Setup wizard — the canonical interview configuration flow (spec §9–11). */
export function InterviewSetup() {
  const step = useInterviewStore((s) => s.step);
  const nextStep = useInterviewStore((s) => s.nextStep);
  const prevStep = useInterviewStore((s) => s.prevStep);

  const fields = useInterviewStore(
    useShallow((s) => ({
      roleId: s.roleId,
      domainId: s.domainId,
      companyId: s.companyId,
      customCompany: s.customCompany,
      experienceLevelId: s.experienceLevelId,
      interviewTypeId: s.interviewTypeId,
      durationMinutes: s.durationMinutes,
    }))
  );

  /** Live step validation — the wizard never advances on an invalid step. */
  const stepError = useMemo<string | null>(() => {
    if (step === 0) {
      const result = stepOneSchema.safeParse(fields);
      return result.success ? null : (result.error.issues[0]?.message ?? null);
    }
    if (step === 1) {
      const result = stepTwoSchema.safeParse(fields);
      return result.success ? null : (result.error.issues[0]?.message ?? null);
    }
    const result = stepThreeSchema.safeParse(fields);
    return result.success ? null : (result.error.issues[0]?.message ?? null);
  }, [step, fields]);

  const isLast = step === TOTAL_STEPS - 1;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (!stepError) nextStep();
  };

  return (
    <section className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <Capsule variant="primary" dot className="mb-4">
            Interview Setup
          </Capsule>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Set up your mock interview
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">
            Pick your role, company, and preferences — then meet your AI interviewer.
          </p>
        </div>

        {/* Wizard card */}
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-primary/5 sm:p-8">
          {/* Step label + progress */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-text-primary">
              Step {step + 1} of {TOTAL_STEPS}
              <span className="ml-2 font-normal text-text-muted">{SETUP_STEPS[step]}</span>
            </p>
            <p className="text-xs text-text-muted">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="mt-3" />

          {/* Step content */}
          <div className="mt-8">
            {step === 0 && <RoleDomainStep />}
            {step === 1 && <CompanyLevelStep />}
            {step === 2 && <TypeDurationStep />}
          </div>

          {stepError && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm text-error"
            >
              {stepError}
            </p>
          )}

          {/* Footer nav */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
            <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {isLast ? (
              stepError ? (
                <Button disabled>
                  <Sparkles className="h-4 w-4" />
                  Start Interview
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/ai-mock-interview/room">
                    <Bot className="h-4 w-4" />
                    Start Interview
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )
            ) : (
              <Button size="lg" onClick={handleNext}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
