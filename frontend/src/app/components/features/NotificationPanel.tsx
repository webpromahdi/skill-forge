import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Lightbulb, AlertCircle, Trophy, X } from "lucide-react";
import {
  getNotifications,
  markAllRead,
  type Notification,
} from "../../../services/notificationService";

// ── Icon / colour config per notification type ──────────────────────────────
const typeConfig: Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
> = {
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

const fallbackConfig = {
  icon: Lightbulb,
  bg: "bg-gray-100",
  color: "text-gray-600",
};

// ── Format relative time from ISO timestamp ─────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  // ── State from GET /api/notifications ──
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications whenever the panel opens
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await getNotifications();
    if (res.success) {
      setNotifications(res.data);
      setError(null);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // Mark all as read → POST /api/notifications/read, then refresh
  async function handleMarkAllRead() {
    const res = await markAllRead();
    if (res.success) {
      // Optimistic UI update — set all to read immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
            {/* Header with unread badge */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3
                  className="text-[#0F172A]"
                  style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                >
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

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                /* Skeleton loading state */
                <div className="divide-y divide-gray-50">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* Error fallback */
                <div
                  className="px-4 py-8 text-center text-gray-400"
                  style={{ fontSize: "0.8125rem" }}
                >
                  <p className="text-red-500 mb-1">
                    Failed to load notifications
                  </p>
                  <button
                    onClick={fetchNotifications}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                /* Empty state */
                <div
                  className="px-4 py-8 text-center text-gray-400"
                  style={{ fontSize: "0.8125rem" }}
                >
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification, i) => {
                  const config =
                    typeConfig[notification.type] || fallbackConfig;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${
                        !notification.is_read ? "bg-blue-50/30" : ""
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
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: notification.is_read ? 400 : 600,
                            }}
                          >
                            {notification.title}
                          </p>
                          {/* Blue dot indicator for unread notifications */}
                          {!notification.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>
                        <p
                          className="text-gray-500 truncate"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {notification.message}
                        </p>
                        <p
                          className="text-gray-400 mt-0.5"
                          style={{ fontSize: "0.6875rem" }}
                        >
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Mark all as read footer — calls POST /api/notifications/read */}
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={`cursor-pointer ${
                  unreadCount > 0
                    ? "text-blue-600"
                    : "text-gray-300 cursor-default"
                }`}
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
