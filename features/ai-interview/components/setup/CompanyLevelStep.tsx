"use client";

import { Input } from "@/components/ui/input";
import { CUSTOM_COMPANY_ID, COMPANIES } from "@/features/ai-interview/data/companies";
import { EXPERIENCE_LEVELS } from "@/features/ai-interview/data/experience-levels";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";
import { SelectableChip } from "./SelectableChip";

/** Step 2 — target company (presets + custom input) + experience level. */
export function CompanyLevelStep() {
  const companyId = useInterviewStore((s) => s.companyId);
  const customCompany = useInterviewStore((s) => s.customCompany);
  const experienceLevelId = useInterviewStore((s) => s.experienceLevelId);
  const setCompanyId = useInterviewStore((s) => s.setCompanyId);
  const setCustomCompany = useInterviewStore((s) => s.setCustomCompany);
  const setExperienceLevelId = useInterviewStore((s) => s.setExperienceLevelId);

  const showCustom = companyId === CUSTOM_COMPANY_ID;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Target company</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Company simulations are based on commonly reported interview patterns —
          never on confidential questions.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {COMPANIES.map((company) => (
            <SelectableChip
              key={company.id}
              selected={companyId === company.id}
              onSelect={() => setCompanyId(company.id)}
            >
              {company.name}
            </SelectableChip>
          ))}
          <SelectableChip
            selected={showCustom}
            onSelect={() => setCompanyId(CUSTOM_COMPANY_ID)}
          >
            Custom
          </SelectableChip>
        </div>
        {showCustom && (
          <div className="mt-4 max-w-sm animate-fade-in">
            <Input
              label="Company name"
              placeholder="e.g. Infosys, a local startup…"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary">Experience level</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Sets the starting difficulty — the AI adapts as the interview progresses.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {EXPERIENCE_LEVELS.map((level) => (
            <SelectableChip
              key={level.id}
              selected={experienceLevelId === level.id}
              onSelect={() => setExperienceLevelId(level.id)}
            >
              {level.label}
              {level.years ? (
                <span className="opacity-70">· {level.years}</span>
              ) : null}
            </SelectableChip>
          ))}
        </div>
      </div>
    </div>
  );
}
