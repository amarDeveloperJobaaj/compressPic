import type { GeneratedQuestion } from "../../schemas/question";
import type { Difficulty } from "../../types";
import type { QuestionContext } from "./types";

/**
 * Heuristic question generator (Phase 5).
 *
 * Local, deterministic, dependency-free fallback for the question engine when
 * no AI provider is configured (§74) — the interview still runs and is fully
 * testable. It builds questions from the setup labels + candidate profile,
 * never repeats a topic, and mixes follow-ups with new topics so the loop
 * feels like a conversation rather than a fixed questionnaire.
 */

interface QuestionBankEntry {
  type: GeneratedQuestion["type"];
  topic: string;
  build: (ctx: QuestionContext) => string;
}

interface QueueItem {
  entry: QuestionBankEntry;
  difficulty: Difficulty;
  /** Repeatable topics (e.g. the domain bank) dedupe by question text so a
   * long interview can ask several of them; everything else dedupes by topic. */
  repeatable?: boolean;
}

const DOMAIN_BANKS: Record<string, string[]> = {
  mern: [
    "How does React decide when to re-render a component, and how can you avoid unnecessary re-renders?",
    "Explain how Node.js handles many concurrent requests on a single thread.",
    "How would you model a one-to-many relationship in MongoDB, and when would you choose an embedded document over a reference?",
    "What happens when a browser loads a React app — walk me through the request flow from URL to painted page.",
    "How do you secure a REST API built with Express? Cover authentication and common attacks.",
  ],
  java: [
    "Explain the difference between an interface and an abstract class in Java, with an example of when you'd use each.",
    "How does garbage collection work in the JVM, and why does it matter for performance?",
    "Walk me through how you'd design a REST API in Spring Boot, including error handling.",
    "What is the difference between method overloading and method overriding in Java?",
    "How would you troubleshoot a memory leak in a long-running Java service?",
  ],
  python: [
    "Explain the difference between a list, a tuple, and a set in Python, and when you'd reach for each.",
    "How do generators work in Python, and how do they help with memory usage?",
    "Walk me through how you'd structure a Python project that needs to be maintained by a team.",
    "What is the Global Interpreter Lock and how does it affect concurrency in Python?",
    "How would you debug a slow Python script — what's your step-by-step approach?",
  ],
  react: [
    "Explain the difference between state and props in React, with an example of when each is appropriate.",
    "How does React's virtual DOM work, and how does it decide what to update?",
    "What are hooks, and what rules must you follow when using them?",
    "How would you handle authentication state across a React application?",
    "When would you reach for a state management library over built-in state, and why?",
  ],
  "node-js": [
    "Explain the event loop in Node.js and how it handles I/O.",
    "How would you scale a Node.js API that is starting to see heavy traffic?",
    "What is the difference between CommonJS and ES modules in Node.js?",
    "How do you handle errors in asynchronous Node.js code — promises, async/await, and unhandled rejections?",
    "How would you design a rate limiter for a public API in Node.js?",
  ],
  php: [
    "Explain how PHP handles sessions and cookies, and how you'd secure them.",
    "What is the difference between include and require in PHP, and when does it matter?",
    "How would you build and structure a maintainable PHP application?",
    "Explain prepared statements and why they matter for SQL injection prevention.",
    "How does Composer manage dependencies, and how would you handle a version conflict?",
  ],
  "data-science": [
    "Walk me through the process you'd use to clean and prepare a messy dataset.",
    "How do you decide which machine learning model to try first for a problem?",
    "Explain the difference between overfitting and underfitting, and how you'd detect and fix each.",
    "How would you communicate a complex analytical finding to a non-technical stakeholder?",
    "What evaluation metrics would you use for an imbalanced classification problem, and why?",
  ],
  ml: [
    "Explain the bias-variance tradeoff in your own words.",
    "How would you approach training a model when you only have a small labeled dataset?",
    "What is the difference between supervised, unsupervised, and reinforcement learning?",
    "How do you prevent data leakage when splitting a time-series dataset?",
    "Walk me through how you'd deploy and monitor a model in production.",
  ],
  devops: [
    "Explain the difference between Docker and Kubernetes, and when you'd use each.",
    "How would you design a CI/CD pipeline for a web application?",
    "How do you handle configuration and secrets across environments?",
    "Walk me through how you'd respond to a production incident.",
    "How would you set up monitoring and alerting for a service, and what would you watch first?",
  ],
  cybersecurity: [
    "Explain the difference between authentication and authorization, with examples.",
    "How would you secure an application against the OWASP Top 10 — pick the three you'd prioritize?",
    "What is a zero-day vulnerability and how would you manage the risk of one?",
    "How would you investigate a suspected breach — what's your first move?",
    "Explain defense in depth and how you'd apply it to a web application.",
  ],
};

