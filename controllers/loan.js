const Loan = require('../models/loan');

// Create Loan and Schedule Repayments
const createLoan = async (req, res) => {
  try {
    const { amount, term, startDate } = req.body; // Add startDate from request
    const userId = req.user.id; //from jwt

    const startLoanDate = new Date(startDate);
    const repaymentAmount = parseFloat((amount / term).toFixed(2));
    let repayments = [];

    // Calculate repayment dates starting from the selected start date
    for (let i = 0; i < term; i++) {
      const dueDate = new Date(startLoanDate);
      dueDate.setDate(dueDate.getDate() + 7 * i); // weekly intervals from start date
      repayments.push({
        dueDate,
        amount: i === term - 1 ? amount - repaymentAmount * (term - 1) : repaymentAmount,
      });
    }

    const loan = new Loan({
      user: userId,
      amount,
      term,
      repayments,
      createdAt: new Date(),
      status: 'PENDING'
    });

    await loan.save();
    res.status(200).json({ message: 'Loan created and repayments scheduled', loan });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin Approves Loan
const approveLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'APPROVED';
    await loan.save();

    res.status(200).json({ message: 'Loan approved', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Loans for the Logged-In User
const getUserLoans = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.find({ user: userId }).populate('repayments');

    res.status(200).json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Submit Repayment
const submitRepayment = async (req, res) => {
  const { loanId, repaymentId, amount } = req.body;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Find the repayment to update
    const repayment = loan.repayments.id(repaymentId);
    if (!repayment) return res.status(404).json({ message: 'Repayment not found' });

    // Update amountPaid and check if it's more than due amount
    const excessAmount = amount - repayment.amount;
    repayment.amountPaid = amount;
    repayment.status = 'PAID';

    if (excessAmount > 0) {
      // Distribute excessAmount across future repayments
      const remainingRepayments = loan.repayments.filter(r => r.status === 'PENDING');
      const sharePerRepayment = excessAmount / remainingRepayments.length;

      remainingRepayments.forEach(r => {
        r.amount = Math.max(0, r.amount - sharePerRepayment); // Update the remaining amount for each repayment
      });
    }

    // Check if this is the last installment
    const pendingRepayments = loan.repayments.filter(rep => rep.status === 'PENDING');

    // If there's only one pending repayment, it's the last installment
    const isLastInstallment = pendingRepayments.length === 1 && repayment.status === 'PENDING';

    // If it's the last installment, ensure the amount is exactly equal to the due amount
    if (isLastInstallment && amount !== repayment.amount) {
      return res.status(400).json({ message: 'You must pay exactly the due amount for the last installment.' });
    }
    
    // Check if all repayments are now paid, and mark the loan as PAID
    const allRepaymentsPaid = loan.repayments.every((rep) => rep.status === 'PAID');
    if (allRepaymentsPaid) {
      loan.status = 'PAID';
    }

    await loan.save();
    res.json({ message: 'Repayment successful', loan });
  } catch (error) {
    console.error('Error handling repayment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitRepayment,
  getUserLoans,
  approveLoan,
  createLoan
}