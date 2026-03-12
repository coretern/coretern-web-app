const Config = require('../models/Config');
const asyncHandler = require('express-async-handler');

// @desc    Get system configuration
// @route   GET /api/config
// @access  Public
exports.getConfig = asyncHandler(async (req, res) => {
    let config = await Config.findOne();

    // Create default config if not exists
    if (!config) {
        config = await Config.create({ allowEmailAuth: true });
    }

    res.status(200).json({
        success: true,
        data: config
    });
});

// @desc    Update system configuration
// @route   PUT /api/config
// @access  Private/Admin
exports.updateConfig = asyncHandler(async (req, res) => {
    let config = await Config.findOne();

    if (!config) {
        config = await Config.create(req.body);
    } else {
        config = await Config.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true
        });
    }

    res.status(200).json({
        success: true,
        data: config
    });
});
