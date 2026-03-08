import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getGoalsHandler,
  getSkillPathHandler,
} from "../controllers/learningPathController.js";

const router = Router();

// ─── Learning Path Routes ───────────────────────────────────────────────────
// Protected by authMiddleware — the user must send a valid JWT.
//
// GET /api/learning-path/goals       → list of learning goals
// GET /api/learning-path?skill=...   → learning path for a skill

router.get("/goals", authMiddleware, getGoalsHandler);
router.get("/", authMiddleware, getSkillPathHandler);

export default router;
