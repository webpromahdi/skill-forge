import { z } from "zod";
import {
  getProfile,
  upsertProfile,
  updateProfile,
} from "../services/profileService.js";

// ─── Validation Schemas ──────────────────────────────────────────────────────

const profileBodySchema = z.object({
  phone_number: z.string().max(30).optional(),
  learning_goal: z.string().max(100).optional(),
  daily_learning_time: z.number().int().min(0).max(1440).optional(),
  motivation: z.string().max(500).optional(),
});

// ─── Profile Controller ──────────────────────────────────────────────────────
// HTTP handlers for the /api/profile endpoints.
// All routes are protected by authMiddleware, so req.user is always set.

// ─── fetchProfile ────────────────────────────────────────────────────────────
// GET /api/profile
//
// Returns the authenticated user's profile row.
// When no row exists yet (new user) returns { onboarding_completed: false }.
export const fetchProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await getProfile(userId);

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: { onboarding_completed: false },
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("[GET PROFILE ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ─── createProfile ───────────────────────────────────────────────────────────
// POST /api/profile
//
// Creates (or upserts) the profile after onboarding.
// Sets onboarding_completed = true.
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const parsed = profileBodySchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => ({
        field,
        message: messages[0],
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const profile = await upsertProfile(userId, parsed.data);

    return res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("[CREATE PROFILE ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
    });
  }
};

// ─── editProfile ─────────────────────────────────────────────────────────────
// PUT /api/profile
//
// Partially updates the authenticated user's profile from the Settings page.
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const parsed = profileBodySchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => ({
        field,
        message: messages[0],
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const profile = await updateProfile(userId, parsed.data);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("[UPDATE PROFILE ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
