import User from "./user.js";
import Message from "./message.js";

// In your models/index.js or where you define associations
User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

// Export all models
export { User, Message };
