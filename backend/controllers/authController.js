const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, phone } = req.body;
    console.log(`Registration attempt for: ${email}`);

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
        phone
    });

    console.log(`User created successfully: ${email}`);
    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        console.log(`Login failed: User not found (${email})`);
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        console.log(`Login failed: Incorrect password (${email})`);
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
        return next(new ErrorResponse('Your account is suspended. Please contact us to resolve this issue.', 403));
    }

    console.log(`Login successful: ${email}`);
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

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(statusCode).json({
        success: true,
        token
    });
};
