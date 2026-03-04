const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Impersonate user (Admin only)
// @route   POST /api/users/:id/impersonate
// @access  Private/Admin
exports.impersonateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));
    }

    // Generate token for the target user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, version: user.tokenVersion || 0 }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
        success: true,
        token
    });
});

// @desc    Toggle user status (active/suspended)
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await User.findByIdAndUpdate(req.params.id, { status: user.status });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));
    }

    // Explicitly delete associated data (Good practice even with background cleanup)
    const Enrollment = require('../models/Enrollment');
    const Certificate = require('../models/Certificate');

    await Enrollment.deleteMany({ user: user._id });
    await Certificate.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
