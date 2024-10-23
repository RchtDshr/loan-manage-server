const express = require('express');
const { getAllLoans } = require('../controllers/admin');

const router = express.Router();

router.get('/loans', getAllLoans); // Get all loans

module.exports = router;
