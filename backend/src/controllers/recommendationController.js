// ─── Recommendation Controller ───────────────────────────────────────────────
// HTTP handlers for the /api/recommendations endpoints.
//
// AI Recommendation Workflow (this file handles the HTTP layer):
//   POST /api/recommendations/generate → generate()
//     1. Auth middleware ensures user is logged in
//     2. Calls recommendationService.generateRecommendation(userId)
//     3. Returns the AI-generated recommendation with matching resources
//     4. On AI failure → returns a graceful error message (not a 500 crash)
//
//   GET /api/recommendations → getRecommendations()
//     1. Auth middleware ensures user is logged in
//     2. Calls recommendationService.getLatestRecommendation(userId)
//     3. Returns the most recent recommendation with matching resources
//
//   POST /api/recommendations/generate-resources → generateResources()
//     1. Auth middleware ensures user is logged in
//     2. Detects user goal → fetches learning path → extracts phases
//     3. Sends phases to AI for structured resource generation
//     4. Stores resources in recommendation_resources table
//     5. Returns resources grouped by skill → phase → resources
//
//   GET /api/recommendations/resources → getResources()
//     1. Returns stored phase resources for the user's goal

import {
  generateRecommendation,
  getLatestRecommendation,
  generatePhaseResources,
  getPhaseResources,
} from "../services/recommendationService.js";

// ─── generate ───────────────────────────────────────────────────────────────
// POST /api/recommendations/generate
// Protected — requires valid JWT.
//
// Triggers the full AI pipeline: gather data → build prompt → call AI →
// save recommendation → fetch resources → respond.
//
// Handles AI failures gracefully: the user sees a helpful error message
// instead of an opaque 500.
export const generate = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendation = await generateRecommendation(userId);

    return res.status(201).json({
      success: true,
      data: recommendation,
    });
  } catch (err) {
    console.error("[GENERATE RECOMMENDATION ERROR]", err.message);

    // ── Graceful AI failure handling ─────────────────────────────────
    // If the AI service itself failed (API key missing, network error,
    // bad response), return a 503 with a user-friendly message so the
    // frontend can show a fallback UI instead of a generic error.
    if (
      err.message.includes("GLM") ||
      err.message.includes("Ollama") ||
      err.message.includes("AI")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendation",
    });
  }
};

// ─── getRecommendations ─────────────────────────────────────────────────────
// GET /api/recommendations
// Protected — requires valid JWT.
//
// Returns the user's most recent recommendation with its matched resources.
// If no recommendation exists yet, returns null with a hint to generate one.
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendation = await getLatestRecommendation(userId);

    return res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (err) {
    console.error("[GET RECOMMENDATIONS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};

// ─── generateResources ──────────────────────────────────────────────────────
// POST /api/recommendations/generate-resources
// Protected — requires valid JWT.
//
// Triggers AI-powered resource generation for each phase of the user's
// learning path. Returns structured resources grouped by phase.
export const generateResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await generatePhaseResources(userId);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[GENERATE RESOURCES ERROR]", err.message);

    if (
      err.message.includes("GLM") ||
      err.message.includes("Ollama") ||
      err.message.includes("AI")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate resources",
    });
  }
};

// ─── getResources ───────────────────────────────────────────────────────────
// GET /api/recommendations/resources
// Protected — requires valid JWT.
//
// Returns stored phase resources for the user's current learning goal.
export const getResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getPhaseResources(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[GET RESOURCES ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};
