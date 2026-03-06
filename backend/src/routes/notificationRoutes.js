import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotificationsHandler,
  markReadHandler,
} from "../controllers/notificationController.js";

const router = Router();

// ─── Notification Routes ────────────────────────────────────────────────────
// Protected by authMiddleware — the user must send a valid JWT.
//
// GET  /api/notifications      → latest 10 notifications for the user
// POST /api/notifications/read → mark all unread notifications as read

router.get("/", authMiddleware, getNotificationsHandler);
router.post("/read", authMiddleware, markReadHandler);

export default router;
