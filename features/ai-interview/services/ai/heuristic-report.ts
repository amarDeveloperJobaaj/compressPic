import type { InterviewReport, ReportImprovementItem, ReportQuestionAnalysis } from "../../schemas/report";
import type { ReportGenerationContext } from "./types";

/**
 * Heuristic report generator (Phase 9).
 *
 * Local, deterministic, dependency-free fallback for `generateReport` when no
 * AI provider is configured (§74). Aggregates the persisted §54 evaluations +
 * §55–57 metrics into the full §58–63 report shape — honest about its limits:
 * strengths/weaknesses are drawn verbatim from the per-answer evaluations,
 * and the improvement plan is built from the weakest observed dimensions.
 */

/** Collect the most frequently mentioned strengths across answers. */
function aggregateStrengths(context: ReportGenerationContext): string[] {
  const seen = new Map<string, number>();
  for (const q of context.questions) {
    for (const s of q.strengths) seen.set(s, (seen.get(s) ?? 0) + 1);
  }
  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([text]) => text);
}

function aggregateWeaknesses(context: ReportGenerationContext): string[] {
  const seen = new Map<string, number>();
  for (const q of context.questions) {
    for (const w of q.weaknesses) seen.set(w, (seen.get(w) ?? 0) + 1);
  }
  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([text]) => text);
}

/** Build the improvement plan from the weakest category + filler/pace issues. */
function buildImprovementPlan(context: ReportGenerationContext): ReportImprovementItem[] {
  const items: ReportImprovementItem[] = [];
  const { scores } = context;
  const weakest = (
    ["technical", "problemSolving", "project", "communication", "behavioral"] as const
  ).reduce((min, key) => (scores[key] < scores[min] ? key : min), "technical" as const);

  const labels: Record<string, string> = {
    technical: "Technical fundamentals",
    problemSolving: "Structured problem solving",
    project: "Project depth & examples",
    communication: "Communication & delivery",
    behavioral: "Behavioral storytelling",
  };

  items.push({
    priority: 1,
    area: labels[weakest],
    why: `Lowest category score (${Math.round(scores[weakest])}/100) across ${context.questions.length} answered questions.`,
    practice: `Re-practice ${labels[weakest].toLowerCase()} with focused mock questions and review the per-question feedback in this report.`,
    goal: `Lift the ${labels[weakest].toLowerCase()} score above 75 on the next attempt.`,
  });

  const fillers = context.questions.reduce((sum, q) => sum + (q.metrics.fillerCount ?? 0), 0);
  if (fillers > 3) {
    items.push({
      priority: 2,
      area: "Filler words",
      why: `${fillers} filler word(s) counted across your answers (§56 practice metric).`,
      practice: "Pause instead of saying um/uh/like; record yourself and count fillers per answer.",
      goal: "Under 3 fillers per answer in the next session.",
    });
  }

  const slow = context.questions.filter((q) => q.metrics.paceAssessment === "Slow").length;
  if (slow > 0) {
    items.push({
      priority: 3,
      area: "Speaking pace",
      why: `${slow} answer(s) at a slow pace (under 100 wpm, §57).`,
      practice: "Aim for a moderate 100–160 wpm — trim long pauses and re-read answers aloud.",
      goal: "Moderate pace on most answers next session.",
    });
  }

  return items.slice(0, 8);
}

/** Per-question analysis §63 — straight from the stored evaluations. */
function buildQuestionAnalysis(context: ReportGenerationContext): ReportQuestionAnalysis[] {
  return context.questions.map((q) => ({
    questionId: q.questionId,
    question: q.question,
    score: q.score,
    good: q.strengths.slice(0, 3),
    missing: q.missingPoints.slice(0, 3),
    improve: q.improvement ?? "",
  }));
}

/** Recommended topics — the topics with the lowest average scores, then common skills. */
function buildRecommendedTopics(context: ReportGenerationContext): string[] {
  const byTopic = new Map<string, number[]>();
  for (const q of context.questions) {
    if (!q.topic) continue;
    const list = byTopic.get(q.topic) ?? [];
    list.push(q.score);
    byTopic.set(q.topic, list);
  }
  return [...byTopic.entries()]
    .map(([topic, scores]) => ({
      topic,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length,
    }))
    .filter((entry) => entry.avg < 6)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5)
    .map((entry) => `${entry.topic} (avg ${entry.avg.toFixed(1)}/10)`);
}

export function heuristicGenerateReport(context: ReportGenerationContext): InterviewReport {
  const questions = context.questions;
  const wpmValues = questions
    .map((q) => q.metrics.wordsPerMinute)
    .filter((v): v is number => v != null);
  const totalFillers = questions.reduce((sum, q) => sum + (q.metrics.fillerCount ?? 0), 0);
  const fillerFrequency = new Map<string, number>();
  for (const q of questions) {
    for (const f of q.metrics.mostFrequentFillers ?? []) {
      fillerFrequency.set(f.word, (fillerFrequency.get(f.word) ?? 0) + f.count);
    }
  }

  const strengths = aggregateStrengths(context);
  const weaknesses = aggregateWeaknesses(context);

  return {
    scores: context.scores,
    summary:
      questions.length === 0
        ? "The interview ended before any answers were evaluated — review the session and try again."
        : `Completed ${questions.length} answered question(s) as ${context.targetRole} (${context.interviewType} interview). Overall ${Math.round(context.scores.overall)}/100 — ${strengths.length ? "strong areas include " + strengths.slice(0, 2).join(" and ").toLowerCase() : "no clear strengths recorded yet"}.`,
    strengths,
    weaknesses,
    improvementPlan: buildImprovementPlan(context),
    questionAnalysis: buildQuestionAnalysis(context),
    communication: {
      summary:
        wpmValues.length > 0
          ? `Average speaking pace ${Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length)} wpm across ${wpmValues.length} timed answer(s).`
          : "No timing data was recorded for your answers.",
      averageWordsPerMinute: wpmValues.length
        ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length)
        : null,
      averageFillerCount: questions.length
        ? Math.round((totalFillers / questions.length) * 10) / 10
        : 0,
      totalFillers,
      mostFrequentFillers: [...fillerFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([word]) => word),
    },
    recommendedTopics: buildRecommendedTopics(context),
    suggestedNextInterview:
      context.scores.technical < 70 && context.interviewType !== "behavioral"
        ? `A focused ${context.targetRole} technical interview to rebuild fundamentals.`
        : context.scores.communication < 70
          ? "A behavioral interview focused on structured storytelling (STAR method)."
          : `Another ${context.targetRole} interview at a slightly higher difficulty to push your score.`,
  };
}
