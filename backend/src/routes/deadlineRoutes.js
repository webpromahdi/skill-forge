import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDeadlinesHandler } from "../controllers/deadlineController.js";

const router = Router();

// ─── Deadline Routes ────────────────────────────────────────────────────────
// Protected by authMiddleware — the user must send a valid JWT.
//
// GET /api/deadlines → next 5 upcoming deadlines for the user, sorted by
//                      due_date ascending (closest deadline first).

router.get("/", authMiddleware, getDeadlinesHandler);

export default router;
