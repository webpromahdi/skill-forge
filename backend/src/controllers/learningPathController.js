import { getAllGoals, getSkillPath } from "../services/learningPathService.js";

// ─── Learning Path Controller ───────────────────────────────────────────────
// HTTP handlers for the /api/learning-path endpoints.

// ─── getGoalsHandler ────────────────────────────────────────────────────────
// GET /api/learning-path/goals
// Returns all available learning goals.
export const getGoalsHandler = async (_req, res) => {
  try {
    const goals = await getAllGoals();
    return res.status(200).json({ success: true, data: goals });
  } catch (err) {
    console.error("[GET GOALS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning goals",
    });
  }
};

// ─── getSkillPathHandler ────────────────────────────────────────────────────
// GET /api/learning-path?skill=Frontend%20Web%20Development
// Returns the learning path for the given skill/goal.
export const getSkillPathHandler = async (req, res) => {
  try {
    const skill = req.query.skill;
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: skill",
      });
    }

    const path = await getSkillPath(skill);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: `No learning path found for "${skill}"`,
      });
    }

    return res.status(200).json({ success: true, data: path });
  } catch (err) {
    console.error("[GET SKILL PATH ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning path",
    });
  }
};
