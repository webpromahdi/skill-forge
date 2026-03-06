// ─── Progress Service (Frontend) ─────────────────────────────────────────────
// Fetches the authenticated user's learning progress from the backend.
// The JWT is automatically attached by apiFetch.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProgressTopic {
  name: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started" | "locked";
  lessonsCompleted: number;
  studyTime: number;
  xp: number;
}

export interface ProgressStats {
  lessonsCompleted: number;
  studyTime: number;
  streak: number;
  xp: number;
}

export interface ProgressData {
  stats: ProgressStats;
  topics: ProgressTopic[];
}

interface ProgressSuccess {
  success: true;
  data: ProgressData;
}

interface ProgressError {
  success: false;
  message: string;
}

type ProgressResponse = ProgressSuccess | ProgressError;

// ─── getProgress ────────────────────────────────────────────────────────────
// Calls GET /progress.  Returns aggregated stats and per-topic progress.
export async function getProgress(): Promise<ProgressResponse> {
  try {
    return await apiFetch<ProgressResponse>("/progress");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── updateProgress ─────────────────────────────────────────────────────────
// Calls POST /progress/update to upsert a single topic's progress.
export async function updateProgress(body: {
  topic: string;
  progress_percentage: number;
  lessons_completed?: number;
  study_time?: number;
  xp?: number;
}): Promise<ProgressResponse> {
  try {
    return await apiFetch<ProgressResponse>("/progress/update", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
