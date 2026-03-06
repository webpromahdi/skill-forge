import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  BookOpen,
  Trophy,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "completed" | "recommendation" | "reminder" | "achievement";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "completed",
    title: "Lesson Completed",
    message: "You finished CSS Flexbox Layout",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "recommendation",
    title: "New Recommendation",
    message: "DOM Manipulation is now available based on your progress",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "Quiz Reminder",
    message: "JavaScript Basics quiz is due in 2 days",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You earned the Quick Learner badge!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "completed",
    title: "Lesson Completed",
    message: "You finished Box Model Deep Dive",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "recommendation",
    title: "Weekly Summary",
    message: "You studied 4.5 hours this week. Keep it up!",
    time: "2 days ago",
    read: true,
  },
];

const typeConfig = {
  completed: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  recommendation: {
    icon: Lightbulb,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  reminder: {
    icon: AlertCircle,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  achievement: {
    icon: Trophy,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-100 shadow-xl z-40 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-[#0F172A]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full"
                    style={{ fontSize: "0.625rem", fontWeight: 600 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification, i) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${
                      !notification.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[#0F172A] truncate"
                          style={{ fontSize: "0.8125rem", fontWeight: notification.read ? 400 : 600 }}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-500 truncate" style={{ fontSize: "0.75rem" }}>
                        {notification.message}
                      </p>
                      <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.6875rem" }}>
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button
                className="text-blue-600 cursor-pointer"
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
