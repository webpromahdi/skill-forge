import { useState } from "react";
import { motion } from "motion/react";
import { WelcomeCard } from "../components/features/WelcomeCard";
import { RecommendationCard } from "../components/features/RecommendationCard";
import { LearningProgress } from "../components/features/LearningProgress";
import { QuickActions } from "../components/features/QuickActions";
import { UpcomingDeadlines } from "../components/features/UpcomingDeadlines";
import { ActivityCard } from "../components/features/ActivityCard";
import { StatCard } from "../components/ui/StatCard";
import { KanbanBoard } from "../components/features/KanbanBoard";
import {
  LayoutList,
  Columns3,
  ChevronDown,
  BookOpen,
  Clock,
  Flame,
  Trophy,
} from "lucide-react";

const weeklyActivities = [
  {
    day: "Monday",
    lessonName: "Lesson-1",
    status: "completed" as const,
    readingActivities: 2,
    mathActivities: 2,
    totalTime: "45 Min",
    completed: 4,
    total: 4,
  },
  {
    day: "Tuesday",
    lessonName: "Lesson-2",
    status: "in-progress" as const,
    readingActivities: 3,
    mathActivities: 1,
    totalTime: "30 Min",
    completed: 1,
    total: 4,
  },
  {
    day: "Wednesday",
    lessonName: "Lesson-3",
    status: "not-started" as const,
    readingActivities: 4,
    mathActivities: 1,
    totalTime: "60 Min",
    completed: 0,
    total: 4,
  },
  {
    day: "Thursday",
    lessonName: "Lesson-4",
    status: "completed" as const,
    readingActivities: 2,
    mathActivities: 2,
    totalTime: "45 Min",
    completed: 4,
    total: 4,
  },
  {
    day: "Friday",
    lessonName: "Lesson-5",
    status: "in-progress" as const,
    readingActivities: 3,
    mathActivities: 2,
    totalTime: "50 Min",
    completed: 2,
    total: 5,
  },
];

export function DashboardPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <WelcomeCard />

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Lessons Completed"
          value="24"
          change="+3 this week"
          changeType="positive"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label="Study Time"
          value="4.5h"
          change="This week"
          changeType="neutral"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value="12 days"
          change="Best: 12"
          changeType="positive"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          delay={0.15}
        />
        <StatCard
          icon={Trophy}
          label="Total XP"
          value="2,340"
          change="+480"
          changeType="positive"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          delay={0.2}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Two-column content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecommendationCard />
        </div>
        <div className="lg:col-span-1">
          <LearningProgress />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* Weekly Activity section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#0F172A]"
            style={{ fontSize: "1.25rem", fontWeight: 600 }}
          >
            Weekly Activity
          </motion.h2>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500" style={{ fontSize: "0.8125rem" }}>
              Next Week :
            </span>
            <button
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[#0F172A] hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              Week 1 <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white shadow-sm text-[#0F172A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                <Columns3 className="w-3.5 h-3.5" /> Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                <LayoutList className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-4">
            {weeklyActivities.map((activity, i) => (
              <ActivityCard key={activity.day} {...activity} delay={i * 0.08} />
            ))}
          </div>
        ) : (
          <KanbanBoard activities={weeklyActivities} />
        )}
      </div>
    </div>
  );
}