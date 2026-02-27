const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const { generateQRCode } = require('../utils/qrGenerator');

// @desc    Issue certificate (Admin only)
// @route   POST /api/certificates
// @access  Private/Admin
exports.issueCertificate = asyncHandler(async (req, res, next) => {
    const { enrollmentId } = req.body;

    // Get enrollment details
    const enrollment = await Enrollment.findById(enrollmentId).populate('user internship');
    if (!enrollment) {
        return next(new ErrorResponse(`No enrollment with id ${enrollmentId}`, 404));
    }

    if (enrollment.status !== 'enrolled' && enrollment.paymentStatus !== 'paid') {
        return next(new ErrorResponse('Certificate cannot be issued for unpaid or pending enrollment', 400));
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({
        user: enrollment.user._id,
        internship: enrollment.internship._id
    });

    if (certificate) {
        return res.status(200).json({
            success: true,
            data: certificate
        });
    }

    // Create certificate
    certificate = new Certificate({
        user: enrollment.user._id,
        internship: enrollment.internship._id,
        enrollment: enrollment._id
    });

    // Generate Verification URL (Frontend Page)
    // Assuming the frontend verification page is at /verify/:id
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const verificationUrl = `${frontendUrl}/verify/${certificate.certificateId}`;

    // Generate QR Code
    const qrCodeData = await generateQRCode(verificationUrl);

    certificate.verificationUrl = verificationUrl;
    certificate.qrCode = qrCodeData;

    await certificate.save();

    // Mark enrollment as completed
    enrollment.status = 'completed';
    await enrollment.save();

    res.status(201).json({
        success: true,
        data: certificate
    });
});

// @desc    Get certificate by ID (Verification)
// @route   GET /api/certificates/verify/:id
// @access  Public
exports.verifyCertificate = asyncHandler(async (req, res, next) => {
    const certificate = await Certificate.findOne({ certificateId: req.params.id })
        .populate('user', 'name')
        .populate('internship', 'title domain duration')
        .populate('enrollment');

    if (!certificate) {
        return next(new ErrorResponse('Certificate not found or invalid', 404));
    }

    res.status(200).json({
        success: true,
        data: certificate
    });
});

// @desc    Get user certificates
// @route   GET /api/certificates/my
// @access  Private
exports.getMyCertificates = asyncHandler(async (req, res, next) => {
    const certificates = await Certificate.find({ user: req.user.id })
        .populate('internship')
        .populate('enrollment');

    res.status(200).json({
        success: true,
        count: certificates.length,
        data: certificates
    });
});
