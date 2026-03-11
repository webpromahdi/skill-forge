// ─── API Configuration ──────────────────────────────────────────────────────
// Central place to define the backend base URL.
// All service modules import this constant so the URL is never duplicated.
export const API_BASE = import.meta.env.VITE_API_URL || "/api";

// ─── apiFetch ───────────────────────────────────────────────────────────────
// Generic fetch wrapper that automatically:
//   1. Prepends API_BASE to the endpoint.
//   2. Injects the JWT from localStorage into the Authorization header.
//   3. Defaults Content-Type to application/json.
// Callers can override any header or option through the second argument.
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Attach the Bearer token when one exists
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return res.json();
}
