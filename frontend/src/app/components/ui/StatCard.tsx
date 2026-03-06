import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconBg: string;
  iconColor: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = "neutral",
  iconBg,
  iconColor,
  delay = 0,
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-gray-500 bg-gray-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full ${changeColors[changeType]}`}
            style={{ fontSize: "0.6875rem", fontWeight: 600 }}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-[#0F172A] mt-3" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
        {value}
      </p>
      <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.8125rem" }}>
        {label}
      </p>
    </motion.div>
  );
}
