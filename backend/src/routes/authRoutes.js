import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";

const router = Router();

// ─── Auth Routes ────────────────────────────────────────────────────────────
// POST /api/auth/register  – Create a new user account
// POST /api/auth/login     – Authenticate and receive a JWT
// GET  /api/auth/me        – Get the currently authenticated user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);

export default router;
