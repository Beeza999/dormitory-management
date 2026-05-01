const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, targetType = "all", targetId = null } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetType,
      targetId,
      createdBy: req.user.id || req.user._id,
    });

    if (targetType === "all") {
      const users = await User.find({ role: "user", isActive: true }).select("_id");

      if (users.length > 0) {
        const notifications = users.map((user) => ({
          userId: user._id,
          title,
          message,
          type: "announcement",
          isRead: false,
        }));

        await Notification.insertMany(notifications);
      }
    }

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({ announcements });
  } catch (error) {
    next(error);
  }
};