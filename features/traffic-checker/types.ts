"use client";

/** A single observable signal check with a pass/warn/fail/unknown status. */
export interface SignalCheck {
  label: string;
  status: "pass" | "warn" | "fail" | "unknown";
  detail?: string;
}

/** The 0–100 scores computed from the collected signals. */
export interface WebsiteScores {
  seo: number;
  technical: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  content: number;
  mobile: number;
  health: number;
}

/** The estimated traffic result. */
export interface TrafficEstimate {
  monthlyVisitors: number;
  yearlyVisitors: number;
  confidence: number; // 0-100
  trend: "High" | "Medium" | "Low";
  /** 12 monthly data points for the trend chart (index 0 = current month). */
  trendSeries: number[];
}

/** A generated recommendation with a severity. */
export interface Recommendation {
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
}

/** Detected technology / stack hints. */
export interface TechDetect {
  name: string;
  confidence: "high" | "medium" | "low";
}

/** The complete analysis report for one domain. */
export interface WebsiteReport {
  domain: string;
  url: string;
  analyzedAt: number;
  /** Raw signals used to build the report. */
  checks: SignalCheck[];
  /** Grouped checks for the breakdown panels. */
  groups: {
    seo: SignalCheck[];
    technical: SignalCheck[];
    performance: SignalCheck[];
    content: SignalCheck[];
  };
  scores: WebsiteScores;
  traffic: TrafficEstimate;
  recommendations: Recommendation[];
  tech: TechDetect[];
  meta: {
    title?: string;
    description?: string;
    pageSizeKb: number;
    wordCount: number;
    imageCount: number;
    internalLinks: number;
    externalLinks: number;
    indexedPages: "unknown";
    backlinks: "unknown";
  };
}
