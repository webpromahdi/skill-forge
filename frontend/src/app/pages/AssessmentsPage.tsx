// ─── Assessments Page ────────────────────────────────────────────────────────
// Full quiz flow:
//   1. Page mounts → getQuizzes() → GET /api/quizzes → renders quiz cards
//   2. User clicks "Start" → getQuizById(id) → GET /api/quizzes/:id
//      → renders questions one-by-one
//   3. User finishes → submitQuiz(id, answers) → POST /api/quizzes/submit
//      → backend scores, stores in quiz_results → displays result with XP

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import {
  ClipboardCheck,
  Clock,
  Zap,
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Loader2,
} from "lucide-react";
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  type Quiz,
  type QuizQuestion,
  type QuizResult,
} from "../../services/quizService";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

// Map option index (0-3) to the letter the backend expects
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type View = "list" | "quiz" | "result";

export function AssessmentsPage() {
  // ── Quiz list state ──────────────────────────────────────────────────
  const [view, setView] = useState<View>("list");
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // ── Active quiz state ────────────────────────────────────────────────
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  // ── Quiz interaction state ───────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // ── Result state ─────────────────────────────────────────────────────
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch quiz list on mount ─────────────────────────────────────────
  // Flow: frontend → GET /api/quizzes → backend → Supabase quizzes table
  useEffect(() => {
    async function fetchQuizzes() {
      setListLoading(true);
      const res = await getQuizzes();
      if (res.success) {
        setQuizList(res.data);
        setListError(null);
      } else {
        setListError(res.message);
      }
      setListLoading(false);
    }
    fetchQuizzes();
  }, []);

  // ── Start quiz: fetch questions from API ─────────────────────────────
  // Flow: frontend → GET /api/quizzes/:quizId → backend → Supabase
  //       quiz_questions table → returns questions (no correct answers)
  const startQuiz = async (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizLoading(true);
    setView("quiz");

    const res = await getQuizById(quiz.id);
    if (res.success) {
      setQuestions(res.data.questions);
      setCurrentQuestion(0);
      setAnswers(new Array(res.data.questions.length).fill(null));
      setSelectedOption(null);
    } else {
      // If questions fail to load, go back to list
      setView("list");
      setListError(res.message);
    }
    setQuizLoading(false);
  };

  // ── Navigate between questions ───────────────────────────────────────
  const handleNext = async () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1]);
    } else {
      // ── Last question → submit quiz ────────────────────────────────
      // Flow: frontend → POST /api/quizzes/submit → backend
      //       → scoreCalculator → quiz_results table → response
      const finalAnswers = [...answers];
      if (selectedOption !== null) {
        finalAnswers[currentQuestion] = selectedOption;
      }

      setSubmitting(true);
      const formattedAnswers = finalAnswers.map((optionIndex, i) => ({
        questionId: questions[i].id,
        selectedOption: optionIndex !== null ? OPTION_LETTERS[optionIndex] : "",
      }));

      const res = await submitQuiz(activeQuiz!.id, formattedAnswers);
      if (res.success) {
        setResult(res.data);
      } else {
        // Fallback: calculate locally if submit fails
        setResult({
          score: 0,
          totalQuestions: questions.length,
          scorePercentage: 0,
          xpEarned: 0,
          correctAnswers: questions.length,
        });
      }
      setSubmitting(false);
      setView("result");
    }
  };

  const handlePrev = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);
    }
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  // Helper: get option text from a question by index
  const getOptionText = (q: QuizQuestion, index: number): string => {
    const opts = [q.option_a, q.option_b, q.option_c, q.option_d];
    return opts[index] || "";
  };

  // ─── Quiz List View ────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <ClipboardCheck className="w-6 h-6" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Assessments
            </h2>
          </div>
          <p className="text-teal-100" style={{ fontSize: "0.875rem" }}>
            Test your knowledge and earn XP. Quizzes adapt to your current
            learning progress.
          </p>
        </motion.div>

        {/* Loading state */}
        {listLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-2/3 h-4 mb-4" />
                <Skeleton className="w-full h-8 mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {listError && !listLoading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3">{listError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-teal-600 hover:underline cursor-pointer"
              style={{ fontSize: "0.875rem" }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Quiz cards */}
        {!listLoading && !listError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {quizList.map((quiz, i) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{
                  y: -3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full ${difficultyColors[quiz.difficulty] || ""}`}
                    style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3
                  className="text-[#0F172A] mb-1"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  {quiz.title}
                </h3>
                <p
                  className="text-gray-500 mb-4 flex-1"
                  style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}
                >
                  {quiz.topic} &middot; {quiz.questions} questions
                </p>

                {quiz.bestScore !== null && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-gray-500"
                        style={{ fontSize: "0.6875rem" }}
                      >
                        Best Score
                      </span>
                      <span
                        className="text-[#0F172A]"
                        style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                      >
                        {quiz.bestScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={quiz.bestScore}
                      color={
                        quiz.bestScore >= 80 ? "bg-green-500" : "bg-yellow-500"
                      }
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1 text-gray-400"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Clock className="w-3.5 h-3.5" /> {quiz.duration} min
                    </span>
                    <span
                      className="flex items-center gap-1 text-yellow-500"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Zap className="w-3.5 h-3.5" /> {quiz.xp} XP
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startQuiz(quiz)}
                    className="flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                  >
                    <Play className="w-3.5 h-3.5" /> Start
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Quiz Interface View ───────────────────────────────────────────────
  if (view === "quiz") {
    // Loading state while questions are being fetched
    if (quizLoading || questions.length === 0) {
      return (
        <div className="max-w-2xl mx-auto flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <span className="ml-3 text-gray-500">Loading questions…</span>
        </div>
      );
    }

    const question = questions[currentQuestion];
    const options = [
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
            style={{ fontSize: "0.8125rem" }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to quizzes
          </button>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-[#0F172A]"
                style={{ fontSize: "1.125rem", fontWeight: 600 }}
              >
                {activeQuiz?.title}
              </h3>
              <span
                className="bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>

            <ProgressBar
              value={currentQuestion + 1}
              max={questions.length}
              color="bg-teal-500"
              className="mb-8"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p
                  className="text-[#0F172A] mb-6"
                  style={{ fontSize: "1.0625rem", fontWeight: 500 }}
                >
                  {question.question}
                </p>

                <div className="space-y-3">
                  {options.map((option, oi) => (
                    <motion.button
                      key={oi}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedOption(oi)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedOption === oi
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      style={{ fontSize: "0.9375rem" }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            selectedOption === oi
                              ? "bg-teal-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          style={{ fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          {OPTION_LETTERS[oi]}
                        </span>
                        <span
                          className={
                            selectedOption === oi
                              ? "text-teal-700"
                              : "text-gray-700"
                          }
                        >
                          {option}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={selectedOption === null || submitting}
                className="flex items-center gap-1 bg-teal-600 text-white px-5 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  "Finish"
                ) : (
                  "Next"
                )}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Result View ───────────────────────────────────────────────────────
  // Displays the API response: score, XP earned, and per-question review.
  const scorePercent = result?.scorePercentage ?? 0;
  const score = result?.score ?? 0;
  const totalQ = result?.totalQuestions ?? questions.length;
  const xpEarned = result?.xpEarned ?? 0;

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center"
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
            scorePercent >= 80
              ? "bg-green-100"
              : scorePercent >= 50
                ? "bg-yellow-100"
                : "bg-red-100"
          }`}
        >
          {scorePercent >= 80 ? (
            <Trophy className="w-10 h-10 text-green-600" />
          ) : scorePercent >= 50 ? (
            <CheckCircle2 className="w-10 h-10 text-yellow-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
        </div>

        <h2
          className="text-[#0F172A] mb-1"
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {scorePercent >= 80
            ? "Excellent!"
            : scorePercent >= 50
              ? "Good Effort!"
              : "Keep Practicing!"}
        </h2>
        <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>
          {activeQuiz?.title} completed
        </p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div>
            <p
              className="text-[#0F172A]"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              {scorePercent}%
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
              Score
            </p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p
              className="text-[#0F172A]"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              {score}/{totalQ}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
              Correct
            </p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p
              className="text-yellow-600"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              +{xpEarned}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
              XP Earned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => activeQuiz && startQuiz(activeQuiz)}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <RotateCcw className="w-4 h-4" /> Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setView("list");
              // Refresh the quiz list to get updated best scores
              getQuizzes().then((res) => {
                if (res.success) setQuizList(res.data);
              });
            }}
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg cursor-pointer"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Back to Quizzes <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
