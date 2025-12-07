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

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }

    const verifiedEmail = await User.findOne({
      where: { email },
      attributes: ["email"],
    });

    if (!verifiedEmail) {
      return res.status(404).json({
        message: "Not found",
        success: false,
      });
    }

    return res.status(200).json({
      verifiedEmail,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
