import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProgress,
  updateProgress,
  getCharts,
} from "../controllers/progressController.js";

const router = Router();

// ─── Progress Routes ────────────────────────────────────────────────────────
// All routes are protected by authMiddleware — the user must send a valid
// JWT in the Authorization header.
//
// GET  /api/progress        → fetch aggregated stats + per-topic progress
// GET  /api/progress/charts → fetch chart datasets (weekly, monthly, activity)
// POST /api/progress/update → create or update a single topic's progress

router.get("/", authMiddleware, getProgress);
router.get("/charts", authMiddleware, getCharts);
router.post("/update", authMiddleware, updateProgress);

export default router;
