import { z } from "zod";
import {
  getUserProgress,
  upsertProgress,
  getChartData,
  getWeeklyActivities,
} from "../services/progressService.js";

// ─── Validation Schemas ─────────────────────────────────────────────────────

// Schema for POST /api/progress/update
const updateProgressSchema = z.object({
  topic: z.string({ required_error: "topic is required" }).min(1),
  progress_percentage: z
    .number({ required_error: "progress_percentage is required" })
    .min(0, "progress_percentage must be >= 0")
    .max(100, "progress_percentage must be <= 100"),
  lessons_completed: z.number().int().min(0).optional(),
  study_time: z.number().min(0).optional(),
  xp: z.number().int().min(0).optional(),
});

// ─── Progress Controller ────────────────────────────────────────────────────
// HTTP handlers for the /api/progress endpoints.
// All routes are protected by authMiddleware, so req.user is always set.

// ─── getProgress ────────────────────────────────────────────────────────────
// GET /api/progress
//
// Returns the authenticated user's aggregated stats and per-topic progress.
// The user ID comes from req.user.id (attached by authMiddleware).
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await getUserProgress(userId);

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    console.error("[GET PROGRESS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};

// ─── updateProgress ─────────────────────────────────────────────────────────
// POST /api/progress/update
//
// Creates or updates a single topic's progress for the authenticated user.
//
// Expected body:
//   { topic, progress_percentage, lessons_completed?, study_time?, xp? }
export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // ── Validate input with Zod ──────────────────────────────────────
    const parsed = updateProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => ({
        field,
        message: messages[0],
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const updated = await upsertProgress(userId, parsed.data);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("[UPDATE PROGRESS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

// ─── getCharts ──────────────────────────────────────────────────────────────
// GET /api/progress/charts
//
// Returns chart datasets (weekly study hours, monthly progress, activity
// breakdown) derived from the authenticated user's progress and quiz data.
export const getCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const charts = await getChartData(userId);

    return res.status(200).json({
      success: true,
      data: charts,
    });
  } catch (err) {
    console.error("[GET CHARTS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chart data",
    });
  }
};

// ─── getWeekly ──────────────────────────────────────────────────────────────
// GET /api/progress/weekly
//
// Returns the authenticated user's weekly activity rows from the
// weekly_activities table.  Each row represents one day's planned and
// completed activities (reading, math, total time, completion count).
export const getWeekly = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getWeeklyActivities(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET WEEKLY ACTIVITIES ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly activities",
    });
  }
};
