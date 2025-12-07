import express from "express";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/auth.js";
const router = express.Router();

router.post("/send", authenticateToken, sendMessage);
router.get("/receive", authenticateToken, getMessage);

export default router;
