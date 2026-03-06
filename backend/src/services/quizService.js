// ─── Quiz Service ────────────────────────────────────────────────────────────
// Data-access layer for the quiz system tables: quizzes, quiz_questions,
// and quiz_results.
//
// Quiz flow:  frontend request → quizRoutes → quizController → quizService
//             → Supabase database → response back to frontend
//
// Controllers call these functions instead of querying Supabase directly,
// keeping HTTP concerns separate from data logic.

import supabase from "../database/supabaseClient.js";

// ─── getAllQuizzes ───────────────────────────────────────────────────────────
// Returns the full quiz catalogue with question counts and (optionally)
// the calling user's best score.
export async function getAllQuizzes(userId) {
  // Fetch all quizzes
  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select("*")
    .order("difficulty", { ascending: true });

  if (error) throw error;

  // Fetch question counts per quiz in one query
  const { data: questionCounts, error: qcErr } = await supabase
    .from("quiz_questions")
    .select("quiz_id");

  if (qcErr) throw qcErr;

  // Build a map of quiz_id → number of questions
  const countMap = {};
  for (const row of questionCounts || []) {
    countMap[row.quiz_id] = (countMap[row.quiz_id] || 0) + 1;
  }

  // If a userId was provided, fetch their best scores
  let bestScoreMap = {};
  if (userId) {
    const { data: results, error: rErr } = await supabase
      .from("quiz_results")
      .select("quiz_id, score")
      .eq("user_id", userId);

    if (!rErr && results) {
      for (const r of results) {
        const questions = countMap[r.quiz_id] || 1;
        const pct = Math.round((r.score / questions) * 100);
        if (!bestScoreMap[r.quiz_id] || pct > bestScoreMap[r.quiz_id]) {
          bestScoreMap[r.quiz_id] = pct;
        }
      }
    }
  }

  // Merge everything into a clean response shape
  return (quizzes || []).map((q) => ({
    id: q.id,
    title: q.title,
    topic: q.topic,
    difficulty: q.difficulty,
    duration: q.duration,
    xp: q.xp,
    questions: countMap[q.id] || 0,
    bestScore: bestScoreMap[q.id] ?? null,
  }));
}

// ─── getQuizById ────────────────────────────────────────────────────────────
// Returns a single quiz with its full list of questions (options only, no
// correct answers exposed to the frontend).
export async function getQuizById(quizId) {
  // Fetch the quiz row
  const { data: quiz, error: qErr } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  if (qErr) throw qErr;

  // Fetch associated questions — NOTE: correct_answer is intentionally
  // included here so the controller can use it for scoring if needed,
  // but the controller strips it before sending to the client.
  const { data: questions, error: questErr } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId);

  if (questErr) throw questErr;

  return { quiz, questions: questions || [] };
}

// ─── getCorrectAnswers ──────────────────────────────────────────────────────
// Returns only the id + correct_answer for each question in a quiz.
// Used server-side during scoring — never sent to the client.
export async function getCorrectAnswers(quizId) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, correct_answer")
    .eq("quiz_id", quizId);

  if (error) throw error;
  return data || [];
}

// ─── getQuizXP ──────────────────────────────────────────────────────────────
// Returns the base XP for a quiz. Used by the submit handler.
export async function getQuizXP(quizId) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("xp")
    .eq("id", quizId)
    .single();

  if (error) throw error;
  return data.xp;
}

// ─── saveResult ─────────────────────────────────────────────────────────────
// Inserts a new row into quiz_results after a quiz is submitted.
export async function saveResult(userId, quizId, score, xpEarned) {
  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
