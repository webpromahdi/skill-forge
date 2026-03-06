import {
  getNotifications,
  markAllRead,
} from "../services/notificationService.js";

// ─── Notification Controller ────────────────────────────────────────────────
// HTTP handlers for the /api/notifications endpoints.
// All routes are protected by authMiddleware, so req.user is always set.

// ─── getNotificationsHandler ────────────────────────────────────────────────
// GET /api/notifications
//
// Returns the latest 10 notifications for the authenticated user, ordered
// newest-first.  The frontend uses this to populate the NotificationPanel
// and to compute the unread badge count.
export const getNotificationsHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getNotifications(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET NOTIFICATIONS ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// ─── markReadHandler ────────────────────────────────────────────────────────
// POST /api/notifications/read
//
// Marks all unread notifications as read for the authenticated user.
// The frontend calls this when the user clicks "Mark all as read".
export const markReadHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    await markAllRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("[MARK NOTIFICATIONS READ ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};
