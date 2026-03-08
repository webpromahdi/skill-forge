// ─── Recommendations Page ────────────────────────────────────────────────────
// Displays AI-generated phase-based learning resources fetched from the backend.
//
// AI Recommendation Workflow — UI layer:
//   1. Page mounts → getPhaseResources() → GET /api/recommendations/resources
//      If the user has no resources yet, shows a prompt to generate them.
//
//   2. User clicks "Generate Recommendations" → generatePhaseResources()
//      → POST /api/recommendations/generate-resources
//      Backend runs: detect goal → get skill path → call AI → store resources
//      UI shows the returned phases with YouTube + blog resources.
//
//   3. AI failure is handled gracefully — the user sees a friendly message
//      instead of a broken page.

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Play,
  FileText,
  ExternalLink,
  Sparkles,
  Zap,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import {
  getPhaseResources,
  generatePhaseResources,
  type PhaseRecommendations,
  type Phase,
  type PhaseResource,
} from "../../services/recommendationService";

// ─── Phase colours (matches LearningPathPage) ───────────────────────────────
const PHASE_COLORS = [
  {
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  {
    gradient: "from-fuchsia-500 to-pink-600",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
    dot: "bg-fuchsia-500",
  },
  {
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
];

// ─── Resource type styling ──────────────────────────────────────────────────
const resourceStyle: Record<
  string,
  { icon: React.ElementType; bg: string; color: string; label: string }
> = {
  video: {
    icon: Play,
    bg: "bg-red-100",
    color: "text-red-600",
    label: "YouTube Lesson",
  },
  article: {
    icon: FileText,
    bg: "bg-blue-100",
    color: "text-blue-600",
    label: "Blog / Guide",
  },
};

export function RecommendationsPage() {
  const [data, setData] = useState<PhaseRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());

  // ── Load existing phase resources on mount ────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getPhaseResources();
      if (res.success) {
        setData(res.data);
        // Auto-expand all phases when data loads
        if (res.data?.phases) {
          setExpandedPhases(new Set(res.data.phases.map((_, i) => i)));
        }
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Generate phase resources via AI ───────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    const res = await generatePhaseResources();
    if (res.success) {
      setData(res.data);
      if (res.data?.phases) {
        setExpandedPhases(new Set(res.data.phases.map((_, i) => i)));
      }
    } else {
      setError(res.message);
    }
    setGenerating(false);
  }

  // ── Toggle phase accordion ────────────────────────────────────────
  function togglePhase(index: number) {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-36 rounded-2xl" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Banner ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {data
                ? `Recommendations for ${data.skill}`
                : "AI-Powered Recommendations"}
            </h2>
            <p
              className="text-purple-200 mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              {data
                ? `We found curated YouTube lessons and blog guides for each phase of your ${data.skill} learning path.`
                : "Generate personalized learning resources — a YouTube lesson and a blog guide for every phase of your learning path."}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-lg shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                {data ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {data
                  ? "Regenerate Recommendations"
                  : "Generate Recommendations"}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Error banner ────────────────────────────────────────────── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-700 flex-1" style={{ fontSize: "0.875rem" }}>
            {error}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1 text-red-600 cursor-pointer"
            style={{ fontSize: "0.8125rem", fontWeight: 600 }}
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </motion.button>
        </motion.div>
      )}

      {/* ── Phase list ──────────────────────────────────────────────── */}
      {data && data.phases.length > 0 ? (
        <div className="space-y-5">
          {data.phases.map((phase: Phase, idx: number) => {
            const color = PHASE_COLORS[idx % PHASE_COLORS.length];
            const isOpen = expandedPhases.has(idx);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`bg-white rounded-xl border ${color.border} shadow-sm overflow-hidden`}
              >
                {/* Phase header */}
                <button
                  type="button"
                  onClick={() => togglePhase(idx)}
                  className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white shrink-0`}
                    style={{ fontSize: "0.875rem", fontWeight: 700 }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[#0F172A] truncate"
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    >
                      {phase.title}
                    </h3>
                    <p
                      className="text-gray-400 mt-0.5"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {phase.resources.length} resource
                      {phase.resources.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {/* Resources (collapsible) */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.resources.map(
                        (resource: PhaseResource, rIdx: number) => {
                          const style =
                            resourceStyle[resource.type] ||
                            resourceStyle.article;
                          const Icon = style.icon;

                          return (
                            <motion.div
                              key={rIdx}
                              whileHover={{
                                y: -2,
                                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                              }}
                              className={`rounded-lg border ${color.border} p-4 flex items-start gap-4`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}
                              >
                                <Icon className={`w-5 h-5 ${style.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full ${style.bg} ${style.color} mb-1.5`}
                                  style={{
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {style.label}
                                </span>
                                <h4
                                  className="text-[#0F172A] leading-snug"
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {resource.title}
                                </h4>
                                <p
                                  className="text-gray-400 mt-0.5"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {resource.source}
                                </p>
                              </div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 shrink-0 mt-1"
                                style={{
                                  fontSize: "0.8125rem",
                                  fontWeight: 600,
                                }}
                              >
                                Open
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </motion.div>
                          );
                        },
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ── Empty state ───────────────────────────────────────────── */
        !error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h3
              className="text-[#0F172A] mb-2"
              style={{ fontSize: "1.125rem", fontWeight: 600 }}
            >
              No Recommendations Yet
            </h3>
            <p
              className="text-gray-500 max-w-md mb-6"
              style={{ fontSize: "0.875rem" }}
            >
              Click the button above to generate AI-powered learning resources
              tailored to your goal. Each phase of your learning path will
              receive a curated YouTube lesson and a blog guide.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl cursor-pointer disabled:opacity-60"
              style={{ fontSize: "0.9375rem", fontWeight: 600 }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Generate Recommendations
                </>
              )}
            </motion.button>
          </motion.div>
        )
      )}
    </div>
  );
}
