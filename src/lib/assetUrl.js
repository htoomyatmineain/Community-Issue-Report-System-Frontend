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
 * Already-absolute URLs (Supabase storage, `data:`, `blob:`) pass through
 * untouched, as do empty values.
 */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

export function assetUrl(url) {
  if (!url) return url;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_ORIGIN}/${url.replace(/^\/+/, "")}`;
}
