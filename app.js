import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http"; // NEW
import { WebSocketServer } from "ws"; // NEW

import sequelize from "./src/config/db-connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/messageRoutes.js";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// BODY PARSERS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC FILES
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(express.static(path.join(__dirname, "src", "views")));

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "signup.html"));
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let sockets = [];
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  sockets.push(ws);

  ws.on("message", (message) => {
    sockets.forEach((s) => {
      s.send(message);
    });
  });
});

export { wss };

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
