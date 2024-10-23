const express = require('express');
const { createLoan,getApprovedLoan, getUserLoans, submitRepayment } = require('../controllers/loan');

const router = express.Router();

router.post('/', createLoan); 
router.get('/', getUserLoans); 
router.post('/repayment', submitRepayment); 
router.get('/approved', getApprovedLoan)
module.exports = router;
