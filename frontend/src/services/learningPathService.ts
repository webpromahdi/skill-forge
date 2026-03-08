// ─── Learning Path Service (Frontend) ────────────────────────────────────────
// Fetches learning goals and skill-based learning paths from the backend.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** A learning goal definition. */
export interface LearningGoal {
  id: string;
  name: string;
  description: string;
}

/** A skill-based learning path. */
export interface SkillPath {
  id: string;
  skill: string;
  duration: string;
  phases: string[];
}

// ─── Response types ─────────────────────────────────────────────────────────

interface GoalsSuccess {
  success: true;
  data: LearningGoal[];
}

interface GoalsError {
  success: false;
  message: string;
}

export type GoalsResponse = GoalsSuccess | GoalsError;

interface SkillPathSuccess {
  success: true;
  data: SkillPath;
}

interface SkillPathError {
  success: false;
  message: string;
}

export type SkillPathResponse = SkillPathSuccess | SkillPathError;

// ─── getGoals ───────────────────────────────────────────────────────────────
// Calls GET /learning-path/goals.  Returns all learning goals.
export async function getGoals(): Promise<GoalsResponse> {
  try {
    return await apiFetch<GoalsResponse>("/learning-path/goals");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── getSkillPath ───────────────────────────────────────────────────────────
// Fetches the learning path for a given skill/goal name.
export async function getSkillPath(skill: string): Promise<SkillPathResponse> {
  try {
    return await apiFetch<SkillPathResponse>(
      `/learning-path?skill=${encodeURIComponent(skill)}`,
    );
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
