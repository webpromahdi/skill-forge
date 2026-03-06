import supabase from "../database/supabaseClient.js";

// ─── Progress Service ───────────────────────────────────────────────────────
// Data-access layer for the user_progress table.
// Controllers call these functions instead of querying Supabase directly,
// keeping the business logic separate from HTTP concerns.

// ─── getUserProgress ────────────────────────────────────────────────────────
// Fetches all progress rows for a given user and aggregates them into a
// stats summary + per-topic breakdown.
//
// Returns:
//   { stats: { lessonsCompleted, studyTime, streak, xp }, topics: [...] }
export async function getUserProgress(userId) {
  // Query all progress rows belonging to this user
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .order("last_updated", { ascending: false });

  if (error) throw error;

  // ── Aggregate stats across all topics ────────────────────────────────
  const lessonsCompleted = (data || []).reduce(
    (sum, row) => sum + (row.lessons_completed || 0),
    0,
  );
  const studyTime = (data || []).reduce(
    (sum, row) => sum + (row.study_time || 0),
    0,
  );
  const xp = (data || []).reduce((sum, row) => sum + (row.xp || 0), 0);

  // Streak is derived from consecutive days with activity.
  // For now we count the number of distinct dates in the last 30 days
  // where the user had an update.  A more advanced streak algorithm can
  // replace this later.
  const streak = calculateStreak(data || []);

  // ── Build per-topic list ─────────────────────────────────────────────
  const topics = (data || []).map((row) => ({
    name: row.topic,
    progress: row.progress_percentage,
    status: row.status,
    lessonsCompleted: row.lessons_completed,
    studyTime: row.study_time,
    xp: row.xp,
  }));

  return {
    stats: {
      lessonsCompleted,
      studyTime: Math.round(studyTime * 10) / 10, // one decimal place
      streak,
      xp,
    },
    topics,
  };
}

// ─── upsertProgress ─────────────────────────────────────────────────────────
// Creates or updates a single topic row for the given user.
// Uses Supabase upsert with the (user_id, topic) unique constraint so
// duplicate inserts become updates automatically.
export async function upsertProgress(userId, progressData) {
  const { topic, progress_percentage, lessons_completed, study_time, xp } =
    progressData;

  // Derive a human-readable status from the percentage
  const status =
    progress_percentage >= 100
      ? "completed"
      : progress_percentage > 0
        ? "in-progress"
        : "not-started";

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        topic,
        progress_percentage,
        status,
        lessons_completed: lessons_completed || 0,
        study_time: study_time || 0,
        xp: xp || 0,
        last_updated: new Date().toISOString(),
      },
      { onConflict: "user_id,topic" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── calculateStreak ────────────────────────────────────────────────────────
// Simple streak calculator: counts consecutive days (backward from today)
// that have at least one progress update.
function calculateStreak(rows) {
  if (rows.length === 0) return 0;

  // Collect unique dates (YYYY-MM-DD) from last_updated
  const dates = new Set(
    rows.map((r) => new Date(r.last_updated).toISOString().slice(0, 10)),
  );

  let streak = 0;
  const day = new Date();

  while (true) {
    const key = day.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
