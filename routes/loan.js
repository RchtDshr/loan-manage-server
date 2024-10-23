const express = require('express');
const { createLoan,getApprovedLoan, getUserLoans, submitRepayment } = require('../controllers/loan');

const router = express.Router();

router.post('/', createLoan); // Create loan
router.get('/', getUserLoans); // Get all loans for the logged-in user
router.post('/repayment', submitRepayment); // Submit repayment
router.get('/approved', getApprovedLoan)
module.exports = router;
