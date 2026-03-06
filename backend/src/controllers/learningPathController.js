import { getLearningPath } from "../services/learningPathService.js";

// ─── Learning Path Controller ───────────────────────────────────────────────
// HTTP handlers for the /api/learning-path endpoints.
// All routes are protected by authMiddleware, so req.user is always set.

// ─── getLearningPathHandler ─────────────────────────────────────────────────
// GET /api/learning-path
//
// Returns every module in order, each enriched with:
//   • progress percentage from user_progress
//   • computed status (completed | in-progress | not-started | locked)
//   • full list of lessons belonging to the module
//
// The React Basics module is locked until JavaScript Basics >= 70%.
export const getLearningPathHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getLearningPath(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET LEARNING PATH ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning path",
    });
  }
};
