import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./handlers/chat.js";

const socketServer = (server) => {
  const io = new Server(server);

  // auth middleware
  socketAuth(io);

  // Socket.io handshake
  io.on("connection", (socket) => {
    console.log(`${socket.id} : User Connected 💖`);
    chatHandler(socket, io);
  });

  return io;
};

export default socketServer;
