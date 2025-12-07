import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import socketIo from "./src/socket_io/index.js";
import "./src/models/index.js";
import sequelize from "./src/config/db-connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/messageRoutes.js";

dotenv.config({ quiet: true });
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);
socketIo(server);

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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
