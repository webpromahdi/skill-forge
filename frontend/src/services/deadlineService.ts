// ─── Deadline Service (Frontend) ─────────────────────────────────────────────
// Fetches the authenticated user's upcoming deadlines from the backend.
// The JWT is automatically attached by apiFetch.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** A single deadline returned from GET /api/deadlines */
export interface Deadline {
  title: string;
  type: string; // 'quiz' | 'project' | 'module' etc.
  due_date: string; // ISO date string (YYYY-MM-DD)
  priority: string; // 'high' | 'medium' | 'low'
}

interface DeadlinesSuccess {
  success: true;
  data: Deadline[];
}

interface DeadlinesError {
  success: false;
  message: string;
}

export type DeadlinesResponse = DeadlinesSuccess | DeadlinesError;

// ─── getDeadlines ───────────────────────────────────────────────────────────
// Calls GET /deadlines. Returns the next 5 upcoming deadlines for the
// authenticated user, sorted by due_date ascending (most urgent first).
export async function getDeadlines(): Promise<DeadlinesResponse> {
  try {
    return await apiFetch<DeadlinesResponse>("/deadlines");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
