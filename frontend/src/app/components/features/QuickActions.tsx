import { motion } from "motion/react";
import { Play, FileText, Target, MessageSquare } from "lucide-react";

// TODO: Replace action descriptions with data from a backend endpoint
// (e.g. GET /api/progress/current-activity) when available.
// Currently static navigation shortcuts.
const actions = [
  {
    icon: Play,
    label: "Resume Lesson",
    description: "CSS Grid Layout",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    icon: FileText,
    label: "Take Quiz",
    description: "JavaScript Basics",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    icon: Target,
    label: "Practice",
    description: "Coding Challenge",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    icon: MessageSquare,
    label: "Ask Tutor",
    description: "Get help now",
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <h3
        className="text-[#0F172A] mb-4"
        style={{ fontSize: "1rem", fontWeight: 600 }}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-colors cursor-pointer ${action.color}`}
          >
            <action.icon className="w-5 h-5" />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
              {action.label}
            </span>
            <span className="text-white/70" style={{ fontSize: "0.6875rem" }}>
              {action.description}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
