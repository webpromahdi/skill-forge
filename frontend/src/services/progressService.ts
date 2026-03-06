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

// ─── Chart types ────────────────────────────────────────────────────────────

export interface WeeklyDataPoint {
  day: string;
  hours: number;
  xp: number;
}

export interface MonthlyDataPoint {
  week: string;
  hours: number;
  lessons: number;
}

export interface ActivityTypePoint {
  name: string;
  value: number;
  color: string;
}

export interface ChartData {
  weeklyData: WeeklyDataPoint[];
  monthlyData: MonthlyDataPoint[];
  activityTypeData: ActivityTypePoint[];
}

interface ChartSuccess {
  success: true;
  data: ChartData;
}

interface ChartError {
  success: false;
  message: string;
}

type ChartResponse = ChartSuccess | ChartError;

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

// ─── getChartData ───────────────────────────────────────────────────────────
// Calls GET /progress/charts. Returns weekly, monthly, and activity
// breakdown datasets for the Progress page charts.
export async function getChartData(): Promise<ChartResponse> {
  try {
    return await apiFetch<ChartResponse>("/progress/charts");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── Weekly activity types ──────────────────────────────────────────────────

export interface WeeklyActivity {
  day: string;
  lessonName: string;
  status: "completed" | "in-progress" | "not-started";
  readingActivities: number;
  mathActivities: number;
  totalTime: string;
  completed: number;
  total: number;
}

interface WeeklySuccess {
  success: true;
  data: WeeklyActivity[];
}

interface WeeklyError {
  success: false;
  message: string;
}

type WeeklyResponse = WeeklySuccess | WeeklyError;

// ─── getWeeklyActivities ────────────────────────────────────────────────────
// Calls GET /progress/weekly.  Returns the user's weekly activity rows
// for the dashboard activity cards and kanban board.
export async function getWeeklyActivities(): Promise<WeeklyResponse> {
  try {
    return await apiFetch<WeeklyResponse>("/progress/weekly");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
