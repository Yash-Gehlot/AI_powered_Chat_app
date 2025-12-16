import { DataTypes } from "sequelize";
import sequelize from "../config/db-connection.js";

const ArchivedMessage = sequelize.define(
  "ArchivedMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "ArchivedMessages",
  }
);

export default ArchivedMessage;
