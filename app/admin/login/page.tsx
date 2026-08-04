"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Loader2, LogIn, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridPattern } from "@/components/ui/grid-pattern";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Sanitize the redirect target: local paths only (prevents open redirects).
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Authenticated users skip the login page.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled && data.authenticated) router.replace("/admin/dashboard");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        router.replace(next);
        router.refresh();
      } else {
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
      <BackgroundBeams />
      <GridPattern />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-border/80 bg-surface/80 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" aria-label="Vizo Tool home">
              <Logo size={48} />
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">Admin login</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted">
              <ShieldCheck className="h-4 w-4 text-primary" /> Protected area — Vizo Tool Blog
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium text-text-primary">
                Username
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="vizoadmin"
                  className="h-11 w-full rounded-xl border border-border bg-background/60 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-background/60 pl-10 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-text-secondary">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                Remember me
              </label>
              <button
                type="button"
                disabled
                title="Coming soon"
                className="cursor-not-allowed text-text-muted opacity-70"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="rounded-xl border border-error/40 bg-error-light/60 px-4 py-2.5 text-sm font-medium text-error"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-text-muted">
            Static credentials are validated server-side. Configurable via environment variables.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
