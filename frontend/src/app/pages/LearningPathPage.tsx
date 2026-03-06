import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import {
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  Clock,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  Code,
  Palette,
  Layers,
} from "lucide-react";
import {
  getProgress,
  type ProgressTopic,
} from "../../services/progressService";

interface Lesson {
  title: string;
  duration: string;
  type: "video" | "reading" | "practice" | "quiz";
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "in-progress" | "locked" | "not-started";
  progress: number;
  lessons: Lesson[];
  totalTime: string;
  xp: number;
}

// ── Static curriculum structure ──────────────────────────────────────────────
// Module titles, descriptions, lessons, and durations define the curriculum.
// Dynamic values (status, progress, xp) are merged from GET /api/progress.
interface CurriculumModule {
  id: string;
  title: string;
  topicName: string; // matches ProgressTopic.name from API
  description: string;
  icon: React.ElementType;
  lessons: Lesson[];
  totalTime: string;
  baseXp: number;
}

const curriculum: CurriculumModule[] = [
  {
    id: "html",
    title: "HTML Fundamentals",
    topicName: "HTML Basics",
    description:
      "Learn the building blocks of web pages — tags, attributes, forms, and semantic markup.",
    icon: Code,
    totalTime: "3.5 hrs",
    baseXp: 450,
    lessons: [
      { title: "Introduction to HTML", duration: "15 min", type: "video" },
      { title: "Tags & Elements", duration: "20 min", type: "reading" },
      { title: "Forms & Inputs", duration: "30 min", type: "practice" },
      { title: "Semantic HTML", duration: "25 min", type: "video" },
      { title: "HTML Quiz", duration: "15 min", type: "quiz" },
    ],
  },
  {
    id: "css",
    title: "CSS Fundamentals",
    topicName: "CSS Fundamentals",
    description:
      "Master styling with selectors, layouts, Flexbox, Grid, and responsive design.",
    icon: Palette,
    totalTime: "5 hrs",
    baseXp: 600,
    lessons: [
      {
        title: "CSS Selectors & Specificity",
        duration: "20 min",
        type: "video",
      },
      { title: "Box Model Deep Dive", duration: "25 min", type: "reading" },
      { title: "Flexbox Layout", duration: "35 min", type: "practice" },
      { title: "CSS Grid Mastery", duration: "40 min", type: "practice" },
      { title: "Responsive Design", duration: "30 min", type: "video" },
      { title: "CSS Quiz", duration: "15 min", type: "quiz" },
    ],
  },
  {
    id: "js",
    title: "JavaScript Basics",
    topicName: "JavaScript Basics",
    description:
      "Understand variables, functions, DOM manipulation, events, and async patterns.",
    icon: FileText,
    totalTime: "8 hrs",
    baseXp: 800,
    lessons: [
      { title: "Variables & Data Types", duration: "20 min", type: "video" },
      { title: "Functions & Scope", duration: "30 min", type: "reading" },
      { title: "DOM Manipulation", duration: "45 min", type: "practice" },
      { title: "Events & Listeners", duration: "25 min", type: "video" },
      { title: "Async JavaScript", duration: "40 min", type: "practice" },
      { title: "Build a Todo App", duration: "60 min", type: "practice" },
      { title: "JavaScript Quiz", duration: "20 min", type: "quiz" },
    ],
  },
  {
    id: "react",
    title: "React Basics",
    topicName: "React Basics",
    description:
      "Components, JSX, state, props, hooks, and building interactive UIs.",
    icon: Layers,
    totalTime: "10 hrs",
    baseXp: 1000,
    lessons: [
      { title: "Introduction to React", duration: "20 min", type: "video" },
      { title: "JSX & Components", duration: "30 min", type: "reading" },
      { title: "State & Props", duration: "35 min", type: "practice" },
      { title: "React Hooks", duration: "45 min", type: "video" },
      { title: "Build a Dashboard", duration: "90 min", type: "practice" },
      { title: "React Quiz", duration: "20 min", type: "quiz" },
    ],
  },
];

// ── Merge API progress into curriculum structure ────────────────────────────
function buildModules(topics: ProgressTopic[]): Module[] {
  return curriculum.map((cur) => {
    const topic = topics.find((t) => t.name === cur.topicName);
    return {
      id: cur.id,
      title: cur.title,
      description: cur.description,
      icon: cur.icon,
      lessons: cur.lessons,
      totalTime: cur.totalTime,
      // Dynamic values from API (fallback to defaults when no data)
      status: topic?.status ?? "not-started",
      progress: topic?.progress ?? 0,
      xp: topic?.xp ?? cur.baseXp,
    };
  });
}

const typeIcons: Record<string, React.ElementType> = {
  video: PlayCircle,
  reading: BookOpen,
  practice: Code,
  quiz: FileText,
};

const typeColors: Record<string, string> = {
  video: "text-blue-500 bg-blue-50",
  reading: "text-purple-500 bg-purple-50",
  practice: "text-green-500 bg-green-50",
  quiz: "text-orange-500 bg-orange-50",
};

