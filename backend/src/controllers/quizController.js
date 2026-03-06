// ─── Quiz Controller ─────────────────────────────────────────────────────────
// HTTP handlers for the /api/quizzes endpoints.
//
// Quiz flow overview:
//   1. Frontend fetches quiz list       → GET  /api/quizzes
//   2. User starts a quiz               → GET  /api/quizzes/:quizId
//   3. User completes & submits answers → POST /api/quizzes/submit  (protected)
//   4. Backend scores answers, stores result in quiz_results, returns score
//   5. Frontend displays result with score + XP earned

import {
  getAllQuizzes,
  getQuizById,
  getCorrectAnswers,
  getQuizXP,
  saveResult,
} from "../services/quizService.js";
import { calculateScore } from "../utils/scoreCalculator.js";

// ─── listQuizzes ────────────────────────────────────────────────────────────
// GET /api/quizzes
// Returns all available quizzes with question counts and the user's best
// score (if authenticated).
export const listQuizzes = async (req, res) => {
  try {
    // req.user may be set by optional auth; if not, userId is null
    const userId = req.user?.id || null;
    const quizzes = await getAllQuizzes(userId);

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (err) {
    console.error("[LIST QUIZZES ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

// ─── getQuiz ────────────────────────────────────────────────────────────────
// GET /api/quizzes/:quizId
// Returns a single quiz with its questions (correct answers stripped).
export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { quiz, questions } = await getQuizById(quizId);

    // Strip correct_answer before sending to the client so users cannot
    // cheat by inspecting the network response.
    const safeQuestions = questions.map(({ correct_answer, ...rest }) => rest);

    return res.status(200).json({
      success: true,
      data: { quiz, questions: safeQuestions },
    });
  } catch (err) {
    console.error("[GET QUIZ ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

// ─── submitQuiz ─────────────────────────────────────────────────────────────
// POST /api/quizzes/submit   (protected — requires authMiddleware)
//
// Request body:
//   { quizId: string, answers: [{ questionId, selectedOption }] }
//
// Processing:
//   1. Retrieve correct answers from database
//   2. Calculate score using scoreCalculator utility
//   3. Calculate XP earned (baseXP × score%)
//   4. Store result in quiz_results
//   5. Return score breakdown to frontend
export const submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    // ── Validate input ───────────────────────────────────────────────
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: quizId and answers[]",
      });
    }

    // ── 1. Retrieve correct answers from database ────────────────────
    const correctAnswers = await getCorrectAnswers(quizId);

    if (correctAnswers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or has no questions",
      });
    }

    // ── 2 & 3. Calculate score and XP ────────────────────────────────
    const baseXP = await getQuizXP(quizId);
    const result = calculateScore(answers, correctAnswers, baseXP);

    // ── 4. Store result in quiz_results ──────────────────────────────
    await saveResult(userId, quizId, result.score, result.xpEarned);

    // ── 5. Return score breakdown to frontend ────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        score: result.score,
        totalQuestions: result.totalQuestions,
        scorePercentage: result.scorePercentage,
        xpEarned: result.xpEarned,
        correctAnswers: result.totalQuestions, // total possible
      },
    });
  } catch (err) {
    console.error("[SUBMIT QUIZ ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};
