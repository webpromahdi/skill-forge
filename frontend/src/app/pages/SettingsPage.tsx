import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardCard } from "../components/ui/DashboardCard";
import {
  User,
  Mail,
  Target,
  Clock,
  Bell,
  BellRing,
  CalendarCheck,
  Save,
  Camera,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function SettingsPage() {
  // ── Load the authenticated user from AuthContext ──
  // The form's initial values come from the logged-in user instead of
  // being hardcoded.  An effect keeps them in sync if the user object
  // loads asynchronously (e.g. after a page refresh).
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
  });

  // ── Sync form state when the user object arrives or changes ──
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // ── Build initials from the user's name (dynamic) ──
  const displayName = profile.name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [preferences, setPreferences] = useState({
    goal: "Frontend Developer",
    dailyTime: "1 hour",
  });
  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    quizReminders: true,
    weeklyReport: true,
    newRecommendations: false,
    achievements: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const goalOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "Data Science",
  ];
  const timeOptions = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "3 hours",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <DashboardCard delay={0}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-gray-500" />
          <h3
            className="text-[#0F172A]"
            style={{ fontSize: "1.125rem", fontWeight: 600 }}
          >
            Profile
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white"
              style={{ fontSize: "1.5rem", fontWeight: 700 }}
            >
              {/* Dynamic initials from authenticated user */}
              {initials}
            </div>
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
              aria-label="Change avatar"
            >
              <Camera className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          {/* Form fields */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label
                htmlFor="settings-name"
                className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label
                htmlFor="settings-email"
                className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Learning Preferences */}
      <DashboardCard delay={0.1}>
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-gray-500" />
          <h3
            className="text-[#0F172A]"
            style={{ fontSize: "1.125rem", fontWeight: 600 }}
          >
            Learning Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-goal"
              className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              <Target className="w-3.5 h-3.5 text-gray-400" /> Learning Goal
            </label>
            <select
              id="settings-goal"
              value={preferences.goal}
              onChange={(e) =>
                setPreferences({ ...preferences, goal: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
              style={{ fontSize: "0.875rem" }}
            >
              {goalOptions.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="settings-time"
              className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Daily Learning
              Time
            </label>
            <select
              id="settings-time"
              value={preferences.dailyTime}
              onChange={(e) =>
                setPreferences({ ...preferences, dailyTime: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
              style={{ fontSize: "0.875rem" }}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Notifications */}
      <DashboardCard delay={0.2}>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-gray-500" />
          <h3
            className="text-[#0F172A]"
            style={{ fontSize: "1.125rem", fontWeight: 600 }}
          >
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "lessonReminders" as const,
              icon: BellRing,
              label: "Lesson Reminders",
              description: "Get reminded to continue your daily lessons",
            },
            {
              key: "quizReminders" as const,
              icon: CalendarCheck,
              label: "Quiz Reminders",
              description: "Notifications before upcoming quiz deadlines",
            },
            {
              key: "weeklyReport" as const,
              icon: Clock,
              label: "Weekly Report",
              description: "Receive a weekly summary of your progress",
            },
            {
              key: "newRecommendations" as const,
              icon: Target,
              label: "New Recommendations",
              description: "Be notified when new topics are recommended",
            },
            {
              key: "achievements" as const,
              icon: Bell,
              label: "Achievement Alerts",
              description: "Get notified when you unlock achievements",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p
                    className="text-[#0F172A]"
                    style={{ fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {item.label}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                    {item.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [item.key]: !notifications[item.key],
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                  notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={notifications[item.key]}
                aria-label={item.label}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{
                    left: notifications[item.key] ? "calc(100% - 22px)" : "2px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Save button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white transition-colors cursor-pointer ${
            saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 600 }}
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>
    </div>
  );
}
