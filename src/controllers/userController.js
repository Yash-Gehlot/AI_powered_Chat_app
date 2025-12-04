import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    if (!username || !email || !phoneNumber || !password) {
      return res.status(401).json({
        message: "Invalid credentails.",
        success: false,
      });
    }

    const checkExistingUser = await User.findOne({
      where: { email },
    });
    if (checkExistingUser) {
      return res.status(409).json({
        message: "User is already registered!.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //10 → Salt rounds (how many times to scramble)

    await User.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Failed to add user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); //Checks if the password matches the hashed password in database.
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET); // Generating token

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
