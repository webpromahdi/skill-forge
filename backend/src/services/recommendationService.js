// ─── Recommendation Service ──────────────────────────────────────────────────
// Data-access layer for the AI recommendation engine.
//
// AI Recommendation Workflow:
//   1. Controller calls generateRecommendation(userId)
//   2. This service gathers user data (progress, quiz scores, completed topics)
//   3. Passes data to promptBuilder → builds prompt text
//   4. Passes prompt to aiService → gets AI response
//   5. Saves the recommendation to the recommendations table
//   6. Fetches matching resources from the resources table
//   7. Returns the full recommendation with attached resources
//
// Phase-based Resource Generation Workflow:
//   1. Controller calls generatePhaseResources(userId)
//   2. Detects user's goal → fetches learning path → extracts phases
//   3. Sends phases to AI model for structured resource generation
//   4. Stores generated resources in recommendation_resources table
//   5. Returns resources grouped by phase
//
// Controllers call these functions instead of querying Supabase directly,
// keeping HTTP concerns separate from business logic.

import supabase from "../database/supabaseClient.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { getAIRecommendation, getAIPhaseResources } from "./aiService.js";

// ─── gatherUserData ─────────────────────────────────────────────────────────
// Collects all learning data needed to build the AI prompt:
//   • Progress rows (completed topics + in-progress topics)
//   • Quiz results (best score per topic)
//   • Learning goal from user metadata (defaults to "General Web Development")
//   • Available topics for the user's goal from learning_topics table
//
// @param {string} userId - The authenticated user's ID
// @returns {Object} { goal, completedTopics, currentProgress, quizScores, availableTopics, goalId }
async function gatherUserData(userId) {
  // ── Fetch user's learning goal from their profile ──────────────────
  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("learning_goal")
    .eq("user_id", userId)
    .maybeSingle();

  const goal = profileRow?.learning_goal || "General Web Development";

  // ── Resolve goal_id from learning_goals table ──────────────────────
  const { data: goalRow } = await supabase
    .from("learning_goals")
    .select("id")
    .eq("name", goal)
    .maybeSingle();

  const goalId = goalRow?.id || null;

  // ── Fetch available topics for this goal ───────────────────────────
  let availableTopics = [];
  if (goalId) {
    const { data: topicRows } = await supabase
      .from("learning_topics")
      .select("title")
      .eq("goal_id", goalId);
    availableTopics = (topicRows || []).map((r) => r.title);
  }

  // ── Fetch user progress rows ───────────────────────────────────────
  const { data: progressRows, error: pErr } = await supabase
    .from("user_progress")
    .select("topic, progress_percentage, status")
    .eq("user_id", userId);

  if (pErr) throw pErr;

  // Separate completed topics from in-progress ones
  const completedTopics = (progressRows || [])
    .filter((r) => r.status === "completed")
    .map((r) => r.topic);

  const currentProgress = (progressRows || [])
    .filter((r) => r.status === "in-progress")
    .map((r) => ({ name: r.topic, progress: r.progress_percentage }));

  // ── Fetch quiz results (best score per topic) ─────────────────────
  const { data: quizResults, error: qErr } = await supabase
    .from("quiz_results")
    .select("quiz_id, score")
    .eq("user_id", userId);

  if (qErr) throw qErr;

  // We need quiz metadata to get topic names and question counts
  const { data: quizzes, error: qzErr } = await supabase
    .from("quizzes")
    .select("id, topic");

  if (qzErr) throw qzErr;

  const { data: questionCounts, error: qcErr } = await supabase
    .from("quiz_questions")
    .select("quiz_id");

  if (qcErr) throw qcErr;

  // Build a quiz_id → question count map
  const countMap = {};
  for (const row of questionCounts || []) {
    countMap[row.quiz_id] = (countMap[row.quiz_id] || 0) + 1;
  }

  // Build a quiz_id → topic map
  const topicMap = {};
  for (const q of quizzes || []) {
    topicMap[q.id] = q.topic;
  }

  // Compute best score percentage per topic
  const bestScores = {};
  for (const r of quizResults || []) {
    const topic = topicMap[r.quiz_id];
    const total = countMap[r.quiz_id] || 1;
    const pct = Math.round((r.score / total) * 100);
    if (!bestScores[topic] || pct > bestScores[topic]) {
      bestScores[topic] = pct;
    }
  }

  const quizScores = Object.entries(bestScores).map(
    ([topic, scorePercentage]) => ({ topic, scorePercentage }),
  );

  return {
    goal,
    goalId,
    completedTopics,
    currentProgress,
    quizScores,
    availableTopics,
  };
}

// ─── generateRecommendation ─────────────────────────────────────────────────
// Orchestrates the full AI recommendation pipeline:
//   1. Gather user data
//   2. Build prompt
//   3. Call AI model
//   4. Save recommendation
//   5. Fetch matching resources
//
// @param {string} userId - The authenticated user's ID
// @returns {Object} { topic, reason, match_score, difficulty, resources }
export async function generateRecommendation(userId) {
  // Step 1 — Gather all user learning data
  const userData = await gatherUserData(userId);

  // Step 2 — Build the AI prompt from the gathered data
  const prompt = buildPrompt(userData);

  // Step 3 — Send prompt to AI model and get recommendation
  const aiResult = await getAIRecommendation(prompt);

  // Step 4 — Validate the AI-suggested topic exists in learning_topics
  let validatedTopic = aiResult.next_topic;
  if (userData.availableTopics.length > 0) {
    const exactMatch = userData.availableTopics.find(
      (t) => t.toLowerCase() === validatedTopic.toLowerCase(),
    );
    if (exactMatch) {
      validatedTopic = exactMatch;
    } else {
      // Fallback: pick the first topic the user hasn't completed
      const fallback = userData.availableTopics.find(
        (t) => !userData.completedTopics.includes(t),
      );
      validatedTopic = fallback || userData.availableTopics[0];
    }
  }

  // Step 5 — Save the recommendation to the database
  const { data: saved, error: saveErr } = await supabase
    .from("recommendations")
    .insert({
      user_id: userId,
      topic: validatedTopic,
      reason: aiResult.reason,
      match_score: aiResult.match_score,
    })
    .select()
    .single();

  if (saveErr) throw saveErr;

  // Step 6 — Fetch matching resources for the recommended topic
  const resources = await fetchMatchingResources(validatedTopic);

  return {
    id: saved.id,
    topic: saved.topic,
    reason: saved.reason,
    match_score: saved.match_score,
    difficulty: aiResult.difficulty,
    created_at: saved.created_at,
    resources,
  };
}

