import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  getSkillPath,
  type SkillPath,
} from "../../services/learningPathService";
import { getProfile } from "../../services/userService";

// ─── Phase colors ────────────────────────────────────────────────────────────

const PHASE_COLORS = [
  {
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    line: "from-emerald-400 to-blue-400",
  },
  {
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    line: "from-blue-400 to-violet-400",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
    line: "from-violet-400 to-fuchsia-400",
  },
  {
    gradient: "from-fuchsia-500 to-pink-600",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
    dot: "bg-fuchsia-500",
    line: "from-fuchsia-400 to-rose-400",
  },
  {
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    line: "from-amber-400 to-orange-400",
  },
];

function getPhaseColor(index: number) {
  return PHASE_COLORS[index % PHASE_COLORS.length];
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function LearningPathPage() {
  const [pathData, setPathData] = useState<SkillPath | null>(null);
  const [learningGoal, setLearningGoal] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);

      // 1. Get user profile to determine learning goal
      const profileRes = await getProfile();
      if (!profileRes.success) {
        setError("Failed to load your profile");
        setLoading(false);
        return;
      }

      const goal = profileRes.data.learning_goal;
      if (!goal) {
        setError("No learning goal set. Please complete onboarding first.");
        setLoading(false);
        return;
      }

      setLearningGoal(goal);

      // 2. Fetch the learning path for this goal
      const pathRes = await getSkillPath(goal);
      if (pathRes.success) {
        setPathData(pathRes.data);
      } else {
        setError(pathRes.message);
      }

      setLoading(false);
    }

    fetchAll();
  }, []);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* ── Hero header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-60" />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-indigo-200 font-medium text-xs uppercase tracking-wider">
                  Your Learning Roadmap
                </span>
              </div>
              <h1
                className="text-white font-bold mb-1.5"
                style={{ fontSize: "1.5rem", lineHeight: 1.3 }}
              >
                {loading ? (
                  <Skeleton className="w-64 h-8 bg-white/20" />
                ) : (
                  learningGoal || "Learning Path"
                )}
              </h1>
              <p className="text-indigo-200 text-sm max-w-md">
                Follow each phase in order to master your chosen skill.
              </p>
            </div>

            {/* Duration badge */}
            {!loading && pathData && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="shrink-0"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span className="text-white font-semibold text-sm">
                    {pathData.duration}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats row */}
          {!loading && pathData && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-5 pt-5 border-t border-white/10"
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-white/80 text-xs font-medium">
                  {pathData.phases.length} Phases
                </span>
              </div>
              <div className="w-px h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-white/80 text-xs font-medium">
                  {pathData.duration}
                </span>
              </div>
              <div className="w-px h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-white/80 text-xs font-medium">
                  Skill-based path
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Error state ── */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">{error}</p>
          <p className="text-gray-400 text-sm mb-4">
            Make sure you've completed onboarding and selected a learning goal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline cursor-pointer transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-6"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="w-48 h-5 mb-2" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Phases roadmap ── */}
      {!loading && !error && pathData && (
        <div className="relative pl-8">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-200 via-violet-200 to-amber-200 rounded-full" />

          <div className="space-y-0">
            {pathData.phases.map((phase, index) => {
              const color = getPhaseColor(index);
              const isLast = index === pathData.phases.length - 1;

              return (
                <div key={phase}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[2.125rem] top-6 z-10">
                      <div
                        className={`w-4 h-4 rounded-full ${color.dot} border-[3px] border-white shadow-lg`}
                      />
                    </div>

                    {/* Phase card */}
                    <div
                      className={`rounded-2xl border ${color.border} bg-gradient-to-br from-white to-gray-50/30 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md`}
                    >
                      <div className="p-5 flex items-center gap-4">
                        {/* Phase number */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${color.gradient} shadow-md`}
                        >
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>

                        {/* Phase info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-bold px-1.5 py-0.5 rounded ${color.bg} ${color.text}`}
                            >
                              Phase {index + 1}
                            </span>
                          </div>
                          <h3
                            className="font-semibold text-gray-800 mt-1"
                            style={{ fontSize: "1.0625rem" }}
                          >
                            {phase}
                          </h3>
                        </div>

                        <ChevronRight
                          className={`w-5 h-5 ${color.text} opacity-40`}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Connector between phases */}
                  {!isLast && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      className="flex flex-col items-center py-3 relative -left-[0.125rem]"
                    >
                      <div
                        className={`w-0.5 h-6 rounded-full bg-gradient-to-b ${color.line}`}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Completion note ── */}
      {!loading && !error && pathData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pathData.phases.length * 0.1 + 0.3 }}
          className="text-center py-8 px-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Complete all {pathData.phases.length} phases
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Follow each phase sequentially to build a solid foundation in{" "}
            {pathData.skill}. Estimated duration: {pathData.duration}.
          </p>
        </motion.div>
      )}
    </div>
  );
}
