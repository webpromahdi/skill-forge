import { motion } from "motion/react";
import { StatusBadge } from "../ui/StatusBadge";
import { ProgressBar } from "../ui/ProgressBar";
import { BookOpen, Calculator, Clock } from "lucide-react";

interface Activity {
  day: string;
  lessonName: string;
  status: "completed" | "in-progress" | "not-started";
  readingActivities: number;
  mathActivities: number;
  totalTime: string;
  completed: number;
  total: number;
}

interface KanbanBoardProps {
  activities: Activity[];
}

const columnConfig = [
  {
    status: "not-started" as const,
    title: "Not Started",
    headerColor: "bg-gray-100 text-gray-600",
    borderColor: "border-t-gray-400",
  },
  {
    status: "in-progress" as const,
    title: "In Progress",
    headerColor: "bg-yellow-50 text-yellow-700",
    borderColor: "border-t-yellow-400",
  },
  {
    status: "completed" as const,
    title: "Completed",
    headerColor: "bg-green-50 text-green-700",
    borderColor: "border-t-green-500",
  },
];

function KanbanCard({ activity, index }: { activity: Activity; index: number }) {
  const percentage = activity.total > 0 ? (activity.completed / activity.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
      className="bg-white rounded-lg border border-gray-100 shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[#0F172A]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
          {activity.day}
        </h4>
        <StatusBadge status={activity.status} />
      </div>
      <p className="text-gray-500 mb-3" style={{ fontSize: "0.75rem" }}>
        {activity.lessonName}
      </p>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-gray-400" />
          <span className="text-[#0F172A]" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            {activity.readingActivities}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calculator className="w-3 h-3 text-gray-400" />
          <span className="text-[#0F172A]" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            {activity.mathActivities}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500" style={{ fontSize: "0.75rem" }}>
            {activity.totalTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ProgressBar
          value={activity.completed}
          max={activity.total}
          color={percentage === 100 ? "bg-green-500" : "bg-blue-500"}
          className="flex-1"
        />
        <span className="text-gray-500 shrink-0" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
          {activity.completed}/{activity.total}
        </span>
      </div>
    </motion.div>
  );
}

export function KanbanBoard({ activities }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columnConfig.map((col) => {
        const items = activities.filter((a) => a.status === col.status);
        return (
          <div key={col.status} className={`rounded-xl bg-gray-50/80 border-t-2 ${col.borderColor}`}>
            <div className="px-4 py-3 flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-full ${col.headerColor}`}
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {col.title}
              </span>
              <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                {items.length}
              </span>
            </div>
            <div className="px-3 pb-3 space-y-3 min-h-[120px]">
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-400" style={{ fontSize: "0.8125rem" }}>
                  No activities
                </div>
              ) : (
                items.map((activity, i) => (
                  <KanbanCard key={activity.day} activity={activity} index={i} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
