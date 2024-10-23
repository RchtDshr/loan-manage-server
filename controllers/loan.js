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
  try {
    const { loanId, repaymentId } = req.params;
    const { amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const repayment = loan.repayments.id(repaymentId);
    if (!repayment) return res.status(404).json({ message: 'Repayment not found' });

    if (repayment.status === 'PAID') return res.status(400).json({ message: 'Repayment already made' });

    if (amount < repayment.amount) return res.status(400).json({ message: 'Amount should be greater than or equal to the scheduled repayment' });

    repayment.status = 'PAID';

    // Check if all repayments are PAID to mark loan as PAID
    const allPaid = loan.repayments.every(r => r.status === 'PAID');
    if (allPaid) {
      loan.status = 'PAID';
    }

    await loan.save();
    res.status(200).json({ message: 'Repayment submitted', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
    submitRepayment,
    getUserLoans,
    approveLoan,
    createLoan
}