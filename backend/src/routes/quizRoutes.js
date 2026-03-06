// ─── Quiz Routes ─────────────────────────────────────────────────────────────
// Maps HTTP endpoints to quiz controller handlers.
//
// Quiz flow:
//   frontend → GET  /api/quizzes          → listQuizzes   (public, optional auth)
//   frontend → GET  /api/quizzes/:quizId  → getQuiz       (public)
//   frontend → POST /api/quizzes/submit   → submitQuiz    (protected by authMiddleware)
//              ↓
//   quizController → quizService → Supabase database → quiz_results → response

import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listQuizzes,
  getQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = Router();

// ─── Optional auth middleware ────────────────────────────────────────────────
// For the quiz list endpoint we want to optionally read the user's JWT so we
// can return their best scores, but we don't want to block unauthenticated
// users from viewing quizzes.
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Delegate to the real middleware — if it fails, just continue without user
    return authMiddleware(req, res, (err) => {
      if (err) {
        req.user = null;
      }
      next();
    });
  }
  req.user = null;
  next();
};

// GET  /api/quizzes           → list all quizzes (with optional best scores)
router.get("/", optionalAuth, listQuizzes);

// GET  /api/quizzes/:quizId   → get quiz + questions
router.get("/:quizId", getQuiz);

// POST /api/quizzes/submit    → score & save results (protected)
router.post("/submit", authMiddleware, submitQuiz);

export default router;
