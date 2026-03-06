import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Skeleton } from "../ui/Skeleton";
import type { ProgressStats } from "../../../services/progressService";

interface WelcomeCardProps {
  stats: ProgressStats | null;
  loading?: boolean;
}

export function WelcomeCard({ stats, loading }: WelcomeCardProps) {
  // ── Pull the authenticated user's name from context ──
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || "Learner";

  const streak = stats?.streak ?? 0;
  const studyHours = ((stats?.studyTime ?? 0) / 60).toFixed(1);
  const xp = (stats?.xp ?? 0).toLocaleString();
  const lessonsCompleted = stats?.lessonsCompleted ?? 0;
  const goalProgress =
    lessonsCompleted > 0
      ? Math.min(100, Math.round((lessonsCompleted / 36) * 100))
      : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 text-white"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
            className="text-blue-200"
          >
            Welcome back
          </span>
        </div>
        <h2
          className="text-white mb-1"
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {displayName}
        </h2>
        <p className="text-blue-200" style={{ fontSize: "0.875rem" }}>
          Goal: Frontend Developer &middot; {goalProgress}% complete
        </p>

        <div className="mt-5 flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>
              Streak
            </p>
            {loading ? (
              <Skeleton className="w-16 h-6 mt-1 bg-white/20" />
            ) : (
              <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {streak} days
              </p>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>
              This Week
            </p>
            {loading ? (
              <Skeleton className="w-16 h-6 mt-1 bg-white/20" />
            ) : (
              <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {studyHours} hrs
              </p>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>
              XP Earned
            </p>
            {loading ? (
              <Skeleton className="w-16 h-6 mt-1 bg-white/20" />
            ) : (
              <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{xp}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
