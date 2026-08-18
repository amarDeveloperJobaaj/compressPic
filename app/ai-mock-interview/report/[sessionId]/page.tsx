import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Braces,
  CheckCircle2,
  ChevronRight,
  MessageSquareText,
  Mic2,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { getCurrentUser } from "@/features/ai-interview/services/interview/auth";
import {
  generateSessionReport,
  getSessionReport,
  ReportEngineError,
} from "@/features/ai-interview/services/interview/report-engine";
import type { StoredEvaluation } from "@/features/ai-interview/services/interview/evaluation-store";
import { listEvaluationsForSession } from "@/features/ai-interview/services/interview/evaluation-store";
import type { InterviewReport } from "@/features/ai-interview/schemas/report";

/** Report page — never indexed (06-seo.md: session UI is not indexable). */
export const metadata: Metadata = {
  title: { absolute: "Interview Report — AI Mock Interview · Vizo Tool" },
  robots: { index: false, follow: false },
};

const CATEGORY_META: { key: keyof InterviewReport["scores"]; label: string; color: string }[] = [
  { key: "technical", label: "Technical", color: "#38bdf8" },
  { key: "problemSolving", label: "Problem Solving", color: "#818cf8" },
  { key: "project", label: "Project Knowledge", color: "#34d399" },
  { key: "communication", label: "Communication", color: "#fbbf24" },
  { key: "behavioral", label: "Behavioral", color: "#f472b6" },
];

function ScoreRing({ score }: { score: number }) {
  const rounded = Math.round(score);
  return (
    <div
      className="relative flex h-36 w-36 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#38bdf8 ${rounded * 3.6}deg, rgba(148,163,184,0.2) 0deg)`,
      }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-surface">
        <span className="text-4xl font-bold text-text-primary">{rounded}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">/ 100</span>
      </div>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-0.5 text-base font-bold text-text-primary">{value.toFixed(1)}</p>
    </div>
  );
}

