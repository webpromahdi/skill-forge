import { DashboardCard } from "../ui/DashboardCard";
import { ProgressBar } from "../ui/ProgressBar";
import { StatusBadge } from "../ui/StatusBadge";
import { LearningProgressSkeleton } from "../ui/Skeleton";
import type { ProgressTopic } from "../../../services/progressService";

const defaultTopics: ProgressTopic[] = [
  {
    name: "HTML Basics",
    progress: 0,
    status: "not-started",
    lessonsCompleted: 0,
    studyTime: 0,
    xp: 0,
  },
  {
    name: "CSS Fundamentals",
    progress: 0,
    status: "not-started",
    lessonsCompleted: 0,
    studyTime: 0,
    xp: 0,
  },
  {
    name: "JavaScript Basics",
    progress: 0,
    status: "not-started",
    lessonsCompleted: 0,
    studyTime: 0,
    xp: 0,
  },
  {
    name: "React Basics",
    progress: 0,
    status: "locked",
    lessonsCompleted: 0,
    studyTime: 0,
    xp: 0,
  },
];

interface LearningProgressProps {
  topics?: ProgressTopic[];
  loading?: boolean;
}

export function LearningProgress({ topics, loading }: LearningProgressProps) {
  if (loading) return <LearningProgressSkeleton />;

  const displayTopics = topics && topics.length > 0 ? topics : defaultTopics;
  return (
    <DashboardCard delay={0.2}>
      <h3
        className="text-[#0F172A] mb-5"
        style={{ fontSize: "1.125rem", fontWeight: 600 }}
      >
        Learning Progress
      </h3>

      <div className="space-y-5">
        {displayTopics.map((topic) => (
          <div key={topic.name}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[#0F172A]"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                {topic.name}
              </span>
              <StatusBadge status={topic.status} />
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar
                value={topic.progress}
                color={
                  topic.status === "completed"
                    ? "bg-green-500"
                    : topic.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                }
              />
              <span
                className="text-gray-500 shrink-0"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                {topic.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
