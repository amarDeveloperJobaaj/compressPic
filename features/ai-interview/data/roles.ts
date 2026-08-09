import type { Role } from "../types";

/** Target roles — values exactly from 03-tool-info.md (extensible). */
export const ROLES: Role[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    slug: "software-engineer",
    description: "Programming fundamentals, data structures, and problem solving.",
  },
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    slug: "frontend-developer",
    description: "HTML, CSS, JavaScript, React, and web performance.",
  },
  {
    id: "backend-developer",
    name: "Backend Developer",
    slug: "backend-developer",
    description: "APIs, databases, servers, and architecture.",
  },
  {
    id: "full-stack-developer",
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "Frontend, backend, databases, and deployment.",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    slug: "data-analyst",
    description: "SQL, statistics, dashboards, and data storytelling.",
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    slug: "data-scientist",
    description: "Machine learning, statistics, and model evaluation.",
  },
  {
    id: "product-manager",
    name: "Product Manager",
    slug: "product-manager",
    description: "Product strategy, prioritization, and stakeholder communication.",
  },
];
