import express from "express";
import { sendMessage, getMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/receve", getMessage);

export default router;
