import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLearningPathHandler } from "../controllers/learningPathController.js";

const router = Router();

// ─── Learning Path Routes ───────────────────────────────────────────────────
// Protected by authMiddleware — the user must send a valid JWT.
//
// GET /api/learning-path → full curriculum with user-specific progress/status

router.get("/", authMiddleware, getLearningPathHandler);

export default router;
