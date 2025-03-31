const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');

// Validation middleware
const validatePayment = [
  body('memberName').trim().notEmpty().withMessage('Member name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('paymentType').isIn(['tithe', 'offering', 'donation']).withMessage('Invalid payment type'),
  body('paymentMethod').isIn(['cash', 'card', 'bank_transfer']).withMessage('Invalid payment method'),
  body('notes').optional().trim()
];

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new payment
router.post('/', validatePayment, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const payment = new Payment({
      ...req.body,
      reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    const newPayment = await payment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get payment by reference
router.get('/:reference', async (req, res) => {
  try {
    const payment = await Payment.findOne({ reference: req.params.reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 