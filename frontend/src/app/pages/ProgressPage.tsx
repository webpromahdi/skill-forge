import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardCard } from "../components/ui/DashboardCard";
import { StatCard } from "../components/ui/StatCard";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { CircularProgress } from "../components/ui/CircularProgress";
import {
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getProgress,
  getChartData,
  type ProgressStats,
  type ProgressTopic,
  type WeeklyDataPoint,
  type MonthlyDataPoint,
  type ActivityTypePoint,
} from "../../services/progressService";

// ── Skill breakdown colour map ──────────────────────────────────────────────
const skillColors: Record<string, string> = {
  "HTML Basics": "#22C55E",
  "CSS Fundamentals": "#3B82F6",
  "JavaScript Basics": "#F59E0B",
  "React Basics": "#E5E7EB",
};

// ── Default empty chart data ────────────────────────────────────────────────
const emptyWeekly: WeeklyDataPoint[] = [
  { day: "Mon", hours: 0, xp: 0 },
  { day: "Tue", hours: 0, xp: 0 },
  { day: "Wed", hours: 0, xp: 0 },
  { day: "Thu", hours: 0, xp: 0 },
  { day: "Fri", hours: 0, xp: 0 },
  { day: "Sat", hours: 0, xp: 0 },
  { day: "Sun", hours: 0, xp: 0 },
];

const emptyMonthly: MonthlyDataPoint[] = [
  { week: "W1", hours: 0, lessons: 0 },
  { week: "W2", hours: 0, lessons: 0 },
  { week: "W3", hours: 0, lessons: 0 },
  { week: "W4", hours: 0, lessons: 0 },
];

const emptyActivity: ActivityTypePoint[] = [
  { name: "Lessons", value: 0, color: "#3B82F6" },
  { name: "Quizzes", value: 0, color: "#10B981" },
  { name: "Practice", value: 0, color: "#F59E0B" },
];

// ── Achievements ────────────────────────────────────────────────────────────
// TODO: Replace with a backend achievements endpoint when available.
// Currently derived from API stats where possible.
function buildAchievements(stats: ProgressStats | null) {
  const lessons = stats?.lessonsCompleted ?? 0;
  const streak = stats?.streak ?? 0;
  return [
    {
      title: "First Lesson",
      description: "Complete your first lesson",
      earned: lessons >= 1,
      icon: "🎯",
    },
    {
      title: "Week Streak",
      description: "7-day learning streak",
      earned: streak >= 7,
      icon: "🔥",
    },
    {
      title: "Quick Learner",
      description: "Complete 5 lessons in a day",
      earned: lessons >= 5,
      icon: "⚡",
    },
    {
      title: "Quiz Master",
      description: "Score 100% on 3 quizzes",
      earned: false,
      icon: "🏆",
    },
    {
      title: "Code Warrior",
      description: "Complete 10 practice projects",
      earned: false,
      icon: "💻",
    },
    {
      title: "Consistent",
      description: "30-day learning streak",
      earned: streak >= 30,
      icon: "📅",
    },
  ];
}

