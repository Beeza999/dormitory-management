const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rentAmount: {
      type: Number,
      default: 0,
    },
    waterUnits: {
      type: Number,
      default: 0,
    },
    waterAmount: {
      type: Number,
      default: 0,
    },
    electricUnits: {
      type: Number,
      default: 0,
    },
    electricAmount: {
      type: Number,
      default: 0,
    },
    otherAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);