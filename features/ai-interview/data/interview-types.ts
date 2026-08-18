import type { InterviewType } from "../types";

/** Interview types — values exactly from 03-tool-info.md. Mixed is the default. */
export const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: "technical",
    name: "Technical",
    description: "Programming, frameworks, databases, and architecture.",
  },
  {
    id: "hr",
    name: "HR",
    description: "Introduction, career goals, strengths, and motivation.",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    description: "Leadership, conflict, failure, and teamwork situations.",
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Architecture, scalability, caching, and distributed systems.",
  },
  {
    id: "coding",
    name: "Coding",
    description: "Solve live coding problems — write a solution in the built-in editor.",
    // Phase 13 — flag-gated premium feature (§107, no payments wired).
    premium: true,
  },
  {
    id: "mixed",
    name: "Mixed",
    description: "Technical + HR + Behavioral + project deep-dive.",
    recommended: true,
  },
];

export const DEFAULT_INTERVIEW_TYPE_ID = "mixed";
