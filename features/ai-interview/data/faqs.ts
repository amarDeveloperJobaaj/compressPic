import type { Faq } from "@/lib/seo-content";

/**
 * Landing page FAQs (§24). The visible text IS the FAQPage JSON-LD content
 * (FaqSection renders both from this array), so wording must stay in sync.
 * Long-tail, natural — no keyword stuffing.
 */
export const AI_INTERVIEW_FAQS: Faq[] = [
  {
    question: "What is Vizotool Interview AI?",
    answer:
      "Vizotool Interview AI is a realistic AI mock interview practice tool. You pick your target role, domain, company, and experience level, then answer questions out loud or by typing — an AI interviewer listens, asks adaptive follow-ups, and scores your answers in a detailed report.",
  },
  {
    question: "How does the AI mock interview work?",
    answer:
      "You set up your interview in under a minute: choose a role and company, optionally upload your resume, and pick an interview type and duration. The AI interviewer then runs the session one question at a time, adapts follow-ups to your answers, and ends with a full score report.",
  },
  {
    question: "Can I use my resume?",
    answer:
      "Yes. Upload your resume as a PDF and the AI interviewer builds resume-based mock interview questions around your skills, projects, and experience — then deep-dives into the projects you mention, just like a real interviewer would.",
  },
  {
    question: "Can I practice company-specific interviews?",
    answer:
      "Yes. You can select a target company and the interview adapts its style, role expectations, and commonly reported patterns for that company. Simulations are based on publicly reported patterns and never claim to use any company's confidential questions.",
  },
  {
    question: "Does it support technical interviews?",
    answer:
      "Absolutely. Technical mock interviews cover DSA, system design, coding, and role-specific fundamentals, with structured evaluation of your approach, correctness, and explanation.",
  },
  {
    question: "How does AI evaluate answers?",
    answer:
      "Every answer is evaluated on technical accuracy, relevance, completeness, clarity, structure, and depth. You get an overall interview score plus per-question feedback. Scores are practice indicators to guide your preparation — never hiring decisions.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes — AI interview practice on Vizotool is free. There are no sign-up fees and no hidden costs, so you can practice mock interviews online as often as you need.",
  },
  {
    question: "Can I practice multiple times?",
    answer:
      "Yes, as many times as you like. Each session is fresh — new questions, new follow-ups — and repeated interviews build a personal progress dashboard that shows how your scores improve over time.",
  },
];
