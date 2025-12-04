import { DataTypes } from "sequelize";
import sequelize from "../config/db-connection.js";

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
