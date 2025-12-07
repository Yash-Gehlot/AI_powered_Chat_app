import Message from "../models/message.js";
import User from "../models/user.js";
import { getSmartReplies } from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(401).json({
        message: "Please enter message",
      });
    }

    const createdMessage = await Message.create({ userId, message });

    return res.json({
      message: "Sent",
      createdMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    let aiReplies = [];
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      aiReplies = await getSmartReplies(last.message);
    }

    return res.status(200).json({
      message: "Success",
      messages,
      aiReplies,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};
