import { motion } from "motion/react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "bg-green-500",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
