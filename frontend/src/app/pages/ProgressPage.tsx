import { motion } from "motion/react";
import { DashboardCard } from "../components/ui/DashboardCard";
import { StatCard } from "../components/ui/StatCard";
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

const weeklyData = [
  { day: "Mon", hours: 1.5, xp: 180 },
  { day: "Tue", hours: 2.0, xp: 240 },
  { day: "Wed", hours: 0.5, xp: 60 },
  { day: "Thu", hours: 1.8, xp: 210 },
  { day: "Fri", hours: 2.5, xp: 300 },
  { day: "Sat", hours: 3.0, xp: 350 },
  { day: "Sun", hours: 1.2, xp: 140 },
];

const monthlyData = [
  { week: "W1", hours: 8, lessons: 12 },
  { week: "W2", hours: 10, lessons: 15 },
  { week: "W3", hours: 6, lessons: 9 },
  { week: "W4", hours: 12, lessons: 18 },
];

const skillBreakdown = [
  { name: "HTML", value: 100, color: "#22C55E" },
  { name: "CSS", value: 85, color: "#3B82F6" },
  { name: "JavaScript", value: 45, color: "#F59E0B" },
  { name: "React", value: 0, color: "#E5E7EB" },
];

const activityTypeData = [
  { name: "Videos", value: 35, color: "#3B82F6" },
  { name: "Reading", value: 25, color: "#8B5CF6" },
  { name: "Practice", value: 30, color: "#22C55E" },
  { name: "Quizzes", value: 10, color: "#F59E0B" },
];

const achievements = [
  { title: "First Lesson", description: "Complete your first lesson", earned: true, icon: "🎯" },
  { title: "Week Streak", description: "7-day learning streak", earned: true, icon: "🔥" },
  { title: "Quick Learner", description: "Complete 5 lessons in a day", earned: true, icon: "⚡" },
  { title: "Quiz Master", description: "Score 100% on 3 quizzes", earned: false, icon: "🏆" },
  { title: "Code Warrior", description: "Complete 10 practice projects", earned: false, icon: "💻" },
  { title: "Consistent", description: "30-day learning streak", earned: false, icon: "📅" },
];

export function ProgressPage() {
  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Lessons Completed"
          value="24"
          change="+3 this week"
          changeType="positive"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Total Study Time"
          value="42.5h"
          change="+4.5h this week"
          changeType="positive"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          delay={0.05}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value="12 days"
          change="Personal best!"
          changeType="positive"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          delay={0.1}
        />
        <StatCard
          icon={Trophy}
          label="Total XP"
          value="2,340"
          change="+480 this week"
          changeType="positive"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly study chart */}
        <DashboardCard className="lg:col-span-2" delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[#0F172A]" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                Weekly Study Hours
              </h3>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
                Hours spent learning each day
              </p>
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              <TrendingUp className="w-3.5 h-3.5" /> +18%
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
          <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
            Activity Breakdown
          </h3>
          <p className="text-gray-400 mb-4" style={{ fontSize: "0.75rem" }}>
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
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600" style={{ fontSize: "0.75rem" }}>
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
          <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
            Skill Mastery
          </h3>
          <p className="text-gray-400 mb-6" style={{ fontSize: "0.75rem" }}>
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
              <h3 className="text-[#0F172A]" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                Monthly Progress
              </h3>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
                Lessons completed per week
              </p>
            </div>
            <div className="flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-gray-500">Goal: 15/week</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94A3B8" />
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
        <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
          Achievements
        </h3>
        <p className="text-gray-400 mb-5" style={{ fontSize: "0.75rem" }}>
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
                  ? "border-yellow-200 bg-yellow-50/50"
                  : "border-gray-100 bg-gray-50/50 opacity-50"
              }`}
            >
              <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
              <p className="text-[#0F172A] mt-2" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {a.title}
              </p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.625rem" }}>
                {a.description}
              </p>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
