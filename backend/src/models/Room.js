const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    floor: {
      type: Number,
      default: 1
    },
    building: {
      type: String,
      default: 'A',
      trim: true
    },
    rentPrice: {
      type: Number,
      required: [true, 'Rent price is required'],
      min: 0
    },
    waterRate: {
      type: Number,
      default: 0,
      min: 0
    },
    electricRate: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['vacant', 'occupied', 'maintenance'],
      default: 'vacant'
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

roomSchema.index({ roomNumber: 1, building: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
