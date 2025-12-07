import express from "express";
import { signup, login, getUsers } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/all", authenticateToken, getUsers);
export default router;
