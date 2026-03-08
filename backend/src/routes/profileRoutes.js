import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  fetchProfile,
  createProfile,
  editProfile,
} from "../controllers/profileController.js";

const router = Router();

// ─── Profile Routes ──────────────────────────────────────────────────────────
// All routes are protected by authMiddleware — a valid JWT is required.
//
// GET  /api/profile   → return current user's profile
//                       (returns { onboarding_completed: false } if none exists)
// POST /api/profile   → create / upsert profile after onboarding
// PUT  /api/profile   → update profile fields from Settings page

router.get("/", authMiddleware, fetchProfile);
router.post("/", authMiddleware, createProfile);
router.put("/", authMiddleware, editProfile);

export default router;
