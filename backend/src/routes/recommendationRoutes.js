// ─── Recommendation Routes ───────────────────────────────────────────────────
// Maps HTTP endpoints to recommendation controller handlers.
//
// AI Recommendation Workflow — route layer:
//   POST /api/recommendations/generate           → generate new AI recommendation (protected)
//   GET  /api/recommendations                    → fetch latest recommendation   (protected)
//   POST /api/recommendations/generate-resources  → generate phase-based resources (protected)
//   GET  /api/recommendations/resources           → fetch stored phase resources   (protected)
//
// All endpoints require authentication because recommendations are
// personalized to the logged-in user.

import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generate,
  getRecommendations,
  generateResources,
  getResources,
} from "../controllers/recommendationController.js";

const router = Router();

// POST /api/recommendations/generate — trigger AI recommendation pipeline
router.post("/generate", authMiddleware, generate);

// POST /api/recommendations/generate-resources — trigger AI phase resource generation
router.post("/generate-resources", authMiddleware, generateResources);

// GET /api/recommendations/resources — fetch stored phase resources
router.get("/resources", authMiddleware, getResources);

// GET /api/recommendations — fetch the user's latest recommendation
router.get("/", authMiddleware, getRecommendations);

export default router;
