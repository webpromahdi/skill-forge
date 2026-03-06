// ─── Auth Utilities ─────────────────────────────────────────────────────────
// Lightweight helpers for managing the JWT token in localStorage.
// These are used by components and the route guard to check auth state.

const TOKEN_KEY = "token";

/**
 * Retrieve the stored JWT access token.
 * Returns null when the user is not logged in.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persist the JWT access token after a successful login.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the token and effectively log the user out.
 * Call this on explicit logout or when a 401 is received.
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Quick check — returns true when a token exists.
 * Does NOT verify the token's validity on the server;
 * for that, call getCurrentUser() from the auth service.
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
