interface StatusBadgeProps {
  status: "completed" | "in-progress" | "not-started" | "locked";
  className?: string;
}

const statusConfig = {
  completed: {
    label: "Completed",
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
    dot: "bg-yellow-500",
  },
  "not-started": {
    label: "Not Started",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  locked: {
    label: "Locked",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
