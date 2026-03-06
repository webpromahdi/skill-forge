import {
  getUserProgress,
  upsertProgress,
  getChartData,
  getWeeklyActivities,
} from "../services/progressService.js";

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
    const { topic, progress_percentage } = req.body;

    // Basic input validation
    if (!topic || progress_percentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: topic and progress_percentage",
      });
    }

    const updated = await upsertProgress(userId, req.body);

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