function ModuleCard({
  module,
  index,
  totalModules,
}: {
  module: Module;
  index: number;
  totalModules: number;
}) {
  const [expanded, setExpanded] = useState(module.status === "in-progress");
  const isLocked = module.status === "locked";

  const statusIcon =
    module.status === "completed" ? (
      <CheckCircle2 className="w-6 h-6 text-green-500" />
    ) : module.status === "in-progress" ? (
      <PlayCircle className="w-6 h-6 text-blue-500" />
    ) : module.status === "locked" ? (
      <Lock className="w-5 h-5 text-gray-400" />
    ) : (
      <Circle className="w-6 h-6 text-gray-300" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative ${isLocked ? "opacity-60" : ""}`}
    >
      {/* Timeline connector */}
      {index < totalModules - 1 && (
        <div className="absolute left-[27px] top-[60px] bottom-[-20px] w-0.5 bg-gray-200 hidden md:block" />
      )}

      <div className="flex gap-4 md:gap-6">
        {/* Timeline dot */}
        <div className="hidden md:flex flex-col items-center shrink-0 pt-1">
          <div className="w-[54px] h-[54px] rounded-full border-2 border-gray-200 bg-white flex items-center justify-center z-10">
            {statusIcon}
          </div>
        </div>

        {/* Card */}
        <motion.div
          whileHover={
            isLocked ? {} : { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }
          }
          className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => !isLocked && setExpanded(!expanded)}
            className={`w-full p-5 md:p-6 text-left ${isLocked ? "" : "cursor-pointer"}`}
            disabled={isLocked}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="md:hidden shrink-0">{statusIcon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3
                      className="text-[#0F172A]"
                      style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                    >
                      {module.title}
                    </h3>
                    <StatusBadge status={module.status} />
                  </div>
                  <p
                    className="text-gray-500 mb-3"
                    style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}
                  >
                    {module.description}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className="flex items-center gap-1 text-gray-400"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Clock className="w-3.5 h-3.5" /> {module.totalTime}
                    </span>
                    <span
                      className="flex items-center gap-1 text-gray-400"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />{" "}
                      {module.lessons.length} lessons
                    </span>
                    <span
                      className="flex items-center gap-1 text-yellow-500"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Star className="w-3.5 h-3.5" /> {module.xp} XP
                    </span>
                  </div>

                  {module.progress > 0 && (
                    <div className="flex items-center gap-3 mt-3">
                      <ProgressBar
                        value={module.progress}
                        color={
                          module.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      />
                      <span
                        className="text-gray-500 shrink-0"
                        style={{ fontSize: "0.75rem", fontWeight: 500 }}
                      >
                        {module.progress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!isLocked && (
                <div className="shrink-0 text-gray-400">
                  {expanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>
          </button>

          {/* Expanded lessons */}
          {expanded && !isLocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100"
            >
              <div className="p-5 md:p-6 pt-4 space-y-2">
                {module.lessons.map((lesson, li) => {
                  const TypeIcon = typeIcons[lesson.type];
                  const colorClass = typeColors[lesson.type];
                  const isCompleted =
                    module.status === "completed" ||
                    (module.status === "in-progress" &&
                      li <
                        Math.floor(
                          (module.progress / 100) * module.lessons.length,
                        ));

                  return (
                    <motion.div
                      key={lesson.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: li * 0.04 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`truncate ${isCompleted ? "text-gray-400 line-through" : "text-[#0F172A]"}`}
                          style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                        >
                          {lesson.title}
                        </p>
                      </div>
                      <span
                        className="text-gray-400 shrink-0"
                        style={{ fontSize: "0.6875rem" }}
                      >
                        {lesson.duration}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LearningPathPage() {
  // ── Fetch progress from GET /api/progress and merge into curriculum ──
  const [modules, setModules] = useState<Module[]>(() => buildModules([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      setLoading(true);
      const res = await getProgress();
      if (res.success) {
        setModules(buildModules(res.data.topics));
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    fetchProgress();
  }, []);

  // ── Compute header summary dynamically ──
  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length,
  );
  const totalXp = modules.reduce((sum, m) => sum + m.xp, 0).toLocaleString();

  return (
    <div className="space-y-8">
      {/* Header stats — values computed from API data */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white"
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }} className="mb-1">
          Frontend Developer Path
        </h2>
        {loading ? (
          <Skeleton className="w-60 h-5 mb-5 bg-white/20" />
        ) : (
          <p className="text-indigo-200 mb-5" style={{ fontSize: "0.875rem" }}>
            {modules.length} modules &middot; {totalXp} XP total
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {totalProgress}%
          </span>
        </div>
      </motion.div>

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-6 text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-indigo-600 hover:underline cursor-pointer"
            style={{ fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {/* Module timeline — dynamic status/progress from API */}
      {!loading && (
        <div className="space-y-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              totalModules={modules.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
