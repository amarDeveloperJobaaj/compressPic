import { BarChart3, LineChart, TrendingUp } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Progress } from "@/components/ui/progress";
import { TiltCard } from "../motion/TiltCard";

/** Category scores preview — matches the report design (spec §58). */
const categoryScores = [
  { label: "Technical", score: 82 },
  { label: "Communication", score: 80 },
  { label: "Problem Solving", score: 79 },
  { label: "Project Knowledge", score: 88 },
  { label: "Behavioral", score: 72 },
];

/** Skill progress preview (spec §65). */
const skillScores = [
  { label: "React", score: 82 },
  { label: "Node.js", score: 76 },
  { label: "MongoDB", score: 61 },
  { label: "System Design", score: 54 },
  { label: "Communication", score: 72 },
];

/** Interview score trend preview (spec §64). */
const scoreTrend = [62, 68, 74, 81];

/**
 * Report + skill analysis + progress teasers — static previews of the
 * Phase 9 report and Phase 10 history views.
 */
export function ReportSection() {
  return (
    <>
      {/* Detailed AI feedback */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Capsule variant="success" sm dot className="mb-4">
                Detailed AI Feedback
              </Capsule>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Get an AI interview report &amp; score
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-text-secondary">
                After every interview you receive a professional report: an overall
                score, per-category scores, question-by-question analysis, strengths,
                weaknesses, mistakes, and a prioritized improvement plan with topics
                to practice before your next interview.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "What you did well — with specific examples",
                  "What went wrong and exactly what to improve",
                  "Recommended preparation topics, prioritized",
                  "Practice metrics: pace, pauses, and filler words",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock score card */}
            <TiltCard maxTilt={6}>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-primary/5 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Overall Score</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-text-primary">78<span className="text-lg text-text-muted">/100</span></p>
                </div>
                <Capsule variant="success">Good</Capsule>
              </div>
              <div className="mt-6 space-y-4">
                {categoryScores.map((cat) => (
                  <div key={cat.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-text-primary">{cat.label}</span>
                      <span className="text-text-secondary">{cat.score}</span>
                    </div>
                    <Progress value={cat.score} />
                  </div>
                ))}
              </div>
            </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Skill analysis + interview progress */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <Capsule variant="violet" sm dot className="mb-4">
                Skill Analysis
              </Capsule>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Track your interview progress over time
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-text-secondary">
                Repeating interviews builds a personal progress dashboard — per-skill
                scores and a score trend that shows exactly how your practice is paying
                off, interview after interview.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                  <LineChart className="h-4 w-4 text-primary" /> Score trend
                </span>
                {scoreTrend.map((score, index) => (
                  <span key={index} className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light font-bold text-primary">
                      {score}
                    </span>
                    {index < scoreTrend.length - 1 && (
                      <span aria-hidden="true" className="h-px w-4 bg-border" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
            <TiltCard maxTilt={6}>
            <div className="rounded-2xl border border-border bg-background p-6 shadow-lg shadow-primary/5 sm:p-8">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold text-text-primary">Skill progress</p>
                <TrendingUp className="ml-auto h-4 w-4 text-success" />
              </div>
              <div className="mt-6 space-y-4">
                {skillScores.map((skill) => (
                  <div key={skill.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-text-primary">{skill.label}</span>
                      <span className="text-text-secondary">{skill.score}%</span>
                    </div>
                    <Progress value={skill.score} />
                  </div>
                ))}
              </div>
            </div>
            </TiltCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
