import Message from "../models/message.js";

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
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: { userId },
    });

    return res.status(200).json({
      message: "Success",
      messages,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
