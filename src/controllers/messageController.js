import Message from "../models/message.js";
import User from "../models/user.js";
import { getSmartReplies } from "../services/geminiService.js";
import { Op } from "sequelize";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, roomName } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Please enter message",
      });
    }

    // Create message with roomName
    const createdMessage = await Message.create({
      userId,
      message,
      roomName: roomName || null,
      isRead: false,
    });

    return res.json({
      message: "Sent",
      createdMessage,
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { roomName } = req.query;

    let whereClause = {};

    // If roomName provided, ONLY get messages from that specific room
    if (roomName) {
      whereClause.roomName = roomName;
    }

    const messages = await Message.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // AI replies for last message
    let aiReplies = ["Yes", "No", "Okay"];

    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      try {
        aiReplies = await getSmartReplies(last.message);
      } catch (aiError) {
        console.error("AI reply generation failed:", aiError.message);
      }
    }

    return res.status(200).json({
      message: "Success",
      messages,
      aiReplies,
    });
  } catch (err) {
    console.error("getMessage error:", err);
    return res.status(500).json({
      error: err.message,
      message: "Failed to fetch messages",
    });
  }
};

// New endpoint to get unread message counts
export const getUnreadCounts = async (req, res) => {
  try {
    const currentUserEmail = req.user.email;

    // Get all rooms where current user is a participant
    const messages = await Message.findAll({
      where: {
        roomName: {
          [Op.like]: `%${currentUserEmail}%`,
        },
        isRead: false,
      },
      include: [
        {
          model: User,
          attributes: ["email"],
        },
      ],
    });

    // Count unread messages per room
    const unreadCounts = {};

    messages.forEach((msg) => {
      // Only count if message is NOT from current user
      if (msg.User.email !== currentUserEmail) {
        const room = msg.roomName;
        unreadCounts[room] = (unreadCounts[room] || 0) + 1;
      }
    });

    return res.status(200).json({
      success: true,
      unreadCounts,
    });
  } catch (err) {
    console.error("getUnreadCounts error:", err);
    return res.status(500).json({
      error: err.message,
      message: "Failed to fetch unread counts",
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { roomName } = req.body;
    const currentUserId = req.user.id;

    if (!roomName) {
      return res.status(400).json({
        message: "Room name required",
      });
    }

    // Mark all messages in this room as read (except user's own messages)
    await Message.update(
      { isRead: true },
      {
        where: {
          roomName,
          userId: { [Op.ne]: currentUserId },
          isRead: false,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (err) {
    console.error("markAsRead error:", err);
    return res.status(500).json({
      error: err.message,
      message: "Failed to mark messages as read",
    });
  }
};
