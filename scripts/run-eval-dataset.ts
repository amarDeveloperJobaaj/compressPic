/**
 * Evaluation dataset runner (Phase 8 — §54, §55–57, §93).
 *
 * Runs the deterministic heuristic evaluator + communication metrics
 * pipeline over every curated case in EVAL_DATASET and asserts the expected
 * outcome (verdict allowlist, overall band, pace band). No AI key needed —
 * the heuristic provider is the guaranteed fallback (§74) and is fully
 * deterministic, so this script is a stable regression harness.
 *
 * Usage:
 *   npx tsx scripts/run-eval-dataset.ts
 *
 * Exits non-zero when any case fails.
 */
import { heuristicEvaluateAnswer } from "../features/ai-interview/services/ai/heuristic-evaluation";
import { computeOverall, deriveVerdict } from "../features/ai-interview/services/interview/adaptive-controller";
import {
  buildCommunicationMetrics,
  type CommunicationMetrics,
} from "../features/ai-interview/services/interview/communication-metrics";
import {
  EVAL_DATASET,
  toEvaluationContext,
} from "../features/ai-interview/services/interview/eval-dataset";
import type { EvaluatedAnswer } from "../features/ai-interview/schemas/evaluation";

interface CaseResult {
  id: string;
  label: string;
  overall: number;
  verdict: EvaluatedAnswer["verdict"];
  metrics: CommunicationMetrics;
  ok: boolean;
  issues: string[];
}

function checkCase(result: CaseResult, item: (typeof EVAL_DATASET)[number]): void {
  const issues: string[] = [];
  if (!item.expectedVerdicts.includes(result.verdict)) {
    issues.push(
      `verdict ${result.verdict} not in expected [${item.expectedVerdicts.join(", ")}]`
    );
  }
  if (result.overall < item.overallRange.min || result.overall > item.overallRange.max) {
    issues.push(`overall ${result.overall} outside ${item.overallRange.min}–${item.overallRange.max}`);
  }
  if (item.expectedPace && result.metrics.paceAssessment !== item.expectedPace) {
    issues.push(
      `pace ${result.metrics.paceAssessment ?? "null"} != expected ${item.expectedPace}`
    );
  }
  result.ok = issues.length === 0;
  result.issues = issues;
}

function printTable(results: CaseResult[]): void {
  const pad = (s: string, n: number) => s.padEnd(n);
  console.log("");
  console.log("==================================================================");
  console.log("  EVAL DATASET — heuristic evaluator + metrics pipeline");
  console.log("==================================================================");
  console.log(pad("case", 22) + pad("verdict", 10) + pad("overall", 9) + pad("fillers", 9) + pad("wpm", 6) + pad("pace", 10) + "result");
  console.log("-".repeat(76));
  for (const r of results) {
    const m = r.metrics;
    console.log(
      pad(r.label, 22) +
        pad(r.verdict, 10) +
        pad(String(r.overall), 9) +
        pad(String(m.fillerCount), 9) +
        pad(m.wordsPerMinute == null ? "–" : String(m.wordsPerMinute), 6) +
        pad(m.paceAssessment ?? "–", 10) +
        (r.ok ? "✅ pass" : "❌ FAIL")
    );
    for (const issue of r.issues) console.log(`      ⚠ ${issue}`);
  }
  console.log("==================================================================");
}

async function main(): Promise<void> {
  const results: CaseResult[] = [];

  for (const item of EVAL_DATASET) {
    const raw = heuristicEvaluateAnswer(toEvaluationContext(item));
    const overall = computeOverall(raw);
    const verdict = deriveVerdict(overall);
    const metrics = buildCommunicationMetrics(item.answer, item.durationSeconds);

    const result: CaseResult = {
      id: item.id,
      label: item.label,
      overall,
      verdict,
      metrics,
      ok: true,
      issues: [],
    };
    checkCase(result, item);
    results.push(result);
  }

  printTable(results);

  const failed = results.filter((r) => !r.ok);
  console.log(`  ${results.length - failed.length}/${results.length} cases passed`);
  if (failed.length) {
    console.log(`  ❌ ${failed.length} case(s) failed — tune EVAL_DATASET or fix the evaluator.`);
    process.exitCode = 1;
  } else {
    console.log("  ✅ All dataset expectations hold.");
  }
  console.log("");
}

main().catch((error) => {
  console.error("Eval dataset run failed:", error);
  process.exit(1);
});
