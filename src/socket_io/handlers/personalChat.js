export default (socket, io) => {
  // Join a private room for 1-on-1 chat
  socket.on("join-room", ({ roomName } = {}) => {
    if (!roomName) {
      console.log(`${socket.user.username} attempted to join without roomName`);
      return;
    }

    // Leave previous room if exists
    if (socket.currentPersonalRoom) {
      socket.leave(socket.currentPersonalRoom);
    }

    socket.join(roomName);
    socket.currentPersonalRoom = roomName;
    console.log(`✅ ${socket.user.username} joined room: ${roomName}`);

    // Notify the user they joined successfully
    socket.emit("room-joined", { roomName });
  });

  // Handle new messages in personal chat
  socket.on("new-message", ({ message, roomName } = {}) => {
    if (!message || !roomName) {
      console.log("❌ Invalid message or roomName");
      return;
    }

    console.log(`📨 ${socket.user.username} → ${roomName}: ${message}`);

    // Send message ONLY to the specific room (excluding sender)
    socket.to(roomName).emit("new-message", {
      username: socket.user.username,
      message,
      senderId: socket.user.id,
      senderEmail: socket.user.email,
      timestamp: new Date().toISOString(),
    });

    // Also send notification to offline user
    const [email1, email2] = roomName.split("-");
    const recipientEmail = email1 === socket.user.email ? email2 : email1;

    // Find recipient's socket and send notification
    const recipientSocket = findSocketByEmail(io, recipientEmail);

    if (recipientSocket) {
      // Check if recipient is in the same room
      const recipientInRoom = recipientSocket.rooms.has(roomName);

      if (!recipientInRoom) {
        // Send notification if not in the active chat
        recipientSocket.emit("new-notification", {
          from: socket.user.email,
          fromUsername: socket.user.username,
          roomName,
          message,
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  // Mark messages as read when user opens chat
  socket.on("mark-as-read", ({ roomName } = {}) => {
    if (!roomName) return;

    console.log(`✅ ${socket.user.username} marked ${roomName} as read`);

    // Notify other user that messages were read
    socket.to(roomName).emit("messages-read", {
      roomName,
      readBy: socket.user.email,
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user.username} disconnected`);
    if (socket.currentPersonalRoom) {
      socket.leave(socket.currentPersonalRoom);
    }
  });
};

// Helper function to find socket by email
function findSocketByEmail(io, email) {
  const sockets = io.sockets.sockets;
  for (let [, socket] of sockets) {
    if (socket.user && socket.user.email === email) {
      return socket;
    }
  }
  return null;
}
