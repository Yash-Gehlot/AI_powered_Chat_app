import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import sequelize from "./src/config/db-connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/messageRoutes.js";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`${socket.id} : User Connected 💖`);

  socket.on("send-message", (message) => {
    console.log(`User : ${socket.id} -- Message : ${message}`);
    io.emit("receive-message", message);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
