import type { Faq } from "@/lib/seo-content";

/**
 * Landing page FAQs. The visible text IS the FAQPage JSON-LD content
 * (FaqSection renders both from this array), so wording must stay in sync.
 * Copy follows the 06-seo.md long-tail keyword map — natural, no stuffing.
 */
export const AI_INTERVIEW_FAQS: Faq[] = [
  {
    question: "What is an AI mock interview?",
    answer:
      "An AI mock interview is a realistic practice interview run by an AI interviewer. You pick your target role, domain, company, and experience level, then answer questions out loud — the AI interviewer listens, asks adaptive follow-ups, and scores your answers in a detailed report.",
  },
  {
    question: "Is the AI interview free?",
    answer:
      "Yes — AI interview practice on Vizo Tool is free. There are no sign-up fees and no hidden costs, so you can practice mock interviews online as often as you need.",
  },
  {
    question: "Does it work for freshers and college students?",
    answer:
      "Absolutely. The mock interview starts from your experience level — Fresher, 0–1, 1–3, 3–5, 5–8, or 8+ years — and adapts the difficulty and questions accordingly, making it ideal for campus placements, internships, and first job interviews.",
  },
  {
    question: "Can I practice with my own resume?",
    answer:
      "Yes. Upload your resume as a PDF and the AI interviewer builds resume-based mock interview questions around your skills, projects, and experience — then deep-dives into the projects you mention, just like a real interviewer would.",
  },
  {
    question: "How does the AI interviewer score my answers?",
    answer:
      "Every answer is evaluated on technical accuracy, relevance, completeness, clarity, structure, and depth. You get an overall interview score plus per-question feedback. Scores are practice indicators to guide your preparation — never hiring decisions.",
  },
  {
    question: "Do I need a camera and microphone?",
    answer:
      "A microphone is recommended so you can answer with your voice, and the camera creates the realistic interview room experience. Both are optional — a text fallback is always available, so you can practice even without any devices enabled.",
  },
  {
    question: "How long does a mock interview take?",
    answer:
      "You choose the duration — 10, 20, 30, 45, or 60 minutes. We recommend starting with a 20-minute interview, which is long enough for a realistic mix of questions and follow-ups.",
  },
  {
    question: "What interview questions will I get?",
    answer:
      "Questions are generated from your resume, role, domain, experience level, and selected company — including common interview questions and answers for your role. Company simulations are based on publicly reported interview patterns and never claim to use any company's confidential questions.",
  },
];
