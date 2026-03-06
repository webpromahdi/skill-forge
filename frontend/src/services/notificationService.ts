// ─── Notification Service (Frontend) ─────────────────────────────────────────
// Fetches and manages the authenticated user's notifications.
// The JWT is automatically attached by apiFetch.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: "completed" | "recommendation" | "reminder" | "achievement";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsSuccess {
  success: true;
  data: Notification[];
}

interface NotificationsError {
  success: false;
  message: string;
}

export type NotificationsResponse = NotificationsSuccess | NotificationsError;

interface MarkReadSuccess {
  success: true;
  message: string;
}

interface MarkReadError {
  success: false;
  message: string;
}

type MarkReadResponse = MarkReadSuccess | MarkReadError;

// ─── getNotifications ───────────────────────────────────────────────────────
// Calls GET /notifications.  Returns the latest 10 notifications for the
// authenticated user, ordered newest-first.
export async function getNotifications(): Promise<NotificationsResponse> {
  try {
    return await apiFetch<NotificationsResponse>("/notifications");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── markAllRead ────────────────────────────────────────────────────────────
// Calls POST /notifications/read.  Marks all unread notifications as read.
export async function markAllRead(): Promise<MarkReadResponse> {
  try {
    return await apiFetch<MarkReadResponse>("/notifications/read", {
      method: "POST",
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
