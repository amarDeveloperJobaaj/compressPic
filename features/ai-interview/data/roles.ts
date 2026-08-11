import type { Role } from "../types";

/** Target roles — values from 03-tool-info.md + premium landing §20 (extensible). */
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
    id: "react-developer",
    name: "React Developer",
    slug: "react-developer",
    description: "React, hooks, state management, and component architecture.",
  },
  {
    id: "node-js-developer",
    name: "Node.js Developer",
    slug: "node-js-developer",
    description: "Node.js, Express, APIs, and server-side architecture.",
  },
  {
    id: "python-developer",
    name: "Python Developer",
    slug: "python-developer",
    description: "Python, Django/Flask, scripting, and automation.",
  },
  {
    id: "java-developer",
    name: "Java Developer",
    slug: "java-developer",
    description: "Java, Spring, OOP, and enterprise applications.",
  },
  {
    id: "php-developer",
    name: "PHP Developer",
    slug: "php-developer",
    description: "PHP, Laravel, MySQL, and web application development.",
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    slug: "devops-engineer",
    description: "CI/CD, Docker, Kubernetes, cloud, and infrastructure.",
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
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    slug: "ui-ux-designer",
    description: "Design thinking, usability, and portfolio storytelling.",
  },
  {
    id: "hr-professional",
    name: "HR Professional",
    slug: "hr-professional",
    description: "Talent acquisition, employee relations, and HR processes.",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    description: "Growth, campaigns, analytics, and brand strategy.",
  },
  {
    id: "sales",
    name: "Sales",
    slug: "sales",
    description: "Discovery, objection handling, and closing conversations.",
  },
];
