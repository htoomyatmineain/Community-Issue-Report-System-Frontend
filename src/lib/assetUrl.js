/**
 * Resolve an asset path returned by the API into a URL the browser can load.
 *
 * The local file-storage backend returns report/resolution photos as
 * server-relative paths like `/uploads/reports/<uuid>.png` (see
 * LocalStorageService). Rendered from the Vite dev origin (or any origin that
 * isn't the API host) those 404, because the files are served by the backend at
 * `<api-origin>/uploads/...`. This prepends that origin, derived from
 * `VITE_API_BASE_URL` by dropping its trailing `/api`.
 *
 * Genuinely external absolute URLs (Supabase storage, `data:`, `blob:`) pass
 * through untouched, as do empty values. An absolute URL whose origin is
 * localhost/127.0.0.1 under some OTHER port is instead treated as stale —
 * see LOCAL_ORIGIN_RE below — and rewritten to the current API origin.
 */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

// Matches an explicit http(s) localhost/127.0.0.1 origin (any port), e.g.
// "http://localhost:8080" — but not a lookalike external host like
// "http://localhost.example.com" (the (?=\/|$) boundary requires the host to
// end right there, not continue into ".example.com").
//
// Local dev's backend port has drifted before (8080 is sometimes held by an
// unrelated service on this machine, forcing 8081) — a URL baked into the
// database while the backend ran on one port can outlive that port. Rather
// than requiring a database fix every time this happens, treat any
// same-machine localhost origin as stale and repoint it at whatever the
// frontend is currently configured to talk to.
const LOCAL_ORIGIN_RE = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?=\/|$)/i;

export function assetUrl(url) {
  if (!url) return url;
  if (LOCAL_ORIGIN_RE.test(url)) {
    return url.replace(LOCAL_ORIGIN_RE, API_ORIGIN);
  }
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_ORIGIN}/${url.replace(/^\/+/, "")}`;
}
