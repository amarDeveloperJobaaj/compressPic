"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  CalendarDays,
  Clock,
  FileText,
  History as HistoryIcon,
  Loader2,
  RefreshCw,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Capsule } from "@/components/ui/capsule";
import { useAuth } from "@/features/ai-interview/hooks/useAuth";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";
import type { HistoryDashboard, HistorySession } from "@/features/ai-interview/services/interview/history";

/**
 * Personal interview dashboard (master spec §64, Phase 10).
 *
 * Stats + skill progress + score trend, and the session list with
 * view-report / restart (prefills the wizard) / delete actions. All data
 * comes from GET /api/interview/sessions (ownership-gated server-side).
 */

const CATEGORIES: { key: keyof HistoryDashboard["skillProgress"]; label: string; color: string }[] = [
  { key: "technical", label: "Technical", color: "#38bdf8" },
  { key: "problemSolving", label: "Problem Solving", color: "#818cf8" },
  { key: "project", label: "Project Knowledge", color: "#34d399" },
  { key: "communication", label: "Communication", color: "#fbbf24" },
  { key: "behavioral", label: "Behavioral", color: "#f472b6" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function InterviewHistory() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<HistoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/sessions", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; error?: string } & HistoryDashboard;
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to load history.");
        return;
      }
      setDashboard(data);
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/interview/sessions", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; error?: string } & HistoryDashboard;
      if (cancelled) return;
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to load history.");
        return;
      }
      setDashboard(data);
      setLoading(false);
    })().catch(() => {
      if (!cancelled) setError("Failed to load history.");
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const restart = useCallback(
    (session: HistorySession) => {
      // Prefill the wizard with the previous setup, then let the user review.
      const store = useInterviewStore.getState();
      if (session.setup.roleId) store.setRoleId(session.setup.roleId);
      if (session.setup.domainId) store.setDomainId(session.setup.domainId);
      if (session.setup.companyId) store.setCompanyId(session.setup.companyId);
      if (session.setup.customCompany) store.setCustomCompany(session.setup.customCompany);
      if (session.setup.experienceLevelId) store.setExperienceLevelId(session.setup.experienceLevelId);
      if (session.setup.interviewTypeId) store.setInterviewTypeId(session.setup.interviewTypeId);
      if (session.setup.durationMinutes) store.setDurationMinutes(session.setup.durationMinutes);
      store.setResumeSkipped(true);
      router.push("/ai-mock-interview/setup");
    },
    [router]
  );

  const remove = useCallback(
    async (sessionId: string) => {
      if (!window.confirm("Delete this interview permanently? Its report and answers will be removed.")) {
        return;
      }
      setDeletingId(sessionId);
      try {
        const res = await fetch(`/api/interview/session/${sessionId}`, { method: "DELETE" });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? "Failed to delete the session.");
          return;
        }
        await load();
      } catch {
        setError("Failed to delete the session.");
      } finally {
        setDeletingId(null);
      }
    },
    [load]
  );

  const removeAll = useCallback(async () => {
    if (
      !window.confirm(
        "Delete ALL your interview data permanently? This removes every session, report and uploaded resume — this cannot be undone."
      )
    ) {
      return;
    }
    setDeletingAll(true);
    try {
      const res = await fetch("/api/interview/account", { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to delete your data.");
        return;
      }
      await load();
    } catch {
      setError("Failed to delete your data.");
    } finally {
      setDeletingAll(false);
    }
  }, [load]);

  // --- Not signed in ---------------------------------------------------------
  if (!authLoading && !user) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
          <HistoryIcon className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold text-text-primary">Sign in to view your history</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Your interviews, reports and progress are tied to your account.
          </p>
          <Link
            href="/ai-mock-interview/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="container-page flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-rose-400/40 bg-rose-400/10 p-8 text-center">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{error}</p>
          <Button onClick={() => void load()} className="mt-5" variant="secondary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totals = dashboard?.totals;
  const trend = dashboard?.trend ?? [];

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Your interview history</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Track your progress across every mock interview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:bg-rose-500/10"
              onClick={() => void removeAll()}
              disabled={deletingAll || (dashboard?.sessions.length ?? 0) === 0}
            >
              <Trash2 className="h-4 w-4" /> Delete all data
            </Button>
            <Button asChild>
              <Link href="/ai-mock-interview/setup">
                New interview <TrendingUp className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-text-primary">{totals?.count ?? 0}</p>
            <p className="text-xs text-text-muted">Interviews</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-text-primary">{totals?.avgScore != null ? Math.round(totals.avgScore) : "—"}</p>
            <p className="text-xs text-text-muted">Avg score</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-text-primary">{totals?.bestScore ?? "—"}</p>
            <p className="text-xs text-text-muted">Best score</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-text-primary">{totals?.totalMinutes ?? 0}</p>
            <p className="text-xs text-text-muted">Minutes practiced</p>
          </div>
        </div>

        {/* Skill progress */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <BarChart3 className="h-5 w-5 text-primary" /> Skill progress
          </h2>
          <p className="mt-1 text-xs text-text-muted">Average category scores across your reports.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map(({ key, label, color }) => {
              const value = dashboard?.skillProgress[key];
              return (
                <div key={key} className="rounded-xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">{label}</span>
                    <span className="font-bold text-text-primary">{value != null ? Math.round(value) : "—"}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, value ?? 0)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Score trend */}
        {trend.length >= 2 && (
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <TrendingUp className="h-5 w-5 text-primary" /> Score trend
            </h2>
            <div className="mt-4 flex items-end gap-2">
              {trend.map((point) => (
                <div key={point.sessionId} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-text-primary">{point.overall}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/20 to-primary"
                    style={{ height: `${Math.max(6, point.overall)}px` }}
                    title={`${point.date}: ${point.overall}/100`}
                  />
                  <span className="text-[10px] text-text-muted">{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Session list */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary">Interviews</h2>
          {(dashboard?.sessions.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <Award className="mx-auto h-8 w-8 text-text-muted" />
              <p className="mt-3 text-sm text-text-secondary">
                No interviews yet — start your first mock interview.
              </p>
              <Button asChild className="mt-5">
                <Link href="/ai-mock-interview/setup">Start an interview</Link>
              </Button>
            </div>
          ) : (
            dashboard?.sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-primary">{session.targetRole}</p>
                    <Capsule variant="sky" sm glow={false}>
                      {session.interviewType}
                    </Capsule>
                    {session.status === "completed" ? (
                      <Capsule variant="success" sm glow={false}>
                        Completed
                      </Capsule>
                    ) : (
                      <Capsule variant="warning" sm glow={false}>
                        {session.status}
                      </Capsule>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {formatDate(session.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {session.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> {session.questionsAnswered} answered
                    </span>
                    {session.overallScore != null && (
                      <span className="flex items-center gap-1 font-bold text-primary">
                        <Award className="h-3.5 w-3.5" /> {session.overallScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {session.hasReport ? (
                    <Button asChild size="sm">
                      <Link href={`/ai-mock-interview/report/${session.id}`}>View report</Link>
                    </Button>
                  ) : null}
                  <Button size="sm" variant="secondary" onClick={() => restart(session)}>
                    <RefreshCw className="h-4 w-4" /> Restart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:bg-rose-500/10"
                    onClick={() => void remove(session.id)}
                    disabled={deletingId === session.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
