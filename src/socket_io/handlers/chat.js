const chatHandler = (socket, io) => {
  socket.on("send-message", (data) => {
    console.log(`User : ${socket.user.name} -- Message : ${data.message}`);

    socket.broadcast.emit("receive-message", {
      username: socket.user.name,
      message: data.message,
    });
  });
};

export default chatHandler;
