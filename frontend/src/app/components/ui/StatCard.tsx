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
    positive: "text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300",
    negative: "text-destructive bg-destructive/10",
    neutral: "text-muted-foreground bg-muted",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-foreground mt-3 text-2xl font-bold">
        {value}
      </p>
      <p className="text-muted-foreground mt-0.5 text-[0.8125rem]">
        {label}
      </p>
    </motion.div>
  );
}
