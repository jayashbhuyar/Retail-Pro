const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const { passchangesendOtp, passchangeverifyOtp } = require('../controllers/otppassChange');


// Route to send OTP
router.post('/send-otp', sendOtp);

router.post('/send-otp-1', passchangesendOtp);

// Route to verify OTP
router.post('/verify-otp', verifyOtp);

router.post('/verify-otp-1', passchangeverifyOtp);

module.exports = router;
