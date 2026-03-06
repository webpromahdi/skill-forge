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
// Controllers call these functions instead of querying Supabase directly,
// keeping HTTP concerns separate from business logic.

import supabase from "../database/supabaseClient.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { getAIRecommendation } from "./aiService.js";

// ─── gatherUserData ─────────────────────────────────────────────────────────
// Collects all learning data needed to build the AI prompt:
//   • Progress rows (completed topics + in-progress topics)
//   • Quiz results (best score per topic)
//   • Learning goal from user metadata (defaults to "General Web Development")
//
// @param {string} userId - The authenticated user's ID
// @returns {Object} { goal, completedTopics, currentProgress, quizScores }
async function gatherUserData(userId) {
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
    goal: "Frontend Developer", // Could be stored in user profile later
    completedTopics,
    currentProgress,
    quizScores,
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

  // Step 4 — Save the recommendation to the database
  const { data: saved, error: saveErr } = await supabase
    .from("recommendations")
    .insert({
      user_id: userId,
      topic: aiResult.next_topic,
      reason: aiResult.reason,
      match_score: aiResult.match_score,
    })
    .select()
    .single();

  if (saveErr) throw saveErr;

  // Step 5 — Fetch matching resources for the recommended topic
  const resources = await fetchMatchingResources(aiResult.next_topic);

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
