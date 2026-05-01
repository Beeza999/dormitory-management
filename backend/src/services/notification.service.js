const Notification = require('../models/Notification');
const Announcement = require('../models/Announcement');
const User = require('../models/User');

async function createNotification({ userId, title, message, type = 'system' }) {
  return Notification.create({ userId, title, message, type });
}

async function createAnnouncementNotifications(announcement) {
  let users = [];

  if (announcement.targetType === 'all') {
    users = await User.find({ role: 'user', isActive: true }).select('_id');
  } else if (announcement.targetType === 'user' && announcement.targetId) {
    users = [{ _id: announcement.targetId }];
  } else if (announcement.targetType === 'room' && announcement.targetId) {
    users = await User.find({ roomId: announcement.targetId, role: 'user', isActive: true }).select('_id');
  }

  if (!users.length) {
    return [];
  }

  const docs = users.map((user) => ({
    userId: user._id,
    title: announcement.title,
    message: announcement.message,
    type: 'announcement'
  }));

  return Notification.insertMany(docs);
}

async function createAnnouncement(payload) {
  const announcement = await Announcement.create(payload);
  await createAnnouncementNotifications(announcement);
  return announcement;
}

module.exports = {
  createNotification,
  createAnnouncement
};
