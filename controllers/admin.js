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

module.exports = {
    getAllLoans,
    approveLoan
}