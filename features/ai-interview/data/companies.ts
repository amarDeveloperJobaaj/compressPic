import { CUSTOM_COMPANY_ID, type Company } from "../types";

/**
 * Target company presets — values exactly from 03-tool-info.md.
 * The selected company influences the interview STYLE only, never claims
 * confidential questions (master spec §22): simulations are built around
 * commonly reported interview patterns.
 */
export const COMPANIES: Company[] = [
  { id: "google", name: "Google", description: "Big-tech style rounds" },
  { id: "microsoft", name: "Microsoft", description: "Big-tech style rounds" },
  { id: "amazon", name: "Amazon", description: "Leadership principles style" },
  { id: "tcs", name: "TCS", description: "Service-company style" },
  { id: "infosys", name: "Infosys", description: "Service-company style" },
  { id: "startup", name: "Startup", description: "Fast-paced, product-focused" },
];

/** The "Custom" company chip — reveals a free-text company input. */
export { CUSTOM_COMPANY_ID };
