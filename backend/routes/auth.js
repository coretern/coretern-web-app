const express = require('express');
const { register, login, getMe, verifyOTP, resendOTP, googleLogin, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
