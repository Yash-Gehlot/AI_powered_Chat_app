import { DataTypes } from "sequelize";
import sequelize from "../config/db-connection.js";

const ArchivedMessage = sequelize.define("ArchivedMessage", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default ArchivedMessage;
