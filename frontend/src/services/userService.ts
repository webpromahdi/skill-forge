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

/** App-specific profile fields stored in the user_profiles table */
export interface UserProfile {
  id?: string;
  user_id?: string;
  phone_number?: string;
  learning_goal?: string;
  daily_learning_time?: number;
  motivation?: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UpdateProfilePayload = Pick<
  UserProfile,
  "phone_number" | "learning_goal" | "daily_learning_time" | "motivation"
>;

interface GetUserSuccess {
  success: true;
  data: { user: User };
}

interface GetUserError {
  success: false;
  message: string;
}

type GetUserResponse = GetUserSuccess | GetUserError;

interface ProfileSuccess {
  success: true;
  data: UserProfile;
}

interface ProfileError {
  success: false;
  message: string;
}

type ProfileResponse = ProfileSuccess | ProfileError;

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

// ─── getProfile ─────────────────────────────────────────────────────────────
// GET /api/profile
// Returns the user's extended profile row.
// When no row exists yet the backend responds with { onboarding_completed: false }.
export async function getProfile(): Promise<ProfileResponse> {
  try {
    return await apiFetch<ProfileResponse>("/profile");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── createProfile ──────────────────────────────────────────────────────────
// POST /api/profile
// Creates the profile after onboarding. Sets onboarding_completed = true.
export async function createProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  try {
    return await apiFetch<ProfileResponse>("/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── updateProfile ──────────────────────────────────────────────────────────
// PUT /api/profile
// Persists changes made on the Settings page.
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  try {
    return await apiFetch<ProfileResponse>("/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