const GENERIC_TECHNICAL: string[] = [
  "How would you design an API for a web application, and what would you consider first?",
  "Explain a time you had to debug a difficult problem — what was your process?",
  "How do you ensure the code you write is maintainable for a team?",
  "How would you optimize a slow database query?",
  "What's the difference between REST and GraphQL, and when would you choose one over the other?",
];

const BEHAVIORAL: string[] = [
  "Tell me about a time you disagreed with a teammate. How did you resolve it?",
  "Describe a situation where you had to meet a tight deadline under pressure. How did you handle it?",
  "Tell me about a failure at work. What did you learn from it?",
  "Give me an example of when you took ownership of something beyond your job description.",
  "Tell me about a time you had to learn a new technology quickly. What was your approach?",
];

const HR: string[] = [
  "What excites you most about this role, and why do you want to work at this company?",
  "Where do you see yourself in the next few years, and how does this role fit into that path?",
  "What would you consider your biggest strength, and how does it show up in your work?",
  "What's a weakness you're actively working on, and what are you doing about it?",
  "Tell me about a project you're genuinely proud of and why it matters to you.",
];

/** Ordered list of new-topic specs for the session, derived from context. */
function buildQueue(ctx: QuestionContext): QueueItem[] {
  const queue: QueueItem[] = [];
  // Bank key: the setup id (stable) with the display label normalized as
  // fallback. The topic shown to the user keeps the display label.
  const domain =
    ctx.domainId ?? (ctx.domain ?? "").toLowerCase().replace(/\s+/g, "-");
  const domainLabel = ctx.domain || domain;
  const company = ctx.targetCompany ? ` at ${ctx.targetCompany}` : "";
  const role = ctx.targetRole || "this role";

  // 1. HR opener (skipped for pure technical interviews).
  if (!ctx.interviewType.toLowerCase().includes("technical")) {
    queue.push({
      entry: {
        type: "hr",
        topic: "hr",
        build: () => `Tell me about yourself and what drew you to the ${role} role${company}.`,
      },
      difficulty: "beginner",
    });
  }

  // 2. Domain-specific technical bank (falls back to the generic set).
  const domainBank = DOMAIN_BANKS[domain] ?? GENERIC_TECHNICAL;
  for (const q of domainBank) {
    queue.push({
      entry: { type: "technical", topic: domainLabel || "technical", build: () => q },
      difficulty: ctx.difficulty,
      repeatable: true,
    });
  }

  // 3. Project deep-dive from the resume (§20).
  const projects = ctx.candidateProfile?.projects ?? [];
  if (projects.length > 0) {
    for (const project of projects.slice(0, 3)) {
      const name = project.name || "this project";
      queue.push({
        entry: {
          type: "project",
          topic: `project: ${name}`,
          build: () =>
            `Walk me through the architecture of ${name}. What were the main technical decisions, and what did you learn?`,
        },
        difficulty: ctx.difficulty,
      });
    }
  } else {
    queue.push({
      entry: {
        type: "project",
        topic: "project",
        build: () => `Tell me about a project you've worked on recently — what did you build and what was your role?`,
      },
      difficulty: ctx.difficulty,
    });
  }

  // 4. Skill deep-dive from the resume.
  const skills = ctx.candidateProfile?.skills ?? [];
  const skillPool = skills.length > 0 ? skills.slice(0, 5) : ["core fundamentals"];
  for (const skill of skillPool) {
    queue.push({
      entry: {
        type: "technical",
        topic: skill.toLowerCase(),
        build: () =>
          `How would you explain ${skill} to a junior developer, and when would you choose it over its alternatives?`,
      },
      difficulty: ctx.difficulty,
    });
  }

  // 5. Behavioral.
  for (const q of BEHAVIORAL) {
    queue.push({
      entry: { type: "behavioral", topic: "behavioral", build: () => q },
      difficulty: ctx.difficulty === "expert" ? "advanced" : ctx.difficulty,
    });
  }

  // 6. Closing HR.
  for (const q of HR.slice(0, 2)) {
    queue.push({
      entry: { type: "hr", topic: "hr", build: () => q },
      difficulty: "intermediate",
    });
  }

  return queue;
}

