import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function WelcomeCard() {
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
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }} className="text-blue-200">
            Welcome back
          </span>
        </div>
        <h2 className="text-white mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Jane Cooper
        </h2>
        <p className="text-blue-200" style={{ fontSize: "0.875rem" }}>
          Goal: Frontend Developer &middot; 68% complete
        </p>

        <div className="mt-5 flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>Streak</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>12 days</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>This Week</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>4.5 hrs</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
            <p className="text-blue-200" style={{ fontSize: "0.75rem" }}>XP Earned</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>2,340</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
