import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ msg: "userId and message required" });
    }

    const newMsg = await Message.create({ userId, message });

    return res.json({
      success: true,
      data: newMsg,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};
