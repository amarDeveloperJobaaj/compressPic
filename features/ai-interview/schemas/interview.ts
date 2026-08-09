import { z } from "zod";

import { CUSTOM_COMPANY_ID } from "../data/companies";

/**
 * Step-level validation for the setup wizard (master spec §4 G2, §89).
 * Each step schema validates only its own fields; resume is optional
 * (interviews can run without one — see 03-tool-info.md "Skip resume").
 */

export const stepOneSchema = z.object({
  roleId: z.string().min(1, "Select a target role."),
  domainId: z.string().min(1, "Select a domain."),
});

export const stepTwoSchema = z
  .object({
    companyId: z.string().min(1, "Select a target company."),
    customCompany: z.string().optional(),
    experienceLevelId: z.string().min(1, "Select your experience level."),
  })
  .refine(
    (data) =>
      data.companyId !== CUSTOM_COMPANY_ID ||
      (data.customCompany?.trim().length ?? 0) >= 2,
    { message: "Enter your target company name.", path: ["customCompany"] }
  );

export const stepThreeSchema = z.object({
  interviewTypeId: z.string().min(1, "Select an interview type."),
  durationMinutes: z.number().min(10, "Select an interview duration."),
});

export type StepOneData = z.infer<typeof stepOneSchema>;
export type StepTwoData = z.infer<typeof stepTwoSchema>;
export type StepThreeData = z.infer<typeof stepThreeSchema>;
