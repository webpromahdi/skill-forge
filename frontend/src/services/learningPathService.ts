// ─── Learning Path Service (Frontend) ────────────────────────────────────────
// Fetches the authenticated user's learning path from the backend.
// The JWT is automatically attached by apiFetch.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** A single lesson within a module. */
export interface LPLesson {
  id: string;
  title: string;
  type: "video" | "reading" | "practice" | "quiz";
  /** Duration in minutes. */
  duration: number;
  xp: number;
}

/** Module metadata returned by the API. */
export interface LPModuleInfo {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  difficulty: string;
}

/** A single entry in the learning path response array. */
export interface LPEntry {
  module: LPModuleInfo;
  progress: number;
  status: "completed" | "in-progress" | "not-started" | "locked";
  xp: number;
  lessonsCompleted: number;
  totalLessons: number;
  lessons: LPLesson[];
}

interface LPSuccess {
  success: true;
  data: LPEntry[];
}

interface LPError {
  success: false;
  message: string;
}

export type LPResponse = LPSuccess | LPError;

// ─── getLearningPath ────────────────────────────────────────────────────────
// Calls GET /learning-path.  Returns modules with lessons, progress, and
// computed status (completed | in-progress | not-started | locked).
// React Basics is locked until JavaScript Basics progress >= 70%.
export async function getLearningPath(): Promise<LPResponse> {
  try {
    return await apiFetch<LPResponse>("/learning-path");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
