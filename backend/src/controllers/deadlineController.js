import { getDeadlines } from "../services/deadlineService.js";

// ─── Deadline Controller ────────────────────────────────────────────────────
// HTTP handler for the /api/deadlines endpoint.
// All routes are protected by authMiddleware, so req.user is always set.

// ─── getDeadlinesHandler ────────────────────────────────────────────────────
// GET /api/deadlines
//
// Returns the next 5 upcoming deadlines for the authenticated user,
// ordered by due_date ascending (most urgent first).
// The frontend UpcomingDeadlines widget consumes this to show a list of
// approaching quizzes, project submissions, and module start dates.
export const getDeadlinesHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getDeadlines(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET DEADLINES ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch deadlines",
    });
  }
};
