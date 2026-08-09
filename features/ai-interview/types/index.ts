/** Interview depth — auto-suggested from the experience level (§25). */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Role {
  id: string;
  name: string;
  /** SEO slug — reserved for future /ai-mock-interview/[role] pages. */
  slug: string;
  description: string;
}

export interface Domain {
  id: string;
  name: string;
  /** SEO slug — reserved for future /ai-mock-interview/[domain] pages. */
  slug: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
}

/** Custom company option id — see features/ai-interview/data/companies.ts. */
export const CUSTOM_COMPANY_ID = "custom";

export interface ExperienceLevel {
  id: string;
  label: string;
  years?: string;
}

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
}

export interface DurationOption {
  minutes: number;
  recommended?: boolean;
}

/** Fully resolved interview configuration (ids resolved to data objects). */
export interface InterviewConfig {
  role: Role | null;
  domain: Domain | null;
  company: Company | null;
  customCompany: string;
  experienceLevel: ExperienceLevel | null;
  interviewType: InterviewType | null;
  durationMinutes: number | null;
  difficulty: Difficulty;
}
