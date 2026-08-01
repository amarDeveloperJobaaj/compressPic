/**
 * Builds the sandboxed preview document for the HTML/CSS/JS playground and
 * injects a console-capture bridge so logs/errors inside the iframe are
 * relayed to the parent via postMessage.
 */

export interface ConsoleEntry {
  id: number;
  method: "log" | "warn" | "error" | "info" | "debug";
  args: string[];
  time: number;
}

/** Format a single value the way DevTools would (best effort). */
function formatArg(value: unknown): string {
  try {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "function") return `ƒ ${value.name || "anonymous"}()`;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    if (typeof value === "object") return JSON.stringify(value, null, 0);
    return String(value);
  } catch {
    return String(value);
  }
}

/** Serialize an arguments array into printable strings (cyclic-safe). */
export function serializeArgs(args: unknown[]): string[] {
  const seen = new WeakSet<object>();
  const safe = (value: unknown): string => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return formatArg(value);
  };
  return args.map(safe);
}

/** Injected into the preview <head> — captures console + runtime errors. */
export const CONSOLE_BRIDGE_SCRIPT = `
<script>
(function () {
  function send(method, args) {
    var formatted;
    try {
      formatted = args.map(function (a) {
        if (a === null) return "null";
        if (a === undefined) return "undefined";
        if (typeof a === "function") return "\\u0192 " + (a.name || "anonymous") + "()";
        if (a instanceof Error) return a.name + ": " + a.message;
        if (typeof a === "object") {
          try { return JSON.stringify(a); } catch (e) { return "[Unserializable]"; }
        }
        return String(a);
      });
    } catch (e) { formatted = ["[Error formatting args]"]; }
    window.parent.postMessage({ source: "playground-console", method: method, args: formatted }, "*");
  }
  ["log", "warn", "error", "info", "debug"].forEach(function (m) {
    var original = console[m].bind(console);
    console[m] = function () { send(m, Array.prototype.slice.call(arguments)); original.apply(null, arguments); };
  });
  window.addEventListener("error", function (e) {
    send("error", [e.message, "  at " + (e.filename || "anonymous") + ":" + (e.lineno || 0) + ":" + (e.colno || 0)]);
  });
  window.addEventListener("unhandledrejection", function (e) {
    var reason = e.reason;
    send("error", ["Unhandled rejection: " + (reason && reason.message ? reason.message : String(reason))]);
  });
})();
<\/script>
`;

/** Build the full srcdoc combining html + css + js with the console bridge. */
export function buildPreviewDocument(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
${css}
</style>
${CONSOLE_BRIDGE_SCRIPT}
</head>
<body>
${html}
<script>
(function () {
  try {
${js}
  } catch (err) {
    window.parent.postMessage({ source: "playground-console", method: "error", args: [String(err && err.message ? err.message : err), "  at " + (err && err.stack ? err.stack.split("\\n")[1] || "" : "")] }, "*");
    throw err;
  }
})();
<\/script>
</body>
</html>`;
}
