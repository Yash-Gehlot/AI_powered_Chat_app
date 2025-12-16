import User from "./user.js";
import Message from "./message.js";
import ArchivedMessage from "./messageArchived.js";

// Define associations
User.hasMany(Message, { foreignKey: "userId", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ArchivedMessage, { foreignKey: "userId", onDelete: "CASCADE" });
ArchivedMessage.belongsTo(User, { foreignKey: "userId" });

// Export all models
export { User, Message, ArchivedMessage };
