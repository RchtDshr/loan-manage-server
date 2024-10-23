const express = require('express');
const { getAllLoans, approveLoan } = require('../controllers/admin');

const router = express.Router();

router.get('/loans', getAllLoans); 
router.put('/loans/approve', approveLoan); 

module.exports = router;
