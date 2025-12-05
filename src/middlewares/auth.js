import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token payload = { userId: 1 }
    req.user = { id: decoded.userId }; // THIS MUST EXIST

    next();
  } catch (err) {
    console.log("JWT Middleware error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