/** A follow-up that builds on the last question/answer without repeating it. */
/** Rotating follow-up phrasings so a long interview never repeats itself. */
const FOLLOWUP_TEMPLATES = [
  (topic: string) =>
    `You just covered ${topic} — can you go one level deeper and give a concrete example of how you'd apply it?`,
  (topic: string) =>
    `On ${topic}: what trade-offs did you weigh, and what would make you pick a different approach?`,
  (topic: string) =>
    `Let's stay on ${topic} — how would you explain the key idea to a junior developer, and what's a common mistake to avoid?`,
];

function buildFollowUp(ctx: QuestionContext, last: QuestionContext["previousQuestions"][number]): GeneratedQuestion {
  const lastTopic = (last.topic ?? "").toLowerCase();
  const isProject = lastTopic.startsWith("project:");
  const projectName = isProject ? last.topic!.replace(/^project:\s*/i, "") : null;
  // A topic worth naming (skips generic/behavioral/hr buckets).
  const topicLabel =
    last.topic && lastTopic !== "technical" && lastTopic !== "behavioral" && lastTopic !== "hr"
      ? last.topic
      : null;

  const question = isProject
    ? `You mentioned ${projectName}. What was the hardest technical challenge in that project, and how did you resolve it?`
    : topicLabel
      ? FOLLOWUP_TEMPLATES[ctx.previousQuestions.length % FOLLOWUP_TEMPLATES.length](topicLabel)
      : `You said "${(ctx.lastAnswer?.answer ?? "").slice(0, 90).trim()}". Could you walk me through your reasoning in more detail?`;

  return {
    action: "FOLLOW_UP",
    question,
    type: isProject ? "project" : (last.type as GeneratedQuestion["type"]) || "technical",
    topic: last.topic,
    difficulty: last.difficulty,
    reason: "Heuristic follow-up — builds on the previous answer.",
  };
}

/** True when the previous answer was followed-up already this cycle. */
function isDueFollowUp(ctx: QuestionContext): boolean {
  const asked = ctx.previousQuestions.length;
  if (!ctx.lastAnswer || asked === 0) return false;
  // Follow up after every odd-numbered question (2nd, 4th, …) so the rhythm
  // alternates between new topics and deeper dives.
  return asked % 2 === 1;
}

function pickNewTopic(ctx: QuestionContext): GeneratedQuestion {
  const usedTopics = new Set(
    ctx.previousQuestions.map((q) => (q.topic ?? "").toLowerCase()).filter(Boolean)
  );
  const usedTexts = new Set(ctx.previousQuestions.map((q) => q.question.toLowerCase()));
  const queue = buildQueue(ctx);

  const candidate = queue.find((item) =>
    item.repeatable
      ? !usedTexts.has(item.entry.build(ctx).toLowerCase())
      : !usedTopics.has(item.entry.topic.toLowerCase())
  );

  // Queue exhausted (very long interview) — cycle from the top rather than stall.
  const entry = candidate ?? queue[0];
  return {
    action: "NEW_TOPIC",
    question: entry.entry.build(ctx),
    type: entry.entry.type,
    topic: entry.entry.topic,
    difficulty: entry.difficulty,
    reason: "Heuristic — next topic in the interview plan.",
  };
}

export function heuristicGenerateQuestion(ctx: QuestionContext): GeneratedQuestion {
  return pickNewTopic(ctx);
}

export function heuristicGenerateFollowUp(ctx: QuestionContext): GeneratedQuestion {
  const last = ctx.previousQuestions[ctx.previousQuestions.length - 1];
  if (!last) return heuristicGenerateQuestion(ctx);
  if (isDueFollowUp(ctx) && ctx.lastAnswer) return buildFollowUp(ctx, last);
  return pickNewTopic(ctx);
}
