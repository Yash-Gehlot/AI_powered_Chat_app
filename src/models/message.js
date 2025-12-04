import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Message = sequelize.define("Message", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Message;
