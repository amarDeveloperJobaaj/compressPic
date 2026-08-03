/**
 * Downloader service layer — swappable, backend-driven.
 *
 * The UI never talks to a specific provider. It calls `requestDownload()`,
 * which forwards to whatever backend is configured via the environment:
 *
 *   NEXT_PUBLIC_DOWNLOADER_API=https://your-server.example/api/download
 *
 * Backend contract (POST JSON):
 *   Body:    { videoId: string; format: "mp4" | "mp3" | "m4a"; quality: string }
 *   Success: 200 { ok: true, url: "<direct download url>" }
 *   Failure: non-200 or { ok: false, message: "..." }
 *
 * When no backend is configured, downloads are intentionally disabled and the
 * UI shows a clear notice — this tool never bypasses YouTube's access controls.
 */

export type DownloadFormat = "mp4" | "mp3" | "m4a";

export interface DownloadRequest {
  videoId: string;
  format: DownloadFormat;
  quality: string;
}

export interface DownloadResponse {
  ok: boolean;
  /** Direct download URL returned by the backend, when available. */
  url?: string;
  message?: string;
}

export interface DownloaderBackend {
  endpoint: string;
  headers?: Record<string, string>;
}

const BACKEND_ENV_KEY = "NEXT_PUBLIC_DOWNLOADER_API";
const REQUEST_TIMEOUT_MS = 30000;

/** Resolve the configured downloader backend (env-driven, swappable later). */
export function getDownloaderBackend(): DownloaderBackend | null {
  const endpoint =
    typeof process !== "undefined" && process.env?.[BACKEND_ENV_KEY]
      ? process.env[BACKEND_ENV_KEY]
      : "";
  if (!endpoint) return null;
  return { endpoint };
}

/** True when a backend is configured and downloads can actually run. */
export function isDownloaderConfigured(): boolean {
  return getDownloaderBackend() !== null;
}

/** Request a download URL from the configured backend. Honest failure when unconfigured. */
export async function requestDownload(req: DownloadRequest): Promise<DownloadResponse> {
  const backend = getDownloaderBackend();
  if (!backend) {
    return { ok: false, message: "The download service is not configured on this site." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(backend.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...backend.headers },
      body: JSON.stringify(req),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false, message: `Download service returned status ${res.status}.` };
    }
    const data = (await res.json()) as DownloadResponse;
    return { ok: Boolean(data.ok && data.url), url: data.url, message: data.message };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "The download request failed.",
    };
  } finally {
    clearTimeout(timer);
  }
}
