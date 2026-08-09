/**
 * Heuristic resume analyzer.
 *
 * Local, deterministic, dependency-free extraction used as the graceful
 * fallback when no AI provider is configured (§74) — so the flow works and is
 * testable out-of-the-box. Accuracy is deliberately conservative: it never
 * invents facts, only pulls what the text plainly states.
 */

import type { CandidateProfile } from "../../schemas/resume";
import type { ResumeAnalysisResult } from "../../schemas/resume";

const SKILL_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "golang", "go", "rust",
  "react", "react native", "next.js", "nextjs", "node.js", "nodejs", "express", "nestjs",
  "vue", "angular", "svelte", "tailwind", "html", "css", "sass",
  "mongodb", "mysql", "postgresql", "postgres", "sqlite", "redis", "elasticsearch",
  "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform", "jenkins", "github actions", "ci/cd",
  "graphql", "rest api", "rest", "websocket", "grpc",
  "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "machine learning", "deep learning",
  "data analysis", "power bi", "tableau", "excel", "sql",
  "git", "linux", "bash", "shell", "firebase", "supabase", "prisma",
  "microservices", "system design", "distributed systems", "oop", "data structures", "algorithms",
  "agile", "scrum", "jira", "figma", "selenium", "jest", "cypress", "testing",
];

const LEVEL_PATTERNS: { level: string; pattern: RegExp }[] = [
  { level: "Fresher", pattern: /\b(fresher|entry[- ]level|new graduate|0\+ years?)\b/i },
  { level: "Junior", pattern: /\b(junior|1\+ years?|1-2 years?|one\+ years?)\b/i },
  { level: "Mid-level", pattern: /\b(mid[- ]level|3\+ years?|3-5 years?|3 to 5 years?)\b/i },
  { level: "Senior", pattern: /\b(senior|lead|principal|staff|5\+ years?|6\+ years?|7\+ years?)\b/i },
  { level: "Lead", pattern: /\b(tech lead|engineering manager|head of|director)\b/i },
];

function firstLineName(text: string): string {
  // The first non-empty line is usually the name; sanity-cap the length.
  const line = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0);
  if (!line) return "Candidate";
  const name = line.replace(/[|•·\-–—,]/g, " ").replace(/\s+/g, " ").trim();
  // A name is short and contains letters — otherwise fall back.
  if (name.length > 2 && name.length <= 40 && /[A-Za-z]/.test(name)) return name;
  return "Candidate";
}

function extractSkills(text: string): string[] {
  const found = new Set<string>();
  for (const skill of SKILL_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}`, "i").test(text)) found.add(skill);
  }
  return [...found].slice(0, 20);
}

function sectionLines(text: string, heading: RegExp): string[] {
  const lines = text.split("\n").map((l) => l.trim());
  const start = lines.findIndex((l) => heading.test(l));
  if (start === -1) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    // Stop at the next section heading.
    if (/^(education|skills|experience|projects?|certifications?|summary|work|contact)\b/i.test(l)) break;
    out.push(l);
  }
  return out.filter((l) => !/^[•·\-–—]?\s*(page|resume|curriculum)/i.test(l));
}

function extractProjects(text: string): CandidateProfile["projects"] {
  const lines = sectionLines(text, /\bprojects?\b/i);
  const projects: CandidateProfile["projects"] = [];
  let current: CandidateProfile["projects"][number] | null = null;
  for (const line of lines) {
    const clean = line.replace(/^[•·\-–—]+\s*/, "");
    if (!clean) continue;
    if (clean.length < 120) {
      // Heuristic: a project title line (short, capitalized-ish).
      if (current) projects.push(current);
      current = { name: clean.slice(0, 80), technologies: [] };
    } else if (current) {
      // Grab inline tech mentions as the project's technologies.
      for (const t of extractSkills(clean)) {
        if (!current.technologies.includes(t)) current.technologies.push(t);
      }
    }
  }
  if (current) projects.push(current);
  return projects.slice(0, 6);
}

export function heuristicAnalyzeResume(resumeText: string): ResumeAnalysisResult {
  const text = resumeText.trim();
  const profile: CandidateProfile = {
    candidate_name: firstLineName(text),
    experience_level: "Mid-level",
    skills: extractSkills(text),
    projects: extractProjects(text),
    experience: [],
    education: [],
    certifications: [],
    likely_strengths: [],
    potential_weaknesses: [],
  };

  for (const { level, pattern } of LEVEL_PATTERNS) {
    if (pattern.test(text)) {
      profile.experience_level = level;
      break;
    }
  }

  // Education — only what the text plainly states.
  for (const line of sectionLines(text, /\beducation\b/i)) {
    if (/b\.?tech|bachelor|master|m\.?tech|b\.?sc|m\.?sc|phd|diploma|bca|mca|degree/i.test(line)) {
      const clean = line.replace(/^[•·\-–—]+\s*/, "").slice(0, 120);
      profile.education.push({ degree: clean, institution: "", year: "" });
    }
  }

  for (const line of sectionLines(text, /\bcertifications?\b/i)) {
    if (/certif|aws|google|azure|scrum|pmp|coursera|udemy/i.test(line)) {
      profile.certifications.push(line.replace(/^[•·\-–—]+\s*/, "").slice(0, 100));
    }
  }

  profile.likely_strengths = profile.skills.slice(0, 3).map((s) => `Strong background in ${s}.`);
  if (profile.skills.length === 0) {
    profile.potential_weaknesses = [
      "No clearly listed technical skills — consider adding a skills section.",
    ];
  }

  return {
    profile,
    source: "heuristic",
    warning: "No AI provider configured — this profile was built locally from the resume text.",
  };
}
