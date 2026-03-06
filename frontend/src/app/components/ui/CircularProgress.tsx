import { motion } from "motion/react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = "#2563EB",
  label,
  sublabel,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[#0F172A]" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {value}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-[#0F172A] mt-2 text-center" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
          {label}
        </p>
      )}
      {sublabel && (
        <p className="text-gray-400 text-center" style={{ fontSize: "0.6875rem" }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
