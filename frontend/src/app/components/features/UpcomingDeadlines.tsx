import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardCard } from "../ui/DashboardCard";
import { Calendar, AlertCircle } from "lucide-react";
import { getDeadlines, type Deadline } from "../../../services/deadlineService";

// ─── Deadline Tracking System ───────────────────────────────────────────────
// This widget fetches the user's upcoming deadlines from GET /api/deadlines
// and displays them sorted by due_date (closest first). Each deadline shows:
//   • title  → the deadline name
//   • due_date → converted to a "days remaining" label (e.g. "2 days")
//   • priority → determines urgency styling:
//       - "high" → red border/bg, AlertCircle icon
//       - everything else → neutral border/bg, Calendar icon
//
// Loading: skeleton cards are shown while the API responds.
// Error:   a fallback message is displayed with a retry button.
// Empty:   a friendly "No upcoming deadlines" message is shown.

// ─── days remaining helper ──────────────────────────────────────────────────
// Computes the number of calendar days between today and a due_date string.
// Returns a human-readable label like "Today", "Tomorrow", or "5 days".
function daysRemaining(dueDate: string): { label: string; days: number } {
  const now = new Date();
  // Strip time component so we compare calendar dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(dueDate + "T00:00:00");
  const diff = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff <= 0) return { label: "Today", days: 0 };
  if (diff === 1) return { label: "Tomorrow", days: 1 };
  return { label: `${diff} days`, days: diff };
}

// ─── urgency check ──────────────────────────────────────────────────────────
// A deadline is visually urgent when its priority is "high" or it is due
// within the next 3 calendar days.
function isUrgent(deadline: Deadline, daysLeft: number): boolean {
  return deadline.priority === "high" || daysLeft <= 3;
}

export function UpcomingDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deadlines from GET /api/deadlines on mount
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const res = await getDeadlines();
      if (res.success) {
        setDeadlines(res.data);
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <DashboardCard delay={0.25}>
      <h3
        className="text-[#0F172A] mb-4"
        style={{ fontSize: "1.125rem", fontWeight: 600 }}
      >
        Upcoming Deadlines
      </h3>

      {/* ── Loading skeleton ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 animate-pulse"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-5 w-12 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* ── Error fallback ── */
        <div
          className="text-center py-6 text-gray-400"
          style={{ fontSize: "0.8125rem" }}
        >
          <p className="text-red-500 mb-1">Failed to load deadlines</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              getDeadlines().then((res) => {
                if (res.success) {
                  setDeadlines(res.data);
                } else {
                  setError(res.message);
                }
                setLoading(false);
              });
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : deadlines.length === 0 ? (
        /* ── Empty state ── */
        <div
          className="text-center py-6 text-gray-400"
          style={{ fontSize: "0.8125rem" }}
        >
          No upcoming deadlines
        </div>
      ) : (
        /* ── Deadline list ── */
        <div className="space-y-3">
          {deadlines.map((item, i) => {
            const { label, days } = daysRemaining(item.due_date);
            const urgent = isUrgent(item, days);

            return (
              <motion.div
                key={`${item.title}-${item.due_date}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  urgent
                    ? "border-red-200 bg-red-50/50"
                    : "border-gray-100 bg-gray-50/50"
                }`}
              >
                {/* Icon — AlertCircle for urgent, Calendar for normal */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    urgent ? "bg-red-100" : "bg-blue-100"
                  }`}
                >
                  {urgent ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                {/* Title + formatted date */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[#0F172A] truncate"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-gray-400"
                    style={{ fontSize: "0.6875rem" }}
                  >
                    {new Date(item.due_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </p>
                </div>

                {/* Days-remaining badge — urgency indicator */}
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full ${
                    urgent
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                >
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
