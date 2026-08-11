"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Capsule } from "@/components/ui/capsule";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/ai-interview/hooks/useAuth";

type Mode = "signin" | "signup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Auth card for the interview flow (§49–50): the room only starts for a
 * signed-in user, so every session is scoped to the authenticated user.
 * Handles email-confirmation projects and the Supabase-not-configured case.
 */
export function AuthCard() {
  const router = useRouter();
  const { user, loading, configured, error, submitting, signIn, signUp, signOut, clearError } =
    useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmNotice, setConfirmNotice] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const [nextPath] = useState(() => {
    if (typeof window === "undefined") return "/ai-mock-interview";
    const next = new URLSearchParams(window.location.search).get("next");
    // Relative same-site paths only — reject protocol-relative (//…) and the
    // auth page itself (self-redirect loop).
    return next && next.startsWith("/") && !next.startsWith("//") && next !== "/ai-mock-interview/auth"
      ? next
      : "/ai-mock-interview";
  });

  // Signed in (freshly or already) → continue where the user was heading.
  useEffect(() => {
    if (!loading && user) router.push(nextPath);
  }, [loading, user, nextPath, router]);

  if (!configured) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center">
          <Bot className="mb-4 h-12 w-12 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Sign in is not configured yet</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            Interviews are tied to a signed-in account, but this build has no Supabase keys. Add{" "}
            <code className="rounded bg-border/60 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and{" "}
            <code className="rounded bg-border/60 px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to your local env to enable sign in.
          </p>
          <Button asChild className="mt-6">
            <Link href="/ai-mock-interview">
              Back to AI Interview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (loading) {
    return (
      <AuthShell>
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AuthShell>
    );
  }

  if (user) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
          <h2 className="text-xl font-bold text-text-primary">You&apos;re signed in</h2>
          <p className="mt-2 text-sm text-text-secondary">{user.email}</p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={nextPath}>
                Continue to your interview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
    if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const switchMode = (next: Mode) => {
    clearError();
    setConfirmNotice(false);
    setFieldErrors({});
    setMode(next);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (mode === "signin") {
      await signIn(email, password);
    } else {
      const { needsEmailConfirmation } = await signUp(email, password);
      setConfirmNotice(needsEmailConfirmation);
    }
  };

  return (
    <AuthShell>
      <div className="mb-6 flex rounded-xl border border-border bg-background p-1">
        {(
          [
            { id: "signin", label: "Sign in", icon: LogIn },
            { id: "signup", label: "Create account", icon: UserPlus },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchMode(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              mode === tab.id
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
            aria-pressed={mode === tab.id}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />

        {error && (
          <p role="alert" className="rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        {confirmNotice && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary-light px-4 py-3 text-sm text-text-primary"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Check your inbox — we sent a confirmation link. Sign in once you&apos;ve confirmed your
            email.
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {mode === "signin" ? "Signing in…" : "Creating account…"}
            </span>
          ) : mode === "signin" ? (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Your interviews, reports and history are private to your account.
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Capsule variant="primary" dot className="mb-4">
            Account
          </Capsule>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Sign in to practice
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-lg text-text-secondary">
            Start a mock interview and keep your reports — every session is saved to your account.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-primary/5 sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
