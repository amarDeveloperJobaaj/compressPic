/**
 * Shared browser-side API helpers (master spec §48).
 *
 * All interview routes return `{ ok: boolean, error?: string }`; ownership and
 * auth are enforced server-side from the session cookie — never trust a
 * client-sent user id (§50).
 */

export interface ApiFailure {
  ok: false;
  error: string;
  status: number;
}

export type SessionApiResult<T> = { ok: true; data: T } | ApiFailure;

export async function apiRequest<T>(
  url: string,
  init?: RequestInit
): Promise<SessionApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return { ok: false, error: "Network error — check your connection.", status: 0 };
  }
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) {
    return {
      ok: false,
      error: data?.error ?? "Something went wrong.",
      status: res.status,
    };
  }
  return { ok: true, data: data as T };
}

export function postJson<T>(url: string, body: unknown): Promise<SessionApiResult<T>> {
  return apiRequest<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
