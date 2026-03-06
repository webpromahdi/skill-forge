import { motion } from "motion/react";
import { ProgressBar } from "../ui/ProgressBar";
import { StatusBadge } from "../ui/StatusBadge";
import { BookOpen, Calculator, Clock, Printer, ChevronDown } from "lucide-react";

interface ActivityCardProps {
  day: string;
  lessonName: string;
  status: "completed" | "in-progress" | "not-started";
  readingActivities: number;
  mathActivities: number;
  totalTime: string;
  completed: number;
  total: number;
  delay?: number;
}

export function ActivityCard({
  day,
  lessonName,
  status,
  readingActivities,
  mathActivities,
  totalTime,
  completed,
  total,
  delay = 0,
}: ActivityCardProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="hidden sm:flex w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              {day}
            </h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-500 mb-3" style={{ fontSize: "0.8125rem" }}>
            {lessonName}
          </p>

          <div className="flex flex-wrap gap-4 md:gap-6 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {String(readingActivities).padStart(2, "0")}
                </p>
                <p className="text-gray-500" style={{ fontSize: "0.6875rem" }}>
                  Reading Activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {String(mathActivities).padStart(2, "0")}
                </p>
                <p className="text-gray-500" style={{ fontSize: "0.6875rem" }}>
                  Math Activities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {totalTime}
                </p>
                <p className="text-gray-500" style={{ fontSize: "0.6875rem" }}>
                  Total Time
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProgressBar
              value={completed}
              max={total}
              color={percentage === 100 ? "bg-green-500" : "bg-blue-500"}
              className="flex-1"
            />
            <span
              className={`shrink-0 ${percentage === 100 ? "text-green-600" : "text-gray-500"}`}
              style={{ fontSize: "0.8125rem", fontWeight: 600 }}
            >
              {completed}/{total}
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
            style={{ fontSize: "0.8125rem" }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print All</span>
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
            style={{ fontSize: "0.8125rem" }}
          >
            View <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
