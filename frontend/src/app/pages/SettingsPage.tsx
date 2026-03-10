import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
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
  Phone,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getProfile, updateProfile } from "../../services/userService";
import { LearningGoalAutocomplete } from "../components/ui/LearningGoalAutocomplete";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatLearningTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours)
    ? `${hours} hour${hours !== 1 ? "s" : ""}`
    : `${hours} hours`;
}

export function SettingsPage() {
  // ── Load the authenticated user from AuthContext ──
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
  });

  // ── Extended profile fields loaded from the backend ──
  const [extendedProfile, setExtendedProfile] = useState({
    phone_number: "",
    learning_goal: "",
    daily_learning_time: 60,
    motivation: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // ── Sync auth data when user object arrives ──
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // ── Fetch backend profile on mount ──
  useEffect(() => {
    async function loadProfile() {
      const res = await getProfile();
      if (res.success) {
        const d = res.data;
        setExtendedProfile({
          phone_number: d.phone_number || "",
          learning_goal: d.learning_goal || "",
          daily_learning_time: d.daily_learning_time ?? 60,
          motivation: d.motivation || "",
        });
      }
    }
    loadProfile();
  }, []);

  // ── Build initials from the user's name (dynamic) ──
  const displayName = profile.name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    quizReminders: true,
    weeklyReport: true,
    newRecommendations: false,
    achievements: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateProfile({
        phone_number: extendedProfile.phone_number,
        learning_goal: extendedProfile.learning_goal,
        daily_learning_time: extendedProfile.daily_learning_time,
        motivation: extendedProfile.motivation,
      });

      if (res.success) {
        toast.success("Profile saved successfully!");
      } else {
        toast.error(res.message || "Failed to save profile.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <DashboardCard delay={0}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-foreground text-lg font-semibold">
            Profile
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {/* Dynamic initials from authenticated user */}
              {initials}
            </div>
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-accent cursor-pointer"
              aria-label="Change avatar"
            >
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Form fields */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label
                htmlFor="settings-name"
                className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
              </label>
              <Input
                id="settings-name"
                type="text"
                value={profile.name}
                readOnly
                className="w-full bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="settings-email"
                className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
              </label>
              <Input
                id="settings-email"
                type="email"
                value={profile.email}
                readOnly
                className="w-full bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="settings-phone"
                className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number
              </label>
              <Input
                id="settings-phone"
                type="tel"
                value={extendedProfile.phone_number}
                onChange={(e) =>
                  setExtendedProfile({
                    ...extendedProfile,
                    phone_number: e.target.value,
                  })
                }
                placeholder="+1 555 000 0000"
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="settings-motivation"
                className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5 text-muted-foreground" /> Motivation
              </label>
              <textarea
                id="settings-motivation"
                value={extendedProfile.motivation}
                onChange={(e) =>
                  setExtendedProfile({
                    ...extendedProfile,
                    motivation: e.target.value,
                  })
                }
                rows={3}
                placeholder="What drives you to keep learning?"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
              />
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Learning Preferences */}
      <DashboardCard delay={0.1}>
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-foreground text-lg font-semibold">
            Learning Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-goal"
              className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
            >
              <Target className="w-3.5 h-3.5 text-muted-foreground" /> Learning Goal
            </label>
            <LearningGoalAutocomplete
              inputId="settings-goal"
              value={extendedProfile.learning_goal}
              onChange={(v) =>
                setExtendedProfile({ ...extendedProfile, learning_goal: v })
              }
            />
          </div>
          <div>
            <label
              htmlFor="settings-time"
              className="flex items-center gap-1.5 text-foreground mb-1.5 text-[0.8125rem] font-medium"
            >
              <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Daily Learning
              Time
              {extendedProfile.daily_learning_time > 0 && (
                <span className="ml-auto text-primary font-normal text-[0.8125rem]">
                  {formatLearningTime(extendedProfile.daily_learning_time)}
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <Input
                id="settings-time"
                type="number"
                min={1}
                max={720}
                value={extendedProfile.daily_learning_time}
                onChange={(e) => {
                  const v = Math.max(
                    1,
                    Math.min(720, parseInt(e.target.value) || 1),
                  );
                  setExtendedProfile({
                    ...extendedProfile,
                    daily_learning_time: v,
                  });
                }}
                className="w-28 text-center"
              />
              <span className="text-muted-foreground text-sm">
                minutes per day
              </span>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Notifications */}
      <DashboardCard delay={0.2}>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-foreground text-lg font-semibold">
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
              className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground text-[0.875rem] font-medium">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground text-xs">
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
                  notifications[item.key] ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                role="switch"
                aria-checked={notifications[item.key]}
                aria-label={item.label}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-card shadow-sm"
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
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-5 rounded-lg text-sm font-semibold"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
