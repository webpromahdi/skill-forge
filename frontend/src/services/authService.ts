// ─── Auth Service ───────────────────────────────────────────────────────────
// Wraps all authentication-related API calls.
// Each function returns a typed result so callers get consistent error handling.

import { API_BASE } from "../lib/api";
import { getToken } from "../utils/auth";

// ─── Types ──────────────────────────────────────────────────────────────────

/** Shape of a single field-level validation error from the backend */
export interface FieldError {
  field: string;
  message: string;
}

/** Successful response envelope */
interface SuccessResponse<T> {
  success: true;
  data: T;
}

/** Error response envelope */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ─── registerUser ───────────────────────────────────────────────────────────
// Sends name, email, and password to POST /auth/register.
// On success the backend creates a Supabase user and returns user data.
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<ApiResponse<{ user: unknown }>> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // Parse the JSON body regardless of status code
    const data = await res.json();
    return data;
  } catch {
    // Network-level failure (server down, CORS blocked, etc.)
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── loginUser ──────────────────────────────────────────────────────────────
// Sends email and password to POST /auth/login.
// On success returns an access_token (JWT) and user object.
export async function loginUser(
  email: string,
  password: string,
): Promise<ApiResponse<{ access_token: string; user: unknown }>> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── getCurrentUser ─────────────────────────────────────────────────────────
// Calls GET /auth/me with the stored JWT in the Authorization header.
// Used by the route guard to verify whether the token is still valid.
export async function getCurrentUser(): Promise<
  ApiResponse<{ user: unknown }>
> {
  try {
    const token = getToken();

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Attach the JWT so Supabase can verify the user server-side
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
