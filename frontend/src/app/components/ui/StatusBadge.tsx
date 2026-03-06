interface StatusBadgeProps {
  status: "completed" | "in-progress" | "not-started" | "locked";
  className?: string;
}

const statusConfig = {
  completed: {
    label: "Completed",
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  "not-started": {
    label: "Not Started",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  locked: {
    label: "Locked",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} ${className}`}
      style={{ fontSize: "0.75rem" }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
