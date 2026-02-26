const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Internship = require('../models/Internship');

// @desc    Enroll in an internship
// @route   POST /api/enrollments
// @access  Private
exports.enroll = asyncHandler(async (req, res, next) => {
    const {
        internshipId,
        fullName,
        gender,
        collegeRegNumber,
        collegeName,
        course,
        startDate,
        endDate,
        whatsappNumber,
        email
    } = req.body;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
        return next(new ErrorResponse(`No internship with id ${internshipId}`, 404));
    }

    // Check if user already enrolled and PAID
    const existingEnrollment = await Enrollment.findOne({
        user: req.user.id,
        internship: internshipId,
        paymentStatus: 'paid'
    });

    if (existingEnrollment) {
        return next(new ErrorResponse('You are already enrolled in this internship', 400));
    }

    // Handle resume file
    let resumePath = '';
    if (req.file) {
        const isCloudinary = req.file.path.startsWith('http');
        if (isCloudinary) {
            resumePath = req.file.path;
        } else {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            resumePath = `http://localhost:5000/${normalizedPath}`;
        }
    }

    // Prepare Cashfree Order
    const orderId = `ORDER_${Date.now()}`;
    const url = process.env.CASHFREE_ENV === 'production'
        ? 'https://api.cashfree.com/pg/orders'
        : 'https://sandbox.cashfree.com/pg/orders';

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-version': '2023-08-01',
            'x-client-id': process.env.CASHFREE_APP_ID,
            'x-client-secret': process.env.CASHFREE_SECRET_KEY
        },
        body: JSON.stringify({
            order_amount: internship.fee,
            order_currency: 'INR',
            order_id: orderId,
            customer_details: {
                customer_id: req.user.id.toString(),
                customer_name: fullName || req.user.name,
                customer_email: email || req.user.email,
                customer_phone: whatsappNumber ? whatsappNumber.replace(/\D/g, '').slice(-10) : (req.user.phone ? req.user.phone.replace(/\D/g, '').slice(-10) : '9999999999')
            },
            order_meta: {
                return_url: `http://localhost:5173/dashboard?order_id=${orderId}`
            }
        })
    };

    console.log(`Creating order for internship: ${internship.title}, user: ${req.user.email}`);

    let cfResponse;
    let cfData;
    try {
        cfResponse = await fetch(url, options);
        cfData = await cfResponse.json();
    } catch (error) {
        console.error('Cashfree Network Error:', error.message);
        return next(new ErrorResponse('Could not connect to payment gateway', 500));
    }

    if (!cfResponse.ok) {
        console.error('Cashfree API Error:', {
            status: cfResponse.status,
            data: cfData,
            orderId
        });
        return next(new ErrorResponse(cfData.message || 'Failed to create payment order', 500));
    }

    console.log('Cashfree order created successfully:', cfData.payment_session_id);

    // Create or update enrollment
    let enrollment = await Enrollment.findOne({ user: req.user.id, internship: internshipId });

    const enrollmentData = {
        user: req.user.id,
        internship: internshipId,
        status: 'pending',
        paymentStatus: 'unpaid',
        cfOrderId: orderId,
        fullName,
        gender,
        collegeRegNumber,
        collegeName,
        course,
        startDate,
        endDate,
        whatsappNumber,
        email,
        resume: resumePath || (enrollment ? enrollment.resume : undefined)
    };

    if (enrollment) {
        Object.assign(enrollment, enrollmentData);
        await enrollment.save();
    } else {
        enrollment = await Enrollment.create(enrollmentData);
    }

    res.status(201).json({
        success: true,
        data: enrollment,
        payment_session_id: cfData.payment_session_id
    });
});

// @desc    Get user's enrollments
// @route   GET /api/enrollments/my
// @access  Private
exports.getMyEnrollments = asyncHandler(async (req, res, next) => {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate('internship');

    res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
    });
});

// @desc    Update enrollment to paid (Admin or Payment Webhook)
// @route   PUT /api/enrollments/:id/pay
// @access  Private
exports.updateToPaid = asyncHandler(async (req, res, next) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        return next(new ErrorResponse(`No enrollment with id ${req.params.id}`, 404));
    }

    enrollment.paymentStatus = 'paid';
    enrollment.status = 'enrolled';
    enrollment.paymentId = req.body.paymentId; // from payment gateway

    await enrollment.save();

    res.status(200).json({
        success: true,
        data: enrollment
    });
});

// @desc    Verify Cashfree Payment
// @route   GET /api/enrollments/verify/:orderId
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;

    const enrollment = await Enrollment.findOne({ cfOrderId: orderId });
    if (!enrollment) {
        return next(new ErrorResponse(`No enrollment found for order ${orderId}`, 404));
    }

    // Call Cashfree to check order status
    const url = process.env.CASHFREE_ENV === 'production'
        ? `https://api.cashfree.com/pg/orders/${orderId}`
        : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'x-client-id': process.env.CASHFREE_APP_ID,
            'x-client-secret': process.env.CASHFREE_SECRET_KEY
        }
    };

    let cfResponse;
    let cfData;
    try {
        cfResponse = await fetch(url, options);
        cfData = await cfResponse.json();
    } catch (error) {
        console.error('Cashfree Verification Error:', error.message);
        return next(new ErrorResponse('Payment verification failed', 500));
    }

    if (cfData.order_status === 'PAID') {
        enrollment.paymentStatus = 'paid';
        enrollment.status = 'enrolled';
        // We can also store the payment ID if needed from cfData.payments[0].cf_payment_id
        await enrollment.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified and enrollment activated',
            data: enrollment
        });
    } else {
        res.status(400).json({
            success: false,
            message: `Payment status: ${cfData.order_status}`,
            status: cfData.order_status
        });
    }
});

// @desc    Get all enrollments (Admin only)
// @route   GET /api/enrollments
// @access  Private/Admin
exports.getAllEnrollments = asyncHandler(async (req, res, next) => {
    const enrollments = await Enrollment.find().populate('user').populate('internship');

    res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
    });
});
