import supabase from "../database/supabaseClient.js";

// ─── Learning Path Service ──────────────────────────────────────────────────
// Data-access layer for the learning_modules and lessons tables.
// Combines catalogue data with user_progress to produce per-module status,
// completion percentages, and the "locked" gate for React (requires JS ≥ 70%).

// ─── Topic-name mapping ────────────────────────────────────────────────────
// Maps a module title (from the DB) to the corresponding topic name stored
// in user_progress.  This lets us join the two tables without a foreign key.
const TOPIC_MAP = {
  "HTML Fundamentals": "HTML Basics",
  "CSS Fundamentals": "CSS Fundamentals",
  "JavaScript Basics": "JavaScript Basics",
  "React Basics": "React Basics",
};

// ─── getLearningPath ────────────────────────────────────────────────────────
// Returns the full learning path for a user:
//   1. Fetches all modules ordered by order_index.
//   2. Fetches every lesson grouped by module.
//   3. Fetches the user's progress rows from user_progress.
//   4. Computes status / progress / xp per module and applies lock rules.
//
// Lock rule:
//   React Basics is locked until JavaScript Basics progress >= 70%.
export async function getLearningPath(userId) {
  // ── 1. Fetch modules ─────────────────────────────────────────────────
  const { data: modules, error: mErr } = await supabase
    .from("learning_modules")
    .select("*")
    .order("order_index", { ascending: true });

  if (mErr) throw mErr;

  // ── 2. Fetch all lessons (ordered by id to keep insertion order) ──────
  const { data: lessons, error: lErr } = await supabase
    .from("lessons")
    .select("*")
    .order("id", { ascending: true });

  if (lErr) throw lErr;

  // ── 3. Fetch user progress for all topics ────────────────────────────
  const { data: progressRows, error: pErr } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (pErr) throw pErr;

  // Build a lookup: topicName → progress row
  const progressMap = {};
  for (const row of progressRows || []) {
    progressMap[row.topic] = row;
  }

  // ── 4. Assemble the response ─────────────────────────────────────────
  // Determine JS progress first — needed for the React lock gate.
  const jsProgress = progressMap["JavaScript Basics"]?.progress_percentage ?? 0;

  const result = (modules || []).map((mod) => {
    // Lessons belonging to this module
    const modLessons = (lessons || [])
      .filter((l) => l.module_id === mod.id)
      .map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        duration: l.duration,
        xp: l.xp,
      }));

    // Total XP available in the module (sum of lesson XP)
    const totalXp = modLessons.reduce((sum, l) => sum + l.xp, 0);

    // User's progress row for this module's topic
    const topicName = TOPIC_MAP[mod.title] || mod.title;
    const userRow = progressMap[topicName];

    const progressPct = userRow?.progress_percentage ?? 0;
    const lessonsCompleted = userRow?.lessons_completed ?? 0;

    // ── Status logic ───────────────────────────────────────────────────
    // React Basics is locked until JavaScript Basics >= 70%.
    let status;
    if (mod.title === "React Basics" && jsProgress < 70) {
      status = "locked";
    } else if (progressPct >= 100) {
      status = "completed";
    } else if (progressPct > 0) {
      status = "in-progress";
    } else {
      status = "not-started";
    }

    return {
      module: {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        orderIndex: mod.order_index,
        difficulty: mod.difficulty,
      },
      progress: progressPct,
      status,
      xp: userRow?.xp ?? totalXp,
      lessonsCompleted,
      totalLessons: modLessons.length,
      lessons: modLessons,
    };
  });

  return result;
}
