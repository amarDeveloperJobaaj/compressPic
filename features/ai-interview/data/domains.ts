import type { Domain } from "../types";

/** Technology domains — values exactly from 03-tool-info.md (extensible). */
export const DOMAINS: Domain[] = [
  { id: "mern", name: "MERN", slug: "mern" },
  { id: "java", name: "Java", slug: "java" },
  { id: "python", name: "Python", slug: "python" },
  { id: "react", name: "React", slug: "react" },
  { id: "node-js", name: "Node.js", slug: "node-js" },
  { id: "php", name: "PHP", slug: "php" },
  { id: "data-science", name: "Data Science", slug: "data-science" },
  { id: "ml", name: "ML", slug: "ml" },
  { id: "devops", name: "DevOps", slug: "devops" },
  { id: "cybersecurity", name: "Cybersecurity", slug: "cybersecurity" },
];
