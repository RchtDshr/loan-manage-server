const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true }, // The expected amount
  amountPaid: { type: Number, default: 0 }, // The amount the user has actually paid
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' }
});

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  term: { type: Number, required: true }, // term in weeks
  status: { type: String, enum: ['PENDING', 'APPROVED', 'PAID'], default: 'PENDING' },
  repayments: [repaymentSchema], // list of repayments
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);
