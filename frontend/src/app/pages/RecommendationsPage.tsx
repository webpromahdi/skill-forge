// ─── Recommendations Page ────────────────────────────────────────────────────
// Displays AI-generated learning recommendations fetched from the backend.
//
// AI Recommendation Workflow — UI layer:
//   1. Page mounts → getRecommendations() → GET /api/recommendations
//      If the user has no recommendations yet, shows a prompt to generate one.
//
//   2. User clicks "Generate Recommendation" → generateRecommendation()
//      → POST /api/recommendations/generate
//      Backend runs: gather data → build prompt → call AI → save → fetch resources
//      UI shows the returned topic, reason, match score, and resource cards.
//
//   3. AI failure is handled gracefully — the user sees a friendly message
//      instead of a broken page.

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Play,
  FileText,
  Code,
  BookOpen,
  Clock,
  ExternalLink,
  Star,
  Sparkles,
  TrendingUp,
  Info,
  Zap,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  getRecommendations,
  generateRecommendation,
  type Recommendation,
  type RecommendationResource,
} from "../../services/recommendationService";

// ─── Type icon mapping ──────────────────────────────────────────────────────
// Maps resource types to their display icon and colors.
const typeIcons: Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
> = {
  video: { icon: Play, bg: "bg-red-100", color: "text-red-600" },
  article: { icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
  project: { icon: Code, bg: "bg-green-100", color: "text-green-600" },
  tutorial: { icon: BookOpen, bg: "bg-purple-100", color: "text-purple-600" },
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

export function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load the latest recommendation on mount ────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getRecommendations();
      if (res.success) {
        setRecommendation(res.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Generate a new recommendation ─────────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    const res = await generateRecommendation();
    if (res.success) {
      setRecommendation(res.data);
    } else {
      setError(res.message);
    }
    setGenerating(false);
  }

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── AI suggestion banner ────────────────────────────────────── */}
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
              Personalized for You
            </h2>
            <p
              className="text-purple-200 mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              {recommendation
                ? `Based on your learning progress, we recommend focusing on ${recommendation.topic} next. Your match score reflects how well this aligns with your goals.`
                : "Click below to generate your first AI-powered recommendation based on your learning progress."}
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
                <TrendingUp className="w-4 h-4" />{" "}
                {recommendation
                  ? "Refresh Recommendation"
                  : "Generate Recommendation"}
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

      {/* ── Main recommendation card ────────────────────────────────── */}
      {recommendation ? (
        <>
          <div>
            <h2
              className="text-[#0F172A] mb-4"
              style={{ fontSize: "1.125rem", fontWeight: 600 }}
            >
              Next Recommended Topic
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              whileHover={{
                y: -3,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left accent */}
                <div className="w-full md:w-2 h-2 md:h-auto bg-blue-600 shrink-0" />

                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Code className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-[#0F172A]"
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: 700,
                              }}
                            >
                              {recommendation.topic}
                            </h3>
                            <span
                              className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                              }}
                            >
                              <Star className="w-3 h-3" />{" "}
                              {recommendation.match_score}% match
                            </span>
                          </div>
                          <p
                            className="text-gray-500 mt-0.5"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {recommendation.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap mt-4">
                        {recommendation.difficulty && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full ${difficultyColors[recommendation.difficulty] || difficultyColors["Intermediate"]}`}
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {recommendation.difficulty}
                          </span>
                        )}
                        <span
                          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                          style={{ fontSize: "0.6875rem" }}
                        >
                          {recommendation.topic}
                        </span>
                      </div>

                      {/* Why recommended explanation */}
                      <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span
                            className="text-blue-700"
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                            }}
                          >
                            Why this is recommended
                          </span>
                        </div>
                        <p
                          className="text-blue-600"
                          style={{
                            fontSize: "0.8125rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {recommendation.reason}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shrink-0 cursor-pointer self-start"
                      style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                    >
                      <Play className="w-5 h-5" /> Start Learning
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Recommended resources grid ──────────────────────────── */}
          {recommendation.resources.length > 0 && (
            <div>
              <h2
                className="text-[#0F172A] mb-4"
                style={{ fontSize: "1.125rem", fontWeight: 600 }}
              >
                Recommended Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recommendation.resources.map(
                  (resource: RecommendationResource, i: number) => {
                    const typeInfo =
                      typeIcons[resource.type] || typeIcons.article;
                    const TypeIcon = typeInfo.icon;

                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        whileHover={{
                          y: -3,
                          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                        }}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${typeInfo.bg}`}
                          >
                            <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full ${difficultyColors[resource.difficulty] || ""}`}
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                            }}
                          >
                            {resource.difficulty}
                          </span>
                        </div>

                        <h3
                          className="text-[#0F172A] mb-1"
                          style={{ fontSize: "1rem", fontWeight: 600 }}
                        >
                          {resource.title}
                        </h3>
                        <p
                          className="text-gray-500 mb-1"
                          style={{
                            fontSize: "0.8125rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {resource.topic}
                        </p>
                        <p
                          className="text-gray-400 mb-4 flex-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          by {resource.author}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex items-center gap-1 text-gray-400"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <Clock className="w-3.5 h-3.5" />{" "}
                              {resource.duration}
                            </span>
                            <span
                              className="flex items-center gap-1 text-yellow-500"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <Star className="w-3.5 h-3.5" /> {resource.rating}
                            </span>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                            }}
                          >
                            Open <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ── Empty state — no recommendation yet ───────────────────── */
        !error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
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
              Click the button above to generate your first personalized
              recommendation powered by AI. We&#39;ll analyze your progress and
              suggest the best next topic for you.
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
                  <Zap className="w-5 h-5" /> Generate Recommendation
                </>
              )}
            </motion.button>
          </motion.div>
        )
      )}
    </div>
  );
}
