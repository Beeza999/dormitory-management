const Payment = require("../models/Payment");
const Bill = require("../models/Bill");

const uploadPaymentSlip = async ({ billId, userId, amount, slipImage }) => {
  const bill = await Bill.findById(billId);

  if (!bill) {
    throw new Error("Bill not found");
  }

  if (String(bill.userId) !== String(userId)) {
    throw new Error("You can upload slip only for your own bill");
  }

  if (bill.status === "paid") {
    throw new Error("This bill is already paid");
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid amount");
  }

  const payment = await Payment.create({
    billId,
    userId,
    amount: numericAmount,
    slipImage,
    status: "pending",
  });

  bill.status = "pending";
  await bill.save();

  return payment;
};

const reviewPayment = async ({ paymentId, status, note, reviewerId }) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid payment status");
  }

  payment.status = status;
  payment.note = note || "";
  payment.reviewedBy = reviewerId;
  payment.reviewedAt = new Date();
  await payment.save();

  const bill = await Bill.findById(payment.billId);

  if (bill) {
    if (status === "approved") {
      bill.status = "paid";
    } else if (status === "rejected") {
      bill.status = "unpaid";
    }

    await bill.save();
  }

  return payment;
};

module.exports = {
  uploadPaymentSlip,
  reviewPayment,
};