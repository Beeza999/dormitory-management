const Payment = require("../models/Payment");
const { uploadPaymentSlip, reviewPayment } = require("../services/payment.service");

exports.uploadSlip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Slip image is required" });
    }

    const { billId, amount } = req.body;

    if (!billId) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const payment = await uploadPaymentSlip({
      billId,
      userId: req.user.id || req.user._id,
      amount,
      slipImage: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      message: "Payment slip uploaded",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("billId")
      .populate("userId", "name email phone")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    return res.json({ payments });
  } catch (error) {
    next(error);
  }
};

exports.approvePayment = async (req, res, next) => {
  try {
    const payment = await reviewPayment({
      paymentId: req.params.id,
      status: "approved",
      note: req.body.note || "",
      reviewerId: req.user.id || req.user._id,
    });

    return res.json({
      message: "Payment approved",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectPayment = async (req, res, next) => {
  try {
    const payment = await reviewPayment({
      paymentId: req.params.id,
      status: "rejected",
      note: req.body.note || "",
      reviewerId: req.user.id || req.user._id,
    });

    return res.json({
      message: "Payment rejected",
      payment,
    });
  } catch (error) {
    next(error);
  }
};