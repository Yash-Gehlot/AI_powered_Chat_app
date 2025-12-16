import { DataTypes } from "sequelize";
import sequelize from "../config/db-connection.js";

const Message = sequelize.define("Message", {
  userId: {
    type: DataTypes.UUID, // ✅ Changed from STRING to UUID to match User.id
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  message: {
    type: DataTypes.TEXT, // Changed from STRING to TEXT for longer messages
    allowNull: false,
  },
  roomName: {
    type: DataTypes.STRING,
    allowNull: true, // For personal chats
    index: true, // Add index for faster queries
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Message;
