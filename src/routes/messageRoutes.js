import express from "express";
import {
  sendMessage,
  getMessage,
  getUnreadCounts,
  markAsRead,
} from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", authenticateToken, sendMessage);
router.get("/receive", authenticateToken, getMessage);
router.get("/unread-counts", authenticateToken, getUnreadCounts);
router.post("/mark-read", authenticateToken, markAsRead);

export default router;
