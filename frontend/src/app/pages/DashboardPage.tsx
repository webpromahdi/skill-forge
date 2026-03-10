import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { WelcomeCard } from "../components/features/WelcomeCard";
import { RecommendationCard } from "../components/features/RecommendationCard";
import { LearningProgress } from "../components/features/LearningProgress";
import { QuickActions } from "../components/features/QuickActions";
import { UpcomingDeadlines } from "../components/features/UpcomingDeadlines";
import { ActivityCard } from "../components/features/ActivityCard";
import { StatCard } from "../components/ui/StatCard";
import { StatCardSkeleton } from "../components/ui/Skeleton";
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
import {
  getProgress,
  getWeeklyActivities,
  type ProgressStats,
  type ProgressTopic,
  type WeeklyActivity,
} from "../../services/progressService";

export function DashboardPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [topics, setTopics] = useState<ProgressTopic[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);

  // ── Weekly activity state from GET /api/progress/weekly ──
  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivity[]>(
    [],
  );
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch progress stats and weekly activities in parallel
    async function fetchAll() {
      setProgressLoading(true);
      setWeeklyLoading(true);

      const [progressRes, weeklyRes] = await Promise.all([
        getProgress(),
        getWeeklyActivities(),
      ]);

      if (progressRes.success) {
        setStats(progressRes.data.stats);
        setTopics(progressRes.data.topics);
        setProgressError(null);
      } else {
        setProgressError(progressRes.message);
      }
      setProgressLoading(false);

      if (weeklyRes.success) {
        setWeeklyActivities(weeklyRes.data);
        setWeeklyError(null);
      } else {
        setWeeklyError(weeklyRes.message);
      }
      setWeeklyLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <WelcomeCard stats={stats} loading={progressLoading} />

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {progressLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : progressError ? (
          <div className="col-span-full text-center text-destructive py-4">
            {progressError}
          </div>
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Lessons Completed"
              value={String(stats?.lessonsCompleted ?? 0)}
              change="+3 this week"
              changeType="positive"
              iconBg="bg-primary/10"
              iconColor="text-primary"
              delay={0.05}
            />
            <StatCard
              icon={Clock}
              label="Study Time"
              value={`${((stats?.studyTime ?? 0) / 60).toFixed(1)}h`}
              change="This week"
              changeType="neutral"
              iconBg="bg-secondary/10"
              iconColor="text-secondary"
              delay={0.1}
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={`${stats?.streak ?? 0} days`}
              change={`Best: ${stats?.streak ?? 0}`}
              changeType="positive"
              iconBg="bg-chart-5/10"
              iconColor="text-chart-5"
              delay={0.15}
            />
            <StatCard
              icon={Trophy}
              label="Total XP"
              value={(stats?.xp ?? 0).toLocaleString()}
              change="+480"
              changeType="positive"
              iconBg="bg-chart-4/10"
              iconColor="text-chart-4"
              delay={0.2}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Two-column content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecommendationCard />
        </div>
        <div className="lg:col-span-1">
          <LearningProgress topics={topics} loading={progressLoading} />
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
            className="text-foreground text-xl font-semibold"
          >
            Weekly Activity
          </motion.h2>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-muted-foreground text-[0.8125rem]">
              Next Week :
            </span>
            <button
              className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-[0.8125rem] font-medium"
            >
              Week 1 <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <div className="flex bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer text-[0.8125rem] font-medium ${
                  viewMode === "kanban"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" /> Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer text-[0.8125rem] font-medium ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          weeklyLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="hidden sm:block w-20 h-20 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted/60 rounded w-1/4" />
                      <div className="flex gap-6">
                        <div className="h-8 bg-muted/60 rounded w-16" />
                        <div className="h-8 bg-muted/60 rounded w-16" />
                        <div className="h-8 bg-muted/60 rounded w-16" />
                      </div>
                      <div className="h-2 bg-muted rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : weeklyError ? (
            <div className="text-center py-8 text-destructive">
              <p>{weeklyError}</p>
            </div>
          ) : weeklyActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/80">
              <p>
                No weekly activities yet. Start learning to see your progress
                here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {weeklyActivities.map((activity, i) => (
                <ActivityCard
                  key={activity.day}
                  {...activity}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )
        ) : weeklyLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-card border-t-2 border-t-muted-foreground/30 p-4 animate-pulse"
              >
                <div className="h-5 bg-muted rounded w-24 mb-4" />
                <div className="space-y-3 min-h-[120px]">
                  <div className="h-28 bg-muted rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : weeklyError ? (
          <div className="text-center py-8 text-red-500">
            <p>{weeklyError}</p>
          </div>
        ) : (
          <KanbanBoard activities={weeklyActivities} />
        )}
      </div>
    </div>
  );
}
