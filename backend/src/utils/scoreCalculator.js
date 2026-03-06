// ─── Score Calculator ────────────────────────────────────────────────────────
// Utility for computing quiz scores and XP rewards.
//
// Quiz flow:  frontend → POST /api/quizzes/submit → quizController
//             → scoreCalculator.calculateScore() → quiz_results table → response
//
// The score percentage drives the XP earned: a perfect score awards the full
// base XP of the quiz, while lower scores earn proportionally less.

/**
 * Compares the user's submitted answers against the correct answers and
 * returns the score breakdown plus XP earned.
 *
 * @param {Array<{questionId: string, selectedOption: string}>} userAnswers
 *   The answers submitted by the user. Each entry contains the question ID
 *   and the letter (A/B/C/D) chosen.
 * @param {Array<{id: string, correct_answer: string}>} correctAnswers
 *   The authoritative answer rows fetched from quiz_questions.
 * @param {number} baseXP
 *   The maximum XP available for this quiz (from the quizzes table).
 *
 * @returns {{ score: number, totalQuestions: number, scorePercentage: number, xpEarned: number }}
 */
export function calculateScore(userAnswers, correctAnswers, baseXP) {
  const totalQuestions = correctAnswers.length;

  // Build a lookup map: questionId → correct letter
  const correctMap = new Map(
    correctAnswers.map((q) => [q.id, q.correct_answer.toUpperCase()]),
  );

  // Count the number of correct responses
  let correctCount = 0;
  for (const answer of userAnswers) {
    const correct = correctMap.get(answer.questionId);
    if (correct && answer.selectedOption.toUpperCase() === correct) {
      correctCount++;
    }
  }

  // Derive percentage and XP
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const xpEarned = Math.round(baseXP * (scorePercentage / 100));

  return {
    score: correctCount,
    totalQuestions,
    scorePercentage,
    xpEarned,
  };
}
