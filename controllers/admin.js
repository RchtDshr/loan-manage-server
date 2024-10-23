const Loan = require('../models/loan');

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ status: { $in: ["APPROVED", "PENDING"] }}).populate('user'); // Adjust based on your Loan model
        
        res.json(loans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Admin Approves Loan
const approveLoan = async (req, res) => {
    const { loanId } = req.body; // Extract loanId from request body

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status !== 'PENDING') {
      return res.status(400).json({ message: 'Loan is already approved or paid' });
    }

    loan.status = 'APPROVED'; // Change status to approved
    await loan.save();

    res.json({ message: 'Loan approved successfully', loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    getAllLoans,
    approveLoan
}