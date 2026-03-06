// ─── Resource Routes ─────────────────────────────────────────────────────────
// Maps HTTP endpoints to resource controller handlers.
//
// Flow: frontend → GET /api/resources → resourceController.getResources
//       → resourceService → Supabase resources table → response
//
// Supports query-parameter filtering:
//   GET /api/resources?type=videos
//   GET /api/resources?topic=javascript

import { Router } from "express";
import { getResources } from "../controllers/resourceController.js";

const router = Router();

// GET /api/resources — fetch all resources (with optional filters)
router.get("/", getResources);

export default router;
