import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // utility to convert file URLs to regular file paths (needed for ES modules).

import sequelize from "./src/config/db-connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/messageRoutes.js";

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url); //Gets the current file's directory path (ES modules don't have __dirname by default).
const __dirname = path.dirname(__filename);

dotenv.config({ quiet: true });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "public")));
app.use(express.static(path.join(__dirname, "src", "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "signup.html"));
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
