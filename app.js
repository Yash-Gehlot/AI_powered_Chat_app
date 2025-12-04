import express from "express";
import dotenv from "dotenv";
import path from "path";

import sequelize from "./src/config/db-connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/messageRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/chat", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/chat.html"));
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
