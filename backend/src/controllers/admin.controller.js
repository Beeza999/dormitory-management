const User = require('../models/User');
const Room = require('../models/Room');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Announcement = require('../models/Announcement');
const buildAdminDashboard = require('../utils/buildAdminDashboard');

exports.getDashboard = async (req, res, next) => {
  try {
    const [rooms, bills, payments, users, announcements] = await Promise.all([
      Room.find(),
      Bill.find(),
      Payment.find(),
      User.find(),
      Announcement.find()
    ]);

    const dashboard = buildAdminDashboard({ rooms, bills, payments, users, announcements });
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const [revenueByMonth, unpaidBills, vacantRooms] = await Promise.all([
      Bill.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            totalRevenue: { $sum: '$totalAmount' },
            billsCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]),
      Bill.find({ status: { $in: ['unpaid', 'overdue', 'pending'] } }).populate('userId roomId'),
      Room.find({ status: 'vacant' })
    ]);

    res.json({ revenueByMonth, unpaidBills, vacantRooms });
  } catch (error) {
    next(error);
  }
};