export function ProgressPage() {
  // ── Fetch real progress data from GET /api/progress ──
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [topics, setTopics] = useState<ProgressTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Chart data from GET /api/progress/charts ──
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>(emptyWeekly);
  const [monthlyData, setMonthlyData] =
    useState<MonthlyDataPoint[]>(emptyMonthly);
  const [activityTypeData, setActivityTypeData] =
    useState<ActivityTypePoint[]>(emptyActivity);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      // Fetch progress stats and chart data in parallel
      const [progressRes, chartRes] = await Promise.all([
        getProgress(),
        getChartData(),
      ]);

      if (progressRes.success) {
        setStats(progressRes.data.stats);
        setTopics(progressRes.data.topics);
        setError(null);
      } else {
        setError(progressRes.message);
      }

      if (chartRes.success) {
        setWeeklyData(chartRes.data.weeklyData);
        setMonthlyData(chartRes.data.monthlyData);
        setActivityTypeData(chartRes.data.activityTypeData);
      }

      setLoading(false);
    }
    fetchAll();
  }, []);

  // Derive skill breakdown from API topic data (dynamic)
  const skillBreakdown =
    topics.length > 0
      ? topics.map((t) => ({
          name: t.name.replace(/ (Basics|Fundamentals)/, ""),
          value: t.progress,
          color: skillColors[t.name] || "#94A3B8",
        }))
      : [
          { name: "HTML", value: 0, color: "#22C55E" },
          { name: "CSS", value: 0, color: "#3B82F6" },
          { name: "JavaScript", value: 0, color: "#F59E0B" },
          { name: "React", value: 0, color: "#E5E7EB" },
        ];

  const achievements = buildAchievements(stats);

  // Compute weekly trend: compare last 3 days vs first 4 days
  const recentHours = weeklyData.slice(-3).reduce((s, d) => s + d.hours, 0);
  const earlierHours = weeklyData.slice(0, 4).reduce((s, d) => s + d.hours, 0);
  const weeklyTrend =
    earlierHours > 0
      ? Math.round(((recentHours - earlierHours) / earlierHours) * 100)
      : 0;
  const totalWeeklyHours = weeklyData.reduce((s, d) => s + d.hours, 0);

  return (
    <div className="space-y-8">
      {/* Stat cards — values from GET /api/progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-4">
            {error}
          </div>
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Lessons Completed"
              value={String(stats?.lessonsCompleted ?? 0)}
              change="All time"
              changeType="neutral"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              delay={0}
            />
            <StatCard
              icon={Clock}
              label="Total Study Time"
              value={`${((stats?.studyTime ?? 0) / 60).toFixed(1)}h`}
              change="All time"
              changeType="neutral"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              delay={0.05}
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={`${stats?.streak ?? 0} days`}
              change={`Best: ${stats?.streak ?? 0}`}
              changeType="positive"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              delay={0.1}
            />
            <StatCard
              icon={Trophy}
              label="Total XP"
              value={(stats?.xp ?? 0).toLocaleString()}
              change="All time"
              changeType="neutral"
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly study chart */}
        <DashboardCard className="lg:col-span-2" delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Weekly Study Hours
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Hours spent learning each day
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                weeklyTrend >= 0
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-destructive bg-destructive/10"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />{" "}
              {totalWeeklyHours > 0
                ? `${weeklyTrend >= 0 ? "+" : ""}${weeklyTrend}%`
                : "No data"}
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "0.8125rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Activity breakdown pie */}
        <DashboardCard delay={0.15}>
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Activity Breakdown
          </h3>
          <p className="text-muted-foreground mb-4 text-xs">
            How you spend your time
          </p>
          <div className="h-44 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {activityTypeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "0.8125rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {activityTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground text-xs">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Skills + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill mastery */}
        <DashboardCard delay={0.2}>
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Skill Mastery
          </h3>
          <p className="text-muted-foreground mb-6 text-xs">
            Your proficiency across core skills
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {skillBreakdown.map((skill) => (
              <CircularProgress
                key={skill.name}
                value={skill.value}
                size={100}
                strokeWidth={7}
                color={skill.color}
                label={skill.name}
                sublabel={skill.value === 0 ? "Locked" : `${skill.value}%`}
              />
            ))}
          </div>
        </DashboardCard>

        {/* Monthly progress */}
        <DashboardCard delay={0.25}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Monthly Progress
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Lessons completed per week
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">Goal: 15/week</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  stroke="#94A3B8"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "0.8125rem",
                  }}
                />
                <Bar dataKey="lessons" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Achievements */}
      <DashboardCard delay={0.3}>
        <h3 className="text-foreground mb-1 text-base font-semibold">
          Achievements
        </h3>
        <p className="text-muted-foreground mb-5 text-xs">
          Milestones on your learning journey
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={`flex flex-col items-center text-center p-4 rounded-xl border ${
                a.earned
                  ? "border-yellow-200/50 bg-yellow-50 focus:border-primary"
                  : "border-border bg-card opacity-50"
              }`}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-foreground mt-2 text-xs font-semibold">
                {a.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[0.625rem]">
                {a.description}
              </p>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
