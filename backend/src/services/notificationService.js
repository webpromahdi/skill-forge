import supabase from "../database/supabaseClient.js";

// ─── Notification Service ───────────────────────────────────────────────────
// Data-access layer for the notifications table.
// Provides read and bulk-update operations for user notifications.

// ─── getNotifications ───────────────────────────────────────────────────────
// Fetches the latest 10 notifications for a given user, ordered newest-first.
// This feeds the NotificationPanel dropdown in the dashboard header.
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, message, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
}

// ─── markAllRead ────────────────────────────────────────────────────────────
// Sets is_read = true for every unread notification belonging to the user.
// Called when the user clicks "Mark all as read" in the NotificationPanel.
export async function markAllRead(userId) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
}
