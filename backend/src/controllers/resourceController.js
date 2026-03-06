// ─── Resource Controller ─────────────────────────────────────────────────────
// HTTP handler for the /api/resources endpoint.
//
// Flow: frontend request → resourceRoutes → resourceController
//       → resourceService → Supabase database → JSON response

import { getAllResources } from "../services/resourceService.js";

// ─── getResources ───────────────────────────────────────────────────────────
// GET /api/resources
// GET /api/resources?type=videos
// GET /api/resources?topic=javascript
// GET /api/resources?type=articles&topic=css
//
// Returns all resources, optionally filtered by type and/or topic
// using query parameters.
export const getResources = async (req, res) => {
  try {
    const { topic, type } = req.query;

    const resources = await getAllResources({ topic, type });

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (err) {
    console.error("[GET RESOURCES ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};
