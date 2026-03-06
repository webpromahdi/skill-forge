import supabase from "../database/supabaseClient.js";

// ─── Deadline Service ───────────────────────────────────────────────────────
// Data-access layer for the deadlines table.
// Provides read operations for per-user upcoming learning deadlines
// (quizzes, project submissions, module start dates, etc.).
//
// The UpcomingDeadlines dashboard widget relies on this service to display
// the user's next approaching deadlines sorted by due_date ascending.

// ─── getDeadlines ───────────────────────────────────────────────────────────
// Fetches the next 5 upcoming deadlines for a given user.
// Results are sorted by due_date ascending so the most urgent items
// appear first in the dashboard widget.
export async function getDeadlines(userId) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from("deadlines")
    .select("title, type, due_date, priority")
    .eq("user_id", userId)
    .gte("due_date", today) // only future/today deadlines
    .order("due_date", { ascending: true })
    .limit(5);

  if (error) throw error;
  return data || [];
}
