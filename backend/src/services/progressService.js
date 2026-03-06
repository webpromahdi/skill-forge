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

// ─── getChartData ───────────────────────────────────────────────────────────
// Derives chart datasets from user_progress and quiz_results for the
// Progress page charts (weekly study hours, monthly progress, activity
// breakdown).
export async function getChartData(userId) {
  // Fetch user progress rows
  const { data: progressRows, error: pErr } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (pErr) throw pErr;

  // Fetch quiz results for the user
  const { data: quizRows, error: qErr } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", userId);

  if (qErr) throw qErr;

  const rows = progressRows || [];
  const quizzes = quizRows || [];

  // ── Weekly study hours (last 7 days) ─────────────────────────────────
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const dayLabel = dayNames[d.getDay()];

    // Topics whose last_updated falls on this day
    const dayTopics = rows.filter(
      (r) => new Date(r.last_updated).toISOString().slice(0, 10) === dateKey,
    );

    // Quizzes completed on this day
    const dayQuizzes = quizzes.filter(
      (q) => new Date(q.completed_at).toISOString().slice(0, 10) === dateKey,
    );

    const hours = dayTopics.reduce((sum, t) => sum + (t.study_time || 0), 0);
    const xp =
      dayTopics.reduce((sum, t) => sum + (t.xp || 0), 0) +
      dayQuizzes.reduce((sum, q) => sum + (q.xp_earned || 0), 0);

    weeklyData.push({
      day: dayLabel,
      hours: Math.round(hours * 10) / 10,
      xp,
    });
  }

  // ── Monthly progress (last 4 weeks) ──────────────────────────────────
  const monthlyData = [];

  for (let w = 3; w >= 0; w--) {
    const weekEnd = new Date();
    weekEnd.setHours(23, 59, 59, 999);
    weekEnd.setDate(weekEnd.getDate() - w * 7);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekTopics = rows.filter((r) => {
      const updated = new Date(r.last_updated);
      return updated >= weekStart && updated <= weekEnd;
    });

    const hours = weekTopics.reduce((sum, t) => sum + (t.study_time || 0), 0);
    const lessons = weekTopics.reduce(
      (sum, t) => sum + (t.lessons_completed || 0),
      0,
    );

    monthlyData.push({
      week: `W${4 - w}`,
      hours: Math.round(hours * 10) / 10,
      lessons,
    });
  }

  // ── Activity breakdown ───────────────────────────────────────────────
  const totalLessons = rows.reduce((s, r) => s + (r.lessons_completed || 0), 0);
  const totalStudyHours = rows.reduce((s, r) => s + (r.study_time || 0), 0);
  const totalQuizzes = quizzes.length;

  const activityTotal = totalLessons + totalQuizzes + totalStudyHours;

  const activityTypeData =
    activityTotal > 0
      ? [
          {
            name: "Lessons",
            value: Math.round((totalLessons / activityTotal) * 100),
            color: "#3B82F6",
          },
          {
            name: "Quizzes",
            value: Math.round((totalQuizzes / activityTotal) * 100),
            color: "#10B981",
          },
          {
            name: "Practice",
            value: Math.round((totalStudyHours / activityTotal) * 100),
            color: "#F59E0B",
          },
        ]
      : [
          { name: "Lessons", value: 0, color: "#3B82F6" },
          { name: "Quizzes", value: 0, color: "#10B981" },
          { name: "Practice", value: 0, color: "#F59E0B" },
        ];

  // Ensure percentages sum to 100 when there is data
  if (activityTotal > 0) {
    const sum = activityTypeData.reduce((s, a) => s + a.value, 0);
    if (sum !== 100) {
      activityTypeData[0].value += 100 - sum;
    }
  }

  return { weeklyData, monthlyData, activityTypeData };
}

// ─── getWeeklyActivities ────────────────────────────────────────────────────
// Fetches the weekly_activities rows for a given user.
// The weekly_activities table stores per-day activity snapshots (lesson name,
// reading / math counts, total time, completion counts, and status).
// Results are ordered by created_at so the dashboard displays them in
// chronological order.
export async function getWeeklyActivities(userId) {
  const { data, error } = await supabase
    .from("weekly_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Map snake_case DB columns to camelCase for the frontend
  return (data || []).map((row) => ({
    day: row.day,
    lessonName: row.lesson_name,
    status: row.status,
    readingActivities: row.reading_activities,
    mathActivities: row.math_activities,
    totalTime: `${row.total_time} Min`,
    completed: row.completed,
    total: row.total,
  }));
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
