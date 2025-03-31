const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['tithe', 'offering', 'donation']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'bank_transfer']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  reference: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema); 