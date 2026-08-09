import { NextResponse } from "next/server";

/**
 * Server-side URL fetcher used by the SEO analysis tools (Meta Tag Analyzer,
 * Heading Checker). Fetching on the server avoids browser CORS entirely and
 * lets us follow redirects with a realistic User-Agent — far more reliable
 * than the public proxy approach the client used before.
 */

const TIMEOUT_MS = 12000;
const MAX_BYTES = 2_000_000; // 2 MB cap — meta analysis only needs the head
const MAX_REDIRECTS = 5;

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/** Block obvious localhost / private / reserved addresses (SSRF guard). */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }
  // IPv6 loopback / unspecified
  if (host.startsWith("[") && (host.includes("::1") || host.startsWith("[::]") || host.startsWith("[0:0:0:0:0:0:0:0]"))) {
    return true;
  }
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)) {
      return true;
    }
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") ?? "";

  let target: URL;
  try {
    target = new URL(raw.trim());
  } catch {
    return NextResponse.json({ error: "Enter a valid URL starting with http:// or https://" }, { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "Only http:// and https:// URLs are supported." }, { status: 400 });
  }
  if (isBlockedHost(target.hostname)) {
    return NextResponse.json({ error: "This URL is not allowed (private or local addresses are blocked)." }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Follow redirects manually so every hop's hostname is validated — a
    // public URL that 302s to a private address must never be followed.
    let current = target.toString();
    let res: Response | null = null;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      res = await fetch(current, {
        headers: BROWSER_HEADERS,
        signal: controller.signal,
        cache: "no-store",
        redirect: "manual",
      });
      if (res.status < 300 || res.status >= 400) break;
      const location = res.headers.get("location");
      if (!location) break;
      const next = new URL(location, current);
      if (next.protocol !== "http:" && next.protocol !== "https:") {
        return NextResponse.json({ error: "The page redirected to an unsupported protocol." }, { status: 400 });
      }
      if (isBlockedHost(next.hostname)) {
        return NextResponse.json({ error: "The page redirected to a blocked address." }, { status: 400 });
      }
      current = next.toString();
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        { error: `The page returned HTTP ${res?.status ?? 0}. It may block automated requests.` },
        { status: 502 }
      );
    }
    // Read only the first MAX_BYTES so huge pages can't exhaust memory.
    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "The page returned no readable content." }, { status: 502 });
    }
    let text = "";
    const decoder = new TextDecoder();
    while (text.length < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    reader.cancel().catch(() => {});
    if (text.length < 50) {
      return NextResponse.json({ error: "The page returned no readable content." }, { status: 502 });
    }
    return NextResponse.json({ html: text });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "The page took too long to respond — try again or paste the HTML source." }, { status: 504 });
    }
    return NextResponse.json({ error: "Could not reach the page. Try pasting the HTML source instead." }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
