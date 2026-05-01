function registerChatSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join_room', (userId) => {
      socket.join(String(userId));
    });

    socket.on('send_message', (payload) => {
      if (!payload?.receiverId) return;
      io.to(String(payload.receiverId)).emit('receive_message', payload);
    });

    socket.on('disconnect', () => {
      // disconnected
    });
  });
}

module.exports = registerChatSocket;
