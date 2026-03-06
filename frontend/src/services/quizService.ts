// ─── Quiz Service (Frontend) ─────────────────────────────────────────────────
// Handles all quiz-related API calls from the frontend.
//
// Quiz flow:
//   1. AssessmentsPage mounts → getQuizzes() → GET /api/quizzes
//      Backend returns quiz list with question counts & best scores.
//
//   2. User clicks "Start" → getQuizById(quizId) → GET /api/quizzes/:quizId
//      Backend returns quiz details + questions (correct answers stripped).
//
//   3. User finishes quiz → submitQuiz(quizId, answers) → POST /api/quizzes/submit
//      Backend scores answers, stores result in quiz_results table,
//      returns { score, totalQuestions, scorePercentage, xpEarned }.
//
// The JWT is automatically attached by apiFetch so protected endpoints
// (submit) work seamlessly for logged-in users.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  xp: number;
  questions: number;
  bestScore: number | null;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface QuizDetail {
  quiz: {
    id: string;
    title: string;
    topic: string;
    difficulty: string;
    duration: number;
    xp: number;
  };
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  xpEarned: number;
  correctAnswers: number;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ─── getQuizzes ─────────────────────────────────────────────────────────────
// Fetches the full quiz catalogue. If the user is logged in, their best
// scores are included automatically (backend reads the JWT).
export async function getQuizzes(): Promise<ApiResponse<Quiz[]>> {
  try {
    return await apiFetch<ApiResponse<Quiz[]>>("/quizzes");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── getQuizById ────────────────────────────────────────────────────────────
// Fetches a single quiz with its questions (no correct answers).
export async function getQuizById(
  quizId: string,
): Promise<ApiResponse<QuizDetail>> {
  try {
    return await apiFetch<ApiResponse<QuizDetail>>(`/quizzes/${quizId}`);
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── submitQuiz ─────────────────────────────────────────────────────────────
// Submits the user's answers for scoring.
// answers: [{ questionId, selectedOption }]  where selectedOption is "A"/"B"/"C"/"D"
export async function submitQuiz(
  quizId: string,
  answers: { questionId: string; selectedOption: string }[],
): Promise<ApiResponse<QuizResult>> {
  try {
    return await apiFetch<ApiResponse<QuizResult>>("/quizzes/submit", {
      method: "POST",
      body: JSON.stringify({ quizId, answers }),
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
