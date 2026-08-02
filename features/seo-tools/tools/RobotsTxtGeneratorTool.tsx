"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Plus, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/features/devtools/components/CodeOutput";
import { copyToClipboard, downloadText } from "@/features/devtools/utils/download";
import { buildRobotsTxt, type RobotsRule } from "../utils/seo";
import { cn } from "@/lib/utils";

interface RuleGroup {
  id: number;
  userAgent: string;
  disallow: string;
  allow: string;
}

let nextRuleId = 1;

function parseRules(groups: RuleGroup[]): RobotsRule[] {
  return groups
    .filter((g) => g.userAgent.trim())
    .map((g) => ({
      userAgent: g.userAgent.trim(),
      disallow: g.disallow
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.startsWith("/")),
      allow: g.allow
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.startsWith("/")),
    }));
}

function validateRobots(groups: RuleGroup[], sitemap: string): string[] {
  const issues: string[] = [];
  if (groups.length === 0 || groups.every((g) => !g.userAgent.trim())) {
    issues.push("Add at least one user-agent group.");
  }
  const agents = groups.map((g) => g.userAgent.trim()).filter(Boolean);
  if (new Set(agents).size !== agents.length) {
    issues.push("Duplicate user-agent groups — merge them to avoid conflicts.");
  }
  for (const g of groups) {
    const badDisallow = g.disallow.split("\n").map((p) => p.trim()).filter((p) => p && !p.startsWith("/"));
    if (badDisallow.length) {
      issues.push(`"${g.userAgent}": Disallow paths must start with "/" (e.g. /admin).`);
    }
  }
  if (sitemap && !/^https?:\/\//.test(sitemap)) {
    issues.push("Sitemap URL must be absolute (start with https://).");
  }
  return issues;
}

export function RobotsTxtGeneratorTool() {
  const [groups, setGroups] = useState<RuleGroup[]>([
    { id: nextRuleId++, userAgent: "*", disallow: "/admin\n/private", allow: "/public" },
  ]);
  const [sitemap, setSitemap] = useState("https://vizotool.com/sitemap.xml");
  const [host, setHost] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");

  const rules = useMemo(() => parseRules(groups), [groups]);
  const content = useMemo(
    () =>
      buildRobotsTxt({
        rules,
        sitemap: sitemap.trim() || undefined,
        host: host.trim() || undefined,
        crawlDelay: crawlDelay.trim() || undefined,
      }),
    [rules, sitemap, host, crawlDelay]
  );
  const issues = useMemo(() => validateRobots(groups, sitemap), [groups, sitemap]);
  const valid = issues.length === 0;

  const updateGroup = (id: number, patch: Partial<RuleGroup>) =>
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const addGroup = () => setGroups((gs) => [...gs, { id: nextRuleId++, userAgent: "Googlebot", disallow: "", allow: "" }]);

  const removeGroup = (id: number) => setGroups((gs) => gs.filter((g) => g.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Builder */}
      <ToolPanel
        title="Crawl Rules"
        description="Define user-agent groups and their allow/disallow paths."
        actions={
          <Button variant="secondary" size="sm" onClick={addGroup}>
            <Plus className="h-3.5 w-3.5" />
            Add group
          </Button>
        }
      >
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Input
                  label="User-agent"
                  value={group.userAgent}
                  onChange={(e) => updateGroup(group.id, { userAgent: e.target.value })}
                  placeholder="* or Googlebot"
                  className="max-w-[220px]"
                />
                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  aria-label="Remove group"
                  className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-light hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">Disallow (one path per line)</label>
                  <textarea
                    value={group.disallow}
                    onChange={(e) => updateGroup(group.id, { disallow: e.target.value })}
                    rows={3}
                    placeholder="/admin\n/api/private"
                    className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">Allow (one path per line)</label>
                  <textarea
                    value={group.allow}
                    onChange={(e) => updateGroup(group.id, { allow: e.target.value })}
                    rows={3}
                    placeholder="/public"
                    className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-4 border-t border-border pt-4">
          <Input label="Sitemap URL" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Host (optional)" value={host} onChange={(e) => setHost(e.target.value)} placeholder="example.com" />
            <Input label="Crawl-delay (seconds)" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" inputMode="numeric" />
          </div>
        </div>
      </ToolPanel>

      {/* Output — min-w-0 lets the code block scroll inside instead of widening the page */}
      <div className="min-w-0 space-y-6">
        <ToolPanel
          title="robots.txt"
          description="Copy or download the file and place it at your site root."
          actions={
            <>
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  valid ? "bg-success-light text-success" : "bg-error-light text-error"
                )}
              >
                {valid ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                {valid ? "Valid" : `${issues.length} issue${issues.length > 1 ? "s" : ""}`}
              </span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content)}>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadText("robots.txt", content, "text/plain")}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </>
          }
        >
          <CodeOutput text={content} title="robots.txt" filename="robots.txt" previewClass="max-h-[360px]" />
          {issues.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {issues.map((issue) => (
                <li key={issue} className="flex items-start gap-2 text-xs text-error">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </ToolPanel>
      </div>
    </div>
  );
}
