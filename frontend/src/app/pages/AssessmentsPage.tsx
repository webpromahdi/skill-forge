import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProgressBar } from "../components/ui/ProgressBar";
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
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  xp: number;
  questions: number;
  bestScore?: number;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

const quizzes: Quiz[] = [
  {
    id: "html-basics",
    title: "HTML Fundamentals",
    description: "Test your knowledge of HTML tags, attributes, and semantic markup.",
    difficulty: "Beginner",
    duration: "10 min",
    xp: 50,
    questions: 5,
    bestScore: 80,
  },
  {
    id: "css-basics",
    title: "CSS Fundamentals",
    description: "Evaluate your understanding of selectors, box model, and layouts.",
    difficulty: "Beginner",
    duration: "15 min",
    xp: 75,
    questions: 5,
    bestScore: 60,
  },
  {
    id: "js-basics",
    title: "JavaScript Basics",
    description: "Test variables, functions, scope, and core JS concepts.",
    difficulty: "Intermediate",
    duration: "20 min",
    xp: 100,
    questions: 5,
  },
  {
    id: "dom",
    title: "DOM Manipulation",
    description: "Assess your ability to dynamically interact with web pages.",
    difficulty: "Intermediate",
    duration: "15 min",
    xp: 100,
    questions: 5,
  },
  {
    id: "react-intro",
    title: "React Introduction",
    description: "Components, JSX, state, props, and hooks fundamentals.",
    difficulty: "Advanced",
    duration: "25 min",
    xp: 150,
    questions: 5,
  },
];

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Which HTML element is used to define the largest heading?",
    options: ["<heading>", "<h6>", "<h1>", "<head>"],
    correctIndex: 2,
  },
  {
    id: 2,
    text: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets",
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    text: "Which property is used to change the text color in CSS?",
    options: ["text-color", "font-color", "color", "text-style"],
    correctIndex: 2,
  },
  {
    id: 4,
    text: "Which keyword is used to declare a variable in JavaScript (ES6)?",
    options: ["var", "let", "dim", "define"],
    correctIndex: 1,
  },
  {
    id: 5,
    text: "What is the correct syntax for a JavaScript arrow function?",
    options: [
      "function => ()",
      "=> function()",
      "() => {}",
      "function() =>",
    ],
    correctIndex: 2,
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

type View = "list" | "quiz" | "result";

export function AssessmentsPage() {
  const [view, setView] = useState<View>("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setSelectedOption(null);
    setView("quiz");
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);
    }
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1]);
    } else {
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

  const score =
    view === "result"
      ? answers.reduce(
          (acc, a, i) => acc + (a === sampleQuestions[i].correctIndex ? 1 : 0),
          0
        )
      : 0;

  const scorePercent = Math.round((score / sampleQuestions.length) * 100);

  // Quiz List View
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
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Assessments</h2>
          </div>
          <p className="text-teal-100" style={{ fontSize: "0.875rem" }}>
            Test your knowledge and earn XP. Quizzes adapt to your current learning progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-teal-600" />
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full ${difficultyColors[quiz.difficulty]}`}
                  style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>
                {quiz.title}
              </h3>
              <p className="text-gray-500 mb-4 flex-1" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                {quiz.description}
              </p>

              {quiz.bestScore !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500" style={{ fontSize: "0.6875rem" }}>
                      Best Score
                    </span>
                    <span className="text-[#0F172A]" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                  <ProgressBar
                    value={quiz.bestScore}
                    color={quiz.bestScore >= 80 ? "bg-green-500" : "bg-yellow-500"}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: "0.75rem" }}>
                    <Clock className="w-3.5 h-3.5" /> {quiz.duration}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500" style={{ fontSize: "0.75rem" }}>
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
      </div>
    );
  }

  // Quiz Interface View
  if (view === "quiz") {
    const question = sampleQuestions[currentQuestion];
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
              <h3 className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                {activeQuiz?.title}
              </h3>
              <span
                className="bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {currentQuestion + 1} / {sampleQuestions.length}
              </span>
            </div>

            <ProgressBar
              value={currentQuestion + 1}
              max={sampleQuestions.length}
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
                <p className="text-[#0F172A] mb-6" style={{ fontSize: "1.0625rem", fontWeight: 500 }}>
                  {question.text}
                </p>

                <div className="space-y-3">
                  {question.options.map((option, oi) => (
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
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className={selectedOption === oi ? "text-teal-700" : "text-gray-700"}>
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
                disabled={selectedOption === null}
                className="flex items-center gap-1 bg-teal-600 text-white px-5 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                {currentQuestion === sampleQuestions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Result View
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
            scorePercent >= 80 ? "bg-green-100" : scorePercent >= 50 ? "bg-yellow-100" : "bg-red-100"
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

        <h2 className="text-[#0F172A] mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {scorePercent >= 80 ? "Excellent!" : scorePercent >= 50 ? "Good Effort!" : "Keep Practicing!"}
        </h2>
        <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>
          {activeQuiz?.title} completed
        </p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div>
            <p className="text-[#0F172A]" style={{ fontSize: "2rem", fontWeight: 700 }}>
              {scorePercent}%
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>Score</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p className="text-[#0F172A]" style={{ fontSize: "2rem", fontWeight: 700 }}>
              {score}/{sampleQuestions.length}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>Correct</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p className="text-yellow-600" style={{ fontSize: "2rem", fontWeight: 700 }}>
              +{Math.round((activeQuiz?.xp || 0) * (scorePercent / 100))}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>XP Earned</p>
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-2 mb-8 text-left">
          {sampleQuestions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span
                  className={isCorrect ? "text-green-700" : "text-red-700"}
                  style={{ fontSize: "0.8125rem" }}
                >
                  Q{i + 1}: {q.text}
                </span>
              </div>
            );
          })}
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
            onClick={() => setView("list")}
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
