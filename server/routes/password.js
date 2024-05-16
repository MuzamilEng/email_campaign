const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// Route for requesting a password reset
router.post('/forgot-password', forgotPassword);

// Route for resetting the password using OTP
router.post('/reset-password', resetPassword);

module.exports = router;
