const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, phone, gender, agreedToTerms, agreedToPrivacy } = req.body;
    console.log(`Registration attempt for: ${email}`);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
        return next(new ErrorResponse('User already exists and is verified', 400));
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (user && !user.isVerified) {
        // Update existing unverified user
        user.name = name || user.name;
        user.password = password || user.password;
        user.phone = phone || user.phone;
        user.gender = gender || user.gender;
        user.role = role || user.role;
        user.agreedToTerms = agreedToTerms || user.agreedToTerms;
        user.agreedToPrivacy = agreedToPrivacy || user.agreedToPrivacy;
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
    } else {
        // Create new unverified user
        user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            gender,
            agreedToTerms,
            agreedToPrivacy,
            otp,
            otpExpires,
            isVerified: false
        });
    }

    // Send OTP via email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification OTP',
            message: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
            html: `<h3>Email Verification</h3><p>Your verification OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to email. Please verify to complete registration.'
        });
    } catch (err) {
        console.error('Email send error:', err);
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorResponse('Please provide email and OTP', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.isVerified) {
        return next(new ErrorResponse('User is already verified', 400));
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: 'New Email Verification OTP',
            message: `Your new verification OTP is: ${otp}. It will expire in 10 minutes.`,
            html: `<h3>Email Verification</h3><p>Your new verification OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
        });

        res.status(200).json({
            success: true,
            message: 'New OTP sent to email.'
        });
    } catch (err) {
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('User not registered', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Incorrect password', 401));
    }

    if (!user.isVerified) {
        return next(new ErrorResponse('Please verify your email first', 401));
    }

    if (user.status === 'suspended') {
        return next(new ErrorResponse('Your account is suspended.', 403));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
        // If user exists, update googleId if not present
        if (!user.googleId) {
            user.googleId = googleId;
            user.isVerified = true; // Google users are implicitly verified
            await user.save();
        }
    } else {
        // Create new user
        user = await User.create({
            name,
            email,
            googleId,
            isVerified: true,
            status: 'active',
            gender: 'Other', // Default for Google users
            agreedToTerms: true,
            agreedToPrivacy: true
        });
    }

    if (user.status === 'suspended') {
        return next(new ErrorResponse('Your account is suspended.', 403));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Restriction for Admin Panel: Only allow admins to reset if adminOnly flag is sent
    if (req.body.adminOnly && user.role !== 'admin') {
        return next(new ErrorResponse('This recovery portal is for administrators only', 403));
    }

    // Generate OTP
    const resetOtp = generateOTP();

    // Set to model
    user.resetPasswordToken = resetOtp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    // Send email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message: `Your password reset OTP is: ${resetOtp}. It will expire in 10 minutes.`,
            html: `<h3>Password Reset</h3><p>Your password reset OTP is: <strong>${resetOtp}</strong></p><p>It will expire in 10 minutes.</p>`
        });

        res.status(200).json({
            success: true,
            data: 'Password reset OTP sent to email'
        });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Set new password
    user.password = password;
    user.isVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all previous sessions

    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const { name, gender, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Update fields
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
    });
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, version: user.tokenVersion || 0 }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(statusCode).json({
        success: true,
        token
    });
};
