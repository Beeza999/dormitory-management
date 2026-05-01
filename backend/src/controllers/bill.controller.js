const Bill = require('../models/Bill');
const { createBill, updateBill: updateBillService } = require('../services/bill.service');

exports.getBills = async (req, res, next) => {
  try {
    const bills = await Bill.find()
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber building');
    res.json({ bills });
  } catch (error) {
    next(error);
  }
};

exports.createBill = async (req, res, next) => {
  try {
    const bill = await createBill(req.body);
    res.status(201).json({ message: 'Bill created', bill });
  } catch (error) {
    next(error);
  }
};

exports.getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber building');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ bill });
  } catch (error) {
    next(error);
  }
};

exports.updateBill = async (req, res, next) => {
  try {
    const bill = await updateBillService(req.params.id, req.body);
    res.json({ message: 'Bill updated', bill });
  } catch (error) {
    next(error);
  }
};

exports.getMyBills = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const bills = await Bill.find({ userId })
      .populate('roomId', 'roomNumber building')
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json({ bills });
  } catch (error) {
    next(error);
  }
};

exports.getMyHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const bills = await Bill.find({ userId, status: 'paid' })
      .populate('roomId', 'roomNumber building')
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json({ bills });
  } catch (error) {
    next(error);
  }
};