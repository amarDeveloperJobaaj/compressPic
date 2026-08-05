import { Database, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { Capsule } from "@/components/ui/capsule";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { getBlogRepository, getBlogStorage } from "@/lib/blog/repository";

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

export default async function AdminSettingsPage() {
  const [settings, storageMode] = await Promise.all([
    getBlogRepository().getSettings(),
    Promise.resolve(getBlogStorage()),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Site-wide defaults, analytics placeholders and data-layer status.
        </p>
      </div>

      <SettingsEditor initial={settings} />

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
              <span>Session</span>
              <span>HMAC cookie · {ADMIN_CONFIG.sessionDays}d (30d remember)</span>
            </li>
          </ul>
        </InfoCard>

        <InfoCard Icon={KeyRound} title="Session strategy">
          <p>
            Stateless HMAC-signed cookie (<code className="font-mono text-xs">httpOnly</code>,{" "}
            <code className="font-mono text-xs">sameSite=lax</code>, secure in production). Swap
            path to Supabase Auth: replace <code className="font-mono text-xs">createAdminSession</code>{" "}
            with <code className="font-mono text-xs">supabase.auth.signInWithPassword()</code> — UI unchanged.
          </p>
        </InfoCard>

        <InfoCard Icon={Database} title="Data layer">
          <p>
            Every admin mutation flows through the repository. Flip{" "}
            <code className="font-mono text-xs">BLOG_STORAGE=supabase</code> to switch the admin CMS
            to the live database — the UI is identical either way.
          </p>
          <div className="mt-3">
            <Capsule variant={storageMode === "supabase" ? "success" : "warning"} sm>
              {storageMode === "supabase" ? "Supabase connected" : "Memory store (Supabase-ready)"}
            </Capsule>
          </div>
        </InfoCard>

        <InfoCard Icon={RefreshCw} title="Going live">
          <p>
            1. Run <code className="font-mono text-xs">supabase/schema.sql</code> +{" "}
            <code className="font-mono text-xs">storage.sql</code> in your project. 2. Set the Supabase
            env vars in <code className="font-mono text-xs">.env.local</code>. 3. Run{" "}
            <code className="font-mono text-xs">npm run migrate:blogs -- --apply</code> to import the
            existing 23 posts. 4. Set <code className="font-mono text-xs">BLOG_STORAGE=supabase</code>.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
