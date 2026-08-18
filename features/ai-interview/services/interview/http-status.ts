/**
 * Unified error → HTTP status mapping (Phase 12 — security/ownership matrix).
 *
 * Every interview engine error class carries an explicit `name` and a typed
 * `kind`; this single mapping is what the API routes return, so the
 * 401/403/404/409/400/429/500 behavior is centralized and unit-testable
 * (§50 ownership + §12 hardening).
 *
 * Deliberately dependency-free (no server-only imports): the engine error
 * classes all set `error.name`, so the mapping works in plain unit tests by
 * duck-typing instead of importing the server modules.
 *
 *   QuestionEngineError:  validation→400, forbidden→403, not_found→404,
 *                         invalid_state→409
 *   EvaluationStoreError: forbidden→403, not_found→404
 *   ReportEngineError:    forbidden→403, not_found→404, invalid_state→409
 *   anything else         → 500
 */
export function toHttpStatus(error: unknown): number {
  const kind = (error as { kind?: string } | null)?.kind;
  const name = error instanceof Error ? error.name : "";

  switch (name) {
    case "QuestionEngineError":
      switch (kind) {
        case "forbidden":
          return 403;
        case "not_found":
          return 404;
        case "validation":
          return 400;
        default:
          return 409;
      }
    case "EvaluationStoreError":
      return kind === "forbidden" ? 403 : 404;
    case "ReportEngineError":
      return kind === "forbidden" ? 403 : kind === "not_found" ? 404 : 409;
    default:
      return 500;
  }
}
