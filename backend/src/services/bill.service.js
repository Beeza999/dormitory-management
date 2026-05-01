const Bill = require('../models/Bill');
const Room = require('../models/Room');
const User = require('../models/User');
const { createNotification } = require('./notification.service');

async function createBill(payload) {
  const {
    userId,
    roomId,
    month,
    year,
    waterUnits = 0,
    electricUnits = 0,
    otherAmount = 0,
    dueDate,
    note = '',
  } = payload;

  const room = await Room.findById(roomId);
  const user = await User.findById(userId);

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const rentAmount = Number(room.rentPrice || 0);
  const waterAmount = Number(waterUnits || 0) * Number(room.waterRate || 0);
  const electricAmount = Number(electricUnits || 0) * Number(room.electricRate || 0);
  const totalAmount =
    rentAmount +
    waterAmount +
    electricAmount +
    Number(otherAmount || 0);

  const bill = await Bill.create({
    userId,
    roomId,
    month: Number(month),
    year: Number(year),
    rentAmount,
    waterUnits: Number(waterUnits || 0),
    waterAmount,
    electricUnits: Number(electricUnits || 0),
    electricAmount,
    otherAmount: Number(otherAmount || 0),
    totalAmount,
    dueDate,
    note,
  });

  await createNotification({
    userId,
    title: 'New bill created',
    message: `Your bill for ${month}/${year} is ${totalAmount}`,
    type: 'bill',
  });

  return bill;
}

async function updateBill(billId, payload) {
  const {
    userId,
    roomId,
    month,
    year,
    waterUnits = 0,
    electricUnits = 0,
    otherAmount = 0,
    dueDate,
    note = '',
    status,
  } = payload;

  const existingBill = await Bill.findById(billId);

  if (!existingBill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingBill.status === 'paid') {
    const error = new Error('Paid bill cannot be edited');
    error.statusCode = 400;
    throw error;
  }

  const finalUserId = userId || existingBill.userId;
  const finalRoomId = roomId || existingBill.roomId;

  const room = await Room.findById(finalRoomId);
  const user = await User.findById(finalUserId);

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const rentAmount = Number(room.rentPrice || 0);
  const waterAmount = Number(waterUnits || 0) * Number(room.waterRate || 0);
  const electricAmount = Number(electricUnits || 0) * Number(room.electricRate || 0);
  const totalAmount =
    rentAmount +
    waterAmount +
    electricAmount +
    Number(otherAmount || 0);

  existingBill.userId = finalUserId;
  existingBill.roomId = finalRoomId;
  existingBill.month = Number(month ?? existingBill.month);
  existingBill.year = Number(year ?? existingBill.year);
  existingBill.rentAmount = rentAmount;
  existingBill.waterUnits = Number(waterUnits || 0);
  existingBill.waterAmount = waterAmount;
  existingBill.electricUnits = Number(electricUnits || 0);
  existingBill.electricAmount = electricAmount;
  existingBill.otherAmount = Number(otherAmount || 0);
  existingBill.totalAmount = totalAmount;
  existingBill.dueDate = dueDate || existingBill.dueDate;
  existingBill.note = note ?? existingBill.note;

  if (status && ['unpaid', 'pending', 'paid'].includes(status)) {
    existingBill.status = status;
  }

  await existingBill.save();

  await createNotification({
    userId: finalUserId,
    title: 'Bill updated',
    message: `Your bill for ${existingBill.month}/${existingBill.year} was updated. New total: ${existingBill.totalAmount}`,
    type: 'bill',
  });

  return existingBill;
}

module.exports = {
  createBill,
  updateBill,
};