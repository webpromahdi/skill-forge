import { motion } from "motion/react";
import { type ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function DashboardCard({
  children,
  className = "",
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className={`bg-card rounded-xl border border-border shadow-sm p-4 md:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
