import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

// ─── Auth Routes ────────────────────────────────────────────────────────────
// POST /api/auth/register  – Create a new user account
// POST /api/auth/login     – Authenticate and receive a JWT (rate-limited)
// GET  /api/auth/me        – Get the currently authenticated user
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/me", getCurrentUser);

export default router;
