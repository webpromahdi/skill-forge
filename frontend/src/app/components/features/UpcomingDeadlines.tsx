import { motion } from "motion/react";
import { DashboardCard } from "../ui/DashboardCard";
import { Calendar, AlertCircle } from "lucide-react";

const deadlines = [
  {
    title: "JavaScript Quiz",
    date: "Mar 6, 2026",
    timeLeft: "2 days",
    urgent: true,
  },
  {
    title: "CSS Project Submission",
    date: "Mar 9, 2026",
    timeLeft: "5 days",
    urgent: false,
  },
  {
    title: "React Module Start",
    date: "Mar 12, 2026",
    timeLeft: "8 days",
    urgent: false,
  },
];

export function UpcomingDeadlines() {
  return (
    <DashboardCard delay={0.25}>
      <h3 className="text-[#0F172A] mb-4" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
        Upcoming Deadlines
      </h3>
      <div className="space-y-3">
        {deadlines.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              item.urgent ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                item.urgent ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {item.urgent ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <Calendar className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#0F172A] truncate" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                {item.title}
              </p>
              <p className="text-gray-400" style={{ fontSize: "0.6875rem" }}>
                {item.date}
              </p>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full ${
                item.urgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
              }`}
              style={{ fontSize: "0.6875rem", fontWeight: 600 }}
            >
              {item.timeLeft}
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
}
