const Chat = require("../models/Chat");
const { sendMessage } = require("../services/chat.service");

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const senderId = req.user.id || req.user._id;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chat = await sendMessage({
      senderId,
      receiverId,
      message: message.trim(),
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role");

    return res.status(201).json({
      message: "Message sent successfully",
      chat: populatedChat,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChatByUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const otherUserId = req.params.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chats = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: 1 });

    await Chat.updateMany(
      {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return res.json({ chats });
  } catch (error) {
    next(error);
  }
};