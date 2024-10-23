const express = require('express');
const { getAllLoans, approveLoan } = require('../controllers/admin');

const router = express.Router();

router.get('/loans', getAllLoans); // Get all loans
router.put('/loans/approve', approveLoan); // Get all loans

module.exports = router;
