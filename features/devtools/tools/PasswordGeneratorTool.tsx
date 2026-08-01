"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CopyButton } from "../components/CopyButton";
import { Slider, Toggle } from "../components/controls";
import { cn } from "@/lib/utils";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = /[il1LoO0]/g;

function getRandomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean
): string {
  let pool = "";
  if (useUpper) pool += UPPERCASE;
  if (useLower) pool += LOWERCASE;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;
  if (pool.length === 0) return "";

  if (excludeSimilar) {
    pool = pool.replace(SIMILAR, "");
    if (pool.length === 0) return "";
  }

  const chars: string[] = [];
  // Guarantee at least one char from each selected set when length allows
  const cleanSets = [UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS]
    .map((set, index) => {
      const enabled = [useUpper, useLower, useNumbers, useSymbols][index];
      return enabled ? (excludeSimilar ? set.replace(SIMILAR, "") : set) : "";
    })
    .filter((set) => set.length > 0);

  for (let i = 0; i < length; i++) {
    if (i < cleanSets.length) {
      chars.push(cleanSets[i][getRandomInt(cleanSets[i].length)]);
    } else {
      chars.push(pool[getRandomInt(pool.length)]);
    }
  }
  // Shuffle to avoid a predictable prefix of set-guaranteed chars
  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function entropyBits(length: number, poolSize: number): number {
  if (poolSize === 0 || length === 0) return 0;
  return Math.round(length * Math.log2(poolSize));
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [show, setShow] = useState(false);
  // A nonce bumps regeneration without calling setState from an effect.
  const [nonce, setNonce] = useState(0);

  const poolSize = useMemo(() => {
    let pool = "";
    if (useUpper) pool += UPPERCASE;
    if (useLower) pool += LOWERCASE;
    if (useNumbers) pool += NUMBERS;
    if (useSymbols) pool += SYMBOLS;
    if (excludeSimilar) pool = pool.replace(SIMILAR, "");
    return pool.length;
  }, [useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  const entropy = useMemo(() => entropyBits(length, poolSize), [length, poolSize]);

  const strength = useMemo(() => {
    if (entropy >= 100) return { label: "Very Strong", level: 4, color: "bg-emerald-500" };
    if (entropy >= 70) return { label: "Strong", level: 3, color: "bg-green-500" };
    if (entropy >= 45) return { label: "Fair", level: 2, color: "bg-amber-500" };
    return { label: "Weak", level: 1, color: "bg-error" };
  }, [entropy]);

  const password = useMemo(
    () => generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar, nonce]
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ToolPanel title="Generated Password">
        <div className="relative">
          <div className="flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <span className="break-all font-mono text-lg text-text-primary">
              {show ? password : "•".repeat(Math.max(8, password.length))}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <CopyButton text={password} label="Copy" />
              <button
                type="button"
                onClick={() => setNonce((n) => n + 1)}
                aria-label="Regenerate password"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Strength meter */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-text-primary">Strength</span>
            <span className="font-semibold" style={{ color: `var(--color-${strength.level >= 4 ? "success" : strength.level === 1 ? "error" : strength.level === 2 ? "warning" : "success"})` }}>
              {strength.label}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  i <= strength.level ? strength.color : "bg-border"
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Entropy: <span className="font-semibold text-text-primary">{entropy} bits</span> — higher is harder to brute-force.
          </p>
        </div>
      </ToolPanel>

      <ToolPanel title="Options">
        <div className="space-y-4">
          <Slider label="Length" value={length} min={4} max={64} onChange={setLength} suffix=" chars" />

          <div className="grid gap-1 sm:grid-cols-2">
            <Toggle label="Uppercase (A–Z)" checked={useUpper} onChange={setUseUpper} />
            <Toggle label="Lowercase (a–z)" checked={useLower} onChange={setUseLower} />
            <Toggle label="Numbers (0–9)" checked={useNumbers} onChange={setUseNumbers} />
            <Toggle label="Symbols (!@#$…)" checked={useSymbols} onChange={setUseSymbols} />
          </div>

          <div className="border-t border-border pt-4">
            <Toggle label="Exclude similar characters (i, l, 1, O, 0)" checked={excludeSimilar} onChange={setExcludeSimilar} />
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