/** Parse the coding problem JSON stored in the question text (Phase 13). */
function parseCodingProblem(raw: string): { statement: string } | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.statement === "string") return parsed;
  } catch {
    // not JSON — fall through
  }
  return null;
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function InterviewReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const auth = await getCurrentUser();

  let report: InterviewReport | null = null;
  let error: string | null = null;
  // Phase 13 — coding interview solutions (rendered deterministically, never
  // via the AI report): problem + submitted code + per-dimension scores.
  let codingSolutions: StoredEvaluation[] = [];

  if (auth.ok) {
    try {
      // Generate if missing (idempotent), else serve the stored report.
      const existing = await getSessionReport(auth.userId, sessionId);
      report = existing
        ? existing.report
        : (await generateSessionReport(auth.userId, sessionId)).report;

      const evaluations = await listEvaluationsForSession(auth.userId, sessionId);
      codingSolutions = evaluations.filter(
        (e) => e.questionType.toLowerCase() === "coding"
      );
    } catch (e) {
      if (e instanceof ReportEngineError && e.kind === "invalid_state") {
        error = e.message;
      } else {
        error = e instanceof Error ? e.message : "Failed to load the report.";
      }
    }
  }

  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "AI Mock Interview", href: "/ai-mock-interview" },
          { label: "Report" },
        ]}
      />

      <div className="container-page py-10">
        {!auth.ok ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
            <Award className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-2xl font-bold text-text-primary">Sign in to view your report</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Your interview report is tied to your account.
            </p>
            <Link
              href="/ai-mock-interview/auth"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign in <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-amber-400/40 bg-amber-400/10 p-8 text-center">
            <XCircle className="mx-auto h-10 w-10 text-amber-500" />
            <h1 className="mt-4 text-xl font-bold text-text-primary">Report not ready</h1>
            <p className="mt-2 text-sm text-text-secondary">{error}</p>
            <Link
              href="/ai-mock-interview"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to AI Mock Interview
            </Link>
          </div>
        ) : report ? (
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header + score ring */}
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:p-8">
              <ScoreRing score={report.scores.overall} />
              <div className="text-center sm:text-left">
                <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted sm:justify-start">
                  <Award className="h-3.5 w-3.5 text-primary" /> Final Report
                </p>
                <h1 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
                  {report.scores.overall >= 75
                    ? "Great performance — keep pushing!"
                    : report.scores.overall >= 55
                      ? "Solid foundation — refine the gaps."
                      : "Good start — focus on the plan below."}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Category scores */}
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title="Category scores">
              <div className="grid gap-4 sm:grid-cols-2">
                {CATEGORY_META.map(({ key, label, color }) => (
                  <div key={key} className="rounded-xl border border-border bg-surface/60 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-text-primary">{label}</span>
                      <span className="font-bold text-text-primary">{Math.round(report.scores[key])}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, report.scores[key])}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Strengths / Weaknesses */}
            <div className="grid gap-6 md:grid-cols-2">
              <SectionCard icon={<CheckCircle2 className="h-5 w-5" />} title="What you did well">
                <ul className="space-y-2.5">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                  {report.strengths.length === 0 && (
                    <li className="text-sm text-text-muted">No strengths recorded yet.</li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard icon={<XCircle className="h-5 w-5" />} title="What to improve">
                <ul className="space-y-2.5">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text-secondary">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      {w}
                    </li>
                  ))}
                  {report.weaknesses.length === 0 && (
                    <li className="text-sm text-text-muted">No major gaps recorded.</li>
                  )}
                </ul>
              </SectionCard>
            </div>

            {/* Improvement plan */}
            {report.improvementPlan.length > 0 && (
              <SectionCard icon={<Target className="h-5 w-5" />} title="Improvement plan">
                <ol className="space-y-4">
                  {report.improvementPlan.map((item) => (
                    <li key={item.priority} className="flex gap-3 rounded-xl border border-border bg-surface/60 p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {item.priority}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary">{item.area}</p>
                        <p className="mt-1 text-xs text-text-muted">Why: {item.why}</p>
                        <p className="mt-1 text-xs text-text-secondary">Practice: {item.practice}</p>
                        <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Goal: {item.goal}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionCard>
            )}

            {/* Communication metrics */}
            <SectionCard icon={<Mic2 className="h-5 w-5" />} title="Communication analysis">
              <p className="text-sm text-text-secondary">{report.communication.summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-surface/60 p-3 text-center">
                  <p className="text-xl font-bold text-text-primary">
                    {report.communication.averageWordsPerMinute ?? "—"}
                  </p>
                  <p className="text-xs text-text-muted">Avg WPM</p>
                </div>
                <div className="rounded-xl border border-border bg-surface/60 p-3 text-center">
                  <p className="text-xl font-bold text-text-primary">
                    {Math.round(report.communication.averageFillerCount * 10) / 10}
                  </p>
                  <p className="text-xs text-text-muted">Fillers / answer</p>
                </div>
                <div className="rounded-xl border border-border bg-surface/60 p-3 text-center">
                  <p className="text-xl font-bold text-text-primary">{report.communication.totalFillers}</p>
                  <p className="text-xs text-text-muted">Total fillers</p>
                </div>
                <div className="rounded-xl border border-border bg-surface/60 p-3 text-center">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {report.communication.mostFrequentFillers.join(", ") || "—"}
                  </p>
                  <p className="text-xs text-text-muted">Most frequent</p>
                </div>
              </div>
            </SectionCard>

            {/* Phase 13 — coding solutions (deterministic, from evaluations) */}
            {codingSolutions.length > 0 && (
              <SectionCard icon={<Braces className="h-5 w-5" />} title="Your coding solutions">
                <p className="text-sm text-text-secondary">
                  Submitted code with the per-dimension scores from your coding interview.
                </p>
                <div className="mt-4 space-y-5">
                  {codingSolutions.map((e) => {
                    const problem = parseCodingProblem(e.question);
                    return (
                      <div key={e.id} className="overflow-hidden rounded-xl border border-border bg-surface/60">
                        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                              {e.topic ?? "Coding problem"}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {problem?.statement ?? e.question}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            {e.overall.toFixed(1)}/10
                          </span>
                        </div>

                        <div className="grid gap-3 px-4 py-3 sm:grid-cols-3">
                          <ScoreChip label="Accuracy" value={e.scores.technicalAccuracy} />
                          <ScoreChip label="Completeness" value={e.scores.completeness} />
                          <ScoreChip label="Depth" value={e.scores.depth} />
                          <ScoreChip label="Clarity" value={e.scores.clarity} />
                          <ScoreChip label="Structure" value={e.scores.structure} />
                          <ScoreChip label="Relevance" value={e.scores.relevance} />
                        </div>

                        <pre className="max-h-80 overflow-auto border-t border-border bg-[#0d1117] px-4 py-3 font-mono text-[12px] leading-5 text-sky-100">
                          {e.answer || "(no code submitted)"}
                        </pre>

                        {(e.strengths.length > 0 || e.weaknesses.length > 0) && (
                          <div className="border-t border-border px-4 py-3">
                            {e.strengths.length > 0 && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                <span className="font-semibold">Good:</span> {e.strengths.join(" · ")}
                              </p>
                            )}
                            {e.weaknesses.length > 0 && (
                              <p className="mt-1 text-xs text-rose-500">
                                <span className="font-semibold">Improve:</span> {e.weaknesses.join(" · ")}
                              </p>
                            )}
                            {e.improvement && (
                              <p className="mt-1 text-xs text-text-secondary">
                                <span className="font-semibold">Next step:</span> {e.improvement}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* Recommended topics */}
            {report.recommendedTopics.length > 0 && (
              <SectionCard icon={<BookOpen className="h-5 w-5" />} title="Recommended preparation">
                <div className="flex flex-wrap gap-2">
                  {report.recommendedTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-sm text-text-secondary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Per-question analysis */}
            {report.questionAnalysis.length > 0 && (
              <SectionCard
                icon={<MessageSquareText className="h-5 w-5" />}
                title={`Question analysis (${report.questionAnalysis.length})`}
              >
                <div className="space-y-4">
                  {report.questionAnalysis.map((q) => (
                    <div key={q.questionId} className="rounded-xl border border-border bg-surface/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-text-primary">{q.question}</p>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          {q.score.toFixed(1)}/10
                        </span>
                      </div>
                      {q.good.length > 0 && (
                        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="font-semibold">Good:</span> {q.good.join(" · ")}
                        </p>
                      )}
                      {q.missing.length > 0 && (
                        <p className="mt-1 text-xs text-rose-500">
                          <span className="font-semibold">Missing:</span> {q.missing.join(" · ")}
                        </p>
                      )}
                      {q.improve && (
                        <p className="mt-1 text-xs text-text-secondary">
                          <span className="font-semibold">Improve:</span> {q.improve}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Next interview */}
            {report.suggestedNextInterview && (
              <SectionCard icon={<TrendingUp className="h-5 w-5" />} title="Suggested next interview">
                <p className="text-sm text-text-secondary">{report.suggestedNextInterview}</p>
              </SectionCard>
            )}

            <div className="flex justify-center pb-4">
              <Link
                href="/ai-mock-interview"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Practice again <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
