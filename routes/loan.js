const express = require('express');
const { createLoan, approveLoan, getUserLoans, submitRepayment } = require('../controllers/loan');
const {adminMiddleware} = require('../middleware/auth'); // middleware to check admin privileges

const router = express.Router();

router.post('/', createLoan); // Create loan
router.put('/:loanId/approve', adminMiddleware, approveLoan); // Admin approves loan
router.get('/', getUserLoans); // Get all loans for the logged-in user
router.post('/repayment', submitRepayment); // Submit repayment

module.exports = router;
