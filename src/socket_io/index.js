import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./handlers/chat.js";
import personalChat from "./handlers/personalChat.js";
import groupChat from "./handlers/groupChat.js";

const socketServer = (server) => {
  const io = new Server(server);

  socketAuth(io);

  io.on("connection", (socket) => {
    console.log(`${socket.id} : User Connected `);
    chatHandler(socket, io);
    personalChat(socket, io);
    groupChat(socket, io); 
  });

  return io;
};

export default socketServer;