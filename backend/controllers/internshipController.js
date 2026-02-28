const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Internship = require('../models/Internship');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
exports.getInternships = asyncHandler(async (req, res, next) => {
    // Show active=true OR those without active field (which default to true in schema)
    const internships = await Internship.find({ active: { $ne: false } });
    res.status(200).json({
        success: true,
        count: internships.length,
        data: internships
    });
});

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
exports.getInternship = asyncHandler(async (req, res, next) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return next(new ErrorResponse(`Internship not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: internship
    });
});

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private/Admin
exports.createInternship = asyncHandler(async (req, res, next) => {
    // Handle curriculum normalization for both JSON (array) and FormData (curriculum[] string/array)
    if (req.body['curriculum[]']) {
        req.body.curriculum = Array.isArray(req.body['curriculum[]'])
            ? req.body['curriculum[]']
            : [req.body['curriculum[]']];
        delete req.body['curriculum[]'];
    } else if (req.body.curriculum && typeof req.body.curriculum === 'string') {
        req.body.curriculum = req.body.curriculum.split(',').map(i => i.trim()).filter(i => i !== '');
    }

    // Robust parsing for videos (handles JSON array or FormData JSON string)
    if (req.body.videos) {
        if (typeof req.body.videos === 'string') {
            try {
                req.body.videos = JSON.parse(req.body.videos);
            } catch (e) {
                // If parsing fails, maybe it's not JSON? Fallback logic if needed
                console.error('Failed to parse videos:', e.message);
            }
        }
    } else {
        req.body.videos = [];
    }

    console.log('--- CREATE INTERNSHIP ---');
    console.log('Body after parsing:', req.body);

    // Add image URL if file uploaded
    if (req.file) {
        const isCloudinary = req.file.path.startsWith('http');
        if (isCloudinary) {
            req.body.image = req.file.path;
        } else {
            // Local storage fallback normalization
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            req.body.image = `http://localhost:5000/${normalizedPath}`;
        }
    }

    const internship = await Internship.create(req.body);

    res.status(201).json({
        success: true,
        data: internship
    });
});

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
exports.updateInternship = asyncHandler(async (req, res, next) => {
    console.log('--- UPDATE INTERNSHIP ---');
    console.log(`ID: ${req.params.id}`);
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    let internship = await Internship.findById(req.params.id);

    if (!internship) {
        return next(new ErrorResponse(`Internship not found with id of ${req.params.id}`, 404));
    }

    // Handle curriculum normalization for both JSON (array) and FormData (curriculum[] string/array)
    if (req.body['curriculum[]']) {
        req.body.curriculum = Array.isArray(req.body['curriculum[]'])
            ? req.body['curriculum[]']
            : [req.body['curriculum[]']];
        delete req.body['curriculum[]'];
    } else if (req.body.curriculum && typeof req.body.curriculum === 'string') {
        // Fallback for strings sent via JSON (though frontend should send array)
        req.body.curriculum = req.body.curriculum.split(',').map(i => i.trim()).filter(i => i !== '');
    }

    // Robust parsing for videos (handles JSON array or FormData JSON string)
    if (req.body.videos) {
        if (typeof req.body.videos === 'string') {
            try {
                req.body.videos = JSON.parse(req.body.videos);
            } catch (e) {
                console.error('Failed to parse videos:', e.message);
            }
        }
    }

    console.log('Body after parsing:', req.body);

    if (req.file) {
        const isCloudinary = req.file.path.startsWith('http');
        if (isCloudinary) {
            req.body.image = req.file.path;
        } else {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            req.body.image = `http://localhost:5000/${normalizedPath}`;
        }
    }

    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: internship
    });
});

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
exports.deleteInternship = asyncHandler(async (req, res, next) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return next(new ErrorResponse(`Internship not found with id of ${req.params.id}`, 404));
    }

    await internship.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
