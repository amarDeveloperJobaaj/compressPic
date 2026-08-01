"use client";

import { useMemo, useState } from "react";
import { Fingerprint, ShieldCheck, ShieldAlert } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeTextarea } from "../components/CodeTextarea";
import { CodeOutput } from "../components/CodeOutput";
import { CopyButton } from "../components/CopyButton";
import { highlightJson } from "../utils/highlight";

const EXAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNvbXByZXNzUGl4IiwiaWF0IjoxNzU2MDAwMDAwLCJleHAiOjE3NTg2MDAwMDB9.signature-placeholder";

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

/** Pretty-print compact JSON; falls back to the raw string when not parseable. */
function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

interface DecodeResult {
  header: string;
  payload: string;
  signature: string;
  claims: Record<string, unknown>;
}

export function JwtDecoderTool() {
  const [token, setToken] = useState(EXAMPLE);

  const decoded = useMemo<DecodeResult | null>(() => {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return null;
    try {
      const header = prettyJson(base64UrlDecode(parts[0]));
      const payload = prettyJson(base64UrlDecode(parts[1]));
      const claims = JSON.parse(payload) as Record<string, unknown>;
      return { header, payload, signature: parts[2], claims };
    } catch {
      return null;
    }
  }, [token]);

  // Capture the reference time once on mount (lazy initializer — avoids
  // impure Date.now() during render)
  const [now] = useState(() => Date.now() / 1000);

  const claimsInfo = useMemo(() => {
    if (!decoded) return null;
    const info: { label: string; value: string }[] = [];
    const pushDate = (key: string, label: string) => {
      const value = decoded.claims[key];
      if (typeof value === "number") {
        const date = new Date(value * 1000);
        const expired = key === "exp" && now > value;
        const notYet = key === "nbf" && now < value;
        info.push({
          label,
          value: `${date.toLocaleString()}${expired ? " — EXPIRED" : notYet ? " — not yet valid" : ""}`,
        });
      }
    };
    pushDate("exp", "Expiration (exp)");
    pushDate("iat", "Issued at (iat)");
    pushDate("nbf", "Not before (nbf)");
    return info;
  }, [decoded, now]);

  const exp = decoded && typeof decoded.claims.exp === "number" ? decoded.claims.exp : null;
  const expStatus = exp === null ? "unknown" : now > exp ? "expired" : now < exp - 60 * 60 * 24 ? "valid" : "expiring";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ToolPanel title="JWT Token">
        <CodeTextarea value={token} onChange={setToken} rows={4} ariaLabel="JWT token" placeholder="Paste a JWT token…" />
        {decoded ? (
          <div
            className={
              expStatus === "expired"
                ? "mt-4 flex items-center gap-2 rounded-xl border border-error/20 bg-error-light px-4 py-3 text-sm font-medium text-error"
                : "mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success-light px-4 py-3 text-sm font-medium text-success"
            }
            role="status"
          >
            {expStatus === "expired" ? <ShieldAlert className="h-5 w-5 shrink-0" /> : <ShieldCheck className="h-5 w-5 shrink-0" />}
            {expStatus === "expired" ? "Token is expired" : expStatus === "expiring" ? "Token expires soon" : "Token is valid"}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-muted">
            Paste a valid three-part JWT to decode it. Tokens are decoded locally — nothing is sent anywhere.
          </p>
        )}
      </ToolPanel>

      {decoded && (
        <>
          {/* Claims */}
          {claimsInfo && claimsInfo.length > 0 && (
            <ToolPanel title="Registered Claims" description="Human-readable timestamps from the payload.">
              <div className="grid gap-2 sm:grid-cols-2">
                {claimsInfo.map((info) => (
                  <div key={info.label} className="rounded-lg border border-border bg-background px-4 py-3">
                    <p className="text-xs text-text-muted">{info.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-text-primary">{info.value}</p>
                  </div>
                ))}
                {exp !== null && (
                  <div className="rounded-lg border border-border bg-background px-4 py-3">
                    <p className="text-xs text-text-muted">Epoch (unix) exp</p>
                    <p className="mt-0.5 font-mono text-sm font-medium text-text-primary">{exp}</p>
                  </div>
                )}
              </div>
            </ToolPanel>
          )}

          {/* Header */}
          <ToolPanel
            title="Header"
            description="Algorithm and token type."
            actions={<CopyButton text={decoded.header} label="Copy" />}
          >
            <CodeOutput
              html={highlightJson(decoded.header)}
              text={decoded.header}
              title="JWT Header"
              filename="jwt-header.json"
              mime="application/json"
              previewClass="max-h-64"
            />
          </ToolPanel>

          {/* Payload */}
          <ToolPanel
            title="Payload"
            description="Claims contained in the token."
            actions={<CopyButton text={decoded.payload} label="Copy" />}
          >
            <CodeOutput
              html={highlightJson(decoded.payload)}
              text={decoded.payload}
              title="JWT Payload"
              filename="jwt-payload.json"
              mime="application/json"
              previewClass="max-h-80"
            />
          </ToolPanel>

          {/* Signature */}
          <ToolPanel
            title="Signature"
            description="Raw signature segment (not verified — verification needs the secret key)."
            actions={<CopyButton text={decoded.signature} label="Copy" />}
          >
            <div className="break-all rounded-xl border border-border bg-background p-4 font-mono text-[13px] text-text-secondary">
              {decoded.signature || "(empty)"}
              <p className="mt-2 text-xs text-text-muted">
                {decoded.signature.length} characters · decoded locally, signature not cryptographically verified
              </p>
            </div>
          </ToolPanel>

          {/* Raw */}
          <ToolPanel title="Raw Token" actions={<CopyButton text={token.trim()} label="Copy Token" />}>
            <div className="flex flex-wrap items-center gap-1 break-all rounded-xl border border-border bg-background p-4 font-mono text-[13px]">
              <span className="text-rose-500">{token.trim().split(".")[0] ?? ""}</span>
              <span className="text-text-muted">.</span>
              <span className="text-sky-500">{token.trim().split(".")[1] ?? ""}</span>
              <span className="text-text-muted">.</span>
              <span className="text-emerald-600 dark:text-emerald-400">{token.trim().split(".")[2] ?? ""}</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
              <Fingerprint className="h-3.5 w-3.5" />
              Decoded in your browser — the token never leaves your device.
            </p>
          </ToolPanel>
        </>
      )}
    </div>
  );
}
