const Chat = require("../models/Chat");
const { createNotification } = require("./notification.service");

async function sendMessage({ senderId, receiverId, message }) {
  const chat = await Chat.create({
    senderId,
    receiverId,
    message,
  });

  if (createNotification) {
    await createNotification({
      userId: receiverId,
      title: "New message",
      message,
      type: "chat",
    });
  }

  return chat;
}

module.exports = {
  sendMessage,
};