// ─── getLatestRecommendation ────────────────────────────────────────────────
// Returns the most recent recommendation for the given user, along with
// matching resources.  Returns null if the user has no recommendations yet.
//
// @param {string} userId - The authenticated user's ID
// @returns {Object|null} Latest recommendation with resources, or null
export async function getLatestRecommendation(userId) {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  // Attach matching resources
  const resources = await fetchMatchingResources(data.topic);

  return {
    id: data.id,
    topic: data.topic,
    reason: data.reason,
    match_score: data.match_score,
    created_at: data.created_at,
    resources,
  };
}

// ─── fetchMatchingResources ─────────────────────────────────────────────────
// Queries the resources table for entries whose topic partially matches the
// recommended topic (case-insensitive).
//
// @param {string} topic - The recommended topic name
// @returns {Array} Matching resource rows
async function fetchMatchingResources(topic) {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .ilike("topic", `%${topic}%`)
    .order("rating", { ascending: false });

  if (error) {
    console.error("[FETCH MATCHING RESOURCES ERROR]", error.message);
    return [];
  }

  return data || [];
}

// ─── generatePhaseResources ─────────────────────────────────────────────────
// Generates AI-powered learning resources for each phase of a user's learning path.
//
// Workflow:
//   1. Detect user's selected goal from their profile
//   2. Fetch the learning path (skill_paths) for that goal
//   3. Extract phases from the learning path
//   4. Send phases to AI model for structured resource generation
//   5. Store generated resources in recommendation_resources table
//   6. Return resources grouped by phase
//
// @param {string} userId - The authenticated user's ID
// @returns {Object} { skill, phases: [{ title, resources: [...] }] }
export async function generatePhaseResources(userId) {
  // Step 1 — Get user's learning goal
  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("learning_goal")
    .eq("user_id", userId)
    .maybeSingle();

  const goal = profileRow?.learning_goal || "Frontend Web Development";

  // Step 2 — Fetch the learning path for this goal
  const { data: skillPath, error: spErr } = await supabase
    .from("skill_paths")
    .select("skill, duration, phases")
    .eq("skill", goal)
    .maybeSingle();

  if (spErr) throw spErr;

  if (!skillPath) {
    throw new Error(`No learning path found for goal: ${goal}`);
  }

  // Step 3 — Extract phases
  const phases =
    typeof skillPath.phases === "string"
      ? JSON.parse(skillPath.phases)
      : skillPath.phases;

  if (!phases || phases.length === 0) {
    throw new Error(`No phases found in learning path for: ${goal}`);
  }

  // Step 4 — Send phases to AI model for resource generation
  const aiResources = await getAIPhaseResources(goal, phases);

  // Step 5 — Clear old resources for this skill and store new ones
  await supabase.from("recommendation_resources").delete().eq("skill", goal);

  const rowsToInsert = [];
  for (const phase of aiResources) {
    for (const resource of phase.resources) {
      rowsToInsert.push({
        skill: goal,
        phase_title: phase.title,
        resource_type: resource.type,
        source: resource.source,
        title: resource.title,
        url: resource.url,
      });
    }
  }

  if (rowsToInsert.length > 0) {
    const { error: insertErr } = await supabase
      .from("recommendation_resources")
      .upsert(rowsToInsert, { onConflict: "skill,phase_title,resource_type" });

    if (insertErr) throw insertErr;
  }

  // Step 6 — Return structured response
  return {
    skill: goal,
    duration: skillPath.duration,
    phases: aiResources,
  };
}

// ─── getPhaseResources ──────────────────────────────────────────────────────
// Fetches previously generated phase resources for a user's goal.
//
// @param {string} userId - The authenticated user's ID
// @returns {Object|null} { skill, phases: [...] } or null if none yet
export async function getPhaseResources(userId) {
  // Get user's learning goal
  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("learning_goal")
    .eq("user_id", userId)
    .maybeSingle();

  const goal = profileRow?.learning_goal || "Frontend Web Development";

  // Fetch the skill path for duration info
  const { data: skillPath } = await supabase
    .from("skill_paths")
    .select("duration")
    .eq("skill", goal)
    .maybeSingle();

  // Fetch stored resources for this skill
  const { data: resources, error } = await supabase
    .from("recommendation_resources")
    .select("*")
    .eq("skill", goal)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!resources || resources.length === 0) return null;

  // Group resources by phase_title
  const phaseMap = new Map();
  for (const r of resources) {
    if (!phaseMap.has(r.phase_title)) {
      phaseMap.set(r.phase_title, {
        title: r.phase_title,
        resources: [],
      });
    }
    phaseMap.get(r.phase_title).resources.push({
      id: r.id,
      type: r.resource_type,
      source: r.source,
      title: r.title,
      url: r.url,
    });
  }

  return {
    skill: goal,
    duration: skillPath?.duration || "",
    phases: Array.from(phaseMap.values()),
  };
}
