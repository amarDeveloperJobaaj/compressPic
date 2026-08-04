import { Database, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { ADMIN_CONFIG } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

function InfoCard({
  Icon,
  title,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-text-secondary">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Authentication and data-layer status. All values are read server-side from environment
          variables.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard Icon={ShieldCheck} title="Authentication">
          <p>Static credentials validated server-side (no client exposure).</p>
          <ul className="mt-2 space-y-1.5 text-xs text-text-muted">
            <li className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
              <span>Username</span>
              <code className="font-mono text-text-primary">{ADMIN_CONFIG.username}</code>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
              <span>Password</span>
              <Capsule variant="success" sm glow={false}>
                set via ADMIN_PASSWORD
              </Capsule>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
              <span>Session secret</span>
              <code className="font-mono text-text-primary">
                {ADMIN_CONFIG.sessionSecret.includes("change-me") ? "dev fallback" : "configured"}
              </code>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
              <span>Session lifetime</span>
              <span>{ADMIN_CONFIG.sessionDays} days (30 when “Remember me”)</span>
            </li>
          </ul>
        </InfoCard>

        <InfoCard Icon={KeyRound} title="Session strategy">
          <p>
            Stateless HMAC-signed cookie (<code className="font-mono text-xs">httpOnly</code>,{" "}
            <code className="font-mono text-xs">sameSite=lax</code>, secure in production). No
            server-side session table, so sessions survive restarts and scale across instances.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Capsule variant="primary" sm>Proxy optimistic guard</Capsule>
            <Capsule variant="primary" sm>Layout verification</Capsule>
            <Capsule variant="primary" sm>API 401 checks</Capsule>
          </div>
        </InfoCard>

        <InfoCard Icon={Database} title="Data layer (future-ready)">
          <p>
            The blog currently uses the in-memory dummy repository seeded with 20 posts. The
            repository interface is the exact seam where Supabase replaces the data — no UI, route
            or component changes required.
          </p>
          <div className="mt-3">
            <Capsule variant="warning" sm>Dummy data (local memory)</Capsule>
          </div>
        </InfoCard>

        <InfoCard Icon={RefreshCw} title="Supabase migration">
          <p>
            Follow <code className="font-mono text-xs">docs/supabase-migration.md</code>. In short:
            implement the same repository functions with Supabase queries, swap the auth helpers for{" "}
            <code className="font-mono text-xs">supabase.auth</code>, then delete the dummy store.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
