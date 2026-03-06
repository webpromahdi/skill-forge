// ─── User Service ───────────────────────────────────────────────────────────
// Provides a clean API for fetching the authenticated user's profile.
// Uses the apiFetch helper so the JWT is automatically attached.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** The subset of Supabase user data we care about in the UI */
export interface User {
  id: string;
  email: string;
  /** Display name stored in user_metadata during registration */
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface GetUserSuccess {
  success: true;
  data: { user: User };
}

interface GetUserError {
  success: false;
  message: string;
}

type GetUserResponse = GetUserSuccess | GetUserError;

// ─── getCurrentUser ─────────────────────────────────────────────────────────
// Calls GET /auth/me.  The JWT in localStorage is automatically injected
// by apiFetch.  Returns the full user object on success, or an error envelope.
export async function getCurrentUser(): Promise<GetUserResponse> {
  try {
    return await apiFetch<GetUserResponse>("/auth/me");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
