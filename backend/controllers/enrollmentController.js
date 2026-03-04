const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Internship = require('../models/Internship');
const Certificate = require('../models/Certificate');

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
        email,
        agreedToRefundPolicy
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

    // Prepare Order ID and URLs
    const orderId = `ORDER_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Cashfree Production REQUIRES https even for localhost during testing
    let returnUrl = `${frontendUrl}/dashboard?order_id=${orderId}`;
    if (process.env.CASHFREE_ENV === 'production' && returnUrl.startsWith('http:')) {
        returnUrl = returnUrl.replace('http:', 'https:');
    }

    // 1. SAVE/UPDATE ENROLLMENT IN DB FIRST
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
        agreedToRefundPolicy,
        resume: resumePath || (enrollment ? enrollment.resume : undefined)
    };

    if (enrollment) {
        if (enrollment.paymentStatus !== 'paid') {
            Object.assign(enrollment, enrollmentData);
            await enrollment.save();
        }
    } else {
        enrollment = await Enrollment.create(enrollmentData);
    }

    // 2. NOW PREPARE CASHFREE ORDER
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
                return_url: returnUrl
            }
        })
    };

    console.log(`Creating Cashfree order for: ${orderId}, Return URL: ${returnUrl}`);

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

    console.log('✓ Cashfree Order Created:', {
        orderId,
        sessionId: cfData.payment_session_id,
        env: process.env.CASHFREE_ENV
    });

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

    // For each enrollment, check if certificate exists
    const updatedEnrollments = await Promise.all(enrollments.map(async (enrol) => {
        const enrolObj = enrol.toObject();
        if (enrolObj.status === 'completed') {
            const certExists = await Certificate.exists({ user: enrolObj.user, internship: enrolObj.internship._id });
            if (!certExists) enrolObj.status = 'enrolled';
        }
        return enrolObj;
    }));

    res.status(200).json({
        success: true,
        count: updatedEnrollments.length,
        data: updatedEnrollments
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
        const isAlreadyPaid = enrollment.paymentStatus === 'paid';

        enrollment.paymentStatus = 'paid';
        enrollment.status = 'enrolled';

        // Try to get payment ID from the first successful payment if available
        try {
            const paymentsUrl = process.env.CASHFREE_ENV === 'production'
                ? `https://api.cashfree.com/pg/orders/${orderId}/payments`
                : `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`;

            const paymentsResponse = await fetch(paymentsUrl, options);
            const paymentsData = await paymentsResponse.json();

            if (paymentsData && paymentsData.length > 0) {
                const successfulPayment = paymentsData.find(p => p.payment_status === 'SUCCESS');
                if (successfulPayment) {
                    enrollment.paymentId = successfulPayment.cf_payment_id;
                }
            }
        } catch (paymentErr) {
            console.error('Error fetching payment details:', paymentErr.message);
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: isAlreadyPaid ? 'Payment already verified' : 'Payment verified and enrollment activated',
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

// @desc    Cashfree Webhook for payment confirmation
// @route   POST /api/enrollments/webhook
// @access  Public
exports.cashfreeWebhook = asyncHandler(async (req, res, next) => {
    // In a real production app, you should verify the signature here
    // For now, we'll implement the logic to update based on the payload
    const { data } = req.body;

    if (!data || !data.order || !data.order.order_id) {
        return res.status(400).send('Invalid webhook payload');
    }

    const orderId = data.order.order_id;
    const paymentStatus = data.payment ? data.payment.payment_status : null;

    if (paymentStatus === 'SUCCESS') {
        const enrollment = await Enrollment.findOne({ cfOrderId: orderId });
        if (enrollment && enrollment.paymentStatus !== 'paid') {
            enrollment.paymentStatus = 'paid';
            enrollment.status = 'enrolled';
            enrollment.paymentId = data.payment.cf_payment_id;
            await enrollment.save();
            console.log(`Webhook: Order ${orderId} marked as PAID`);
        }
    }

    res.status(200).send('Webhook Received');
});

// @desc    Get all enrollments (Admin only)
// @route   GET /api/enrollments
// @access  Private/Admin
exports.getAllEnrollments = asyncHandler(async (req, res, next) => {
    const enrollments = await Enrollment.find().populate('user').populate('internship');

    // 1. Identify valid and orphaned enrollments
    const validEnrollments = [];
    const orphanedIds = [];

    for (const enrol of enrollments) {
        if (!enrol.user) {
            orphanedIds.push(enrol._id);
        } else {
            validEnrollments.push(enrol);
        }
    }

    // 2. Background cleanup: Delete enrollments and their certificates if user doesn't exist
    if (orphanedIds.length > 0) {
        console.log(`Cleaning up ${orphanedIds.length} orphaned enrollment records...`);
        // We don't await this to keep the response fast
        Enrollment.deleteMany({ _id: { $in: orphanedIds } }).catch(err => console.error('Auto-cleanup Enrollment error:', err));
        Certificate.deleteMany({ enrollment: { $in: orphanedIds } }).catch(err => console.error('Auto-cleanup Certificate error:', err));
    }

    // 3. Process valid ones for certificate status
    const updatedEnrollments = await Promise.all(validEnrollments.map(async (enrol) => {
        const enrolObj = enrol.toObject();
        if (enrolObj.status === 'completed') {
            const certExists = await Certificate.exists({
                user: enrolObj.user?._id,
                internship: enrolObj.internship?._id
            });
            if (!certExists) enrolObj.status = 'enrolled';
        }
        return enrolObj;
    }));

    res.status(200).json({
        success: true,
        count: updatedEnrollments.length,
        data: updatedEnrollments
    });
});

// @desc    Submit a review for an internship
// @route   POST /api/enrollments/:id/review
// @access  Private
exports.submitReview = asyncHandler(async (req, res, next) => {
    const { reviewText } = req.body;

    if (!reviewText) {
        return next(new ErrorResponse('Please provide review text', 400));
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        return next(new ErrorResponse(`No enrollment found with id ${req.params.id}`, 404));
    }

    // Check if user owns this enrollment
    if (enrollment.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to review this enrollment', 401));
    }

    // Check if completed - Allow review if certificate exists regardless of status string
    const certExists = await Certificate.exists({
        user: enrollment.user,
        internship: enrollment.internship
    });

    if (enrollment.status !== 'completed' && !certExists && req.user.role !== 'admin') {
        return next(new ErrorResponse('You can only review after completing the internship', 400));
    }

    enrollment.reviewText = reviewText;
    enrollment.reviewDate = Date.now();

    // Bypass validation for other fields during review update to avoid failures if some old data is inconsistent
    await Enrollment.findByIdAndUpdate(req.params.id, {
        reviewText,
        reviewDate: Date.now()
    });

    res.status(200).json({
        success: true,
        message: 'Review submitted successfully'
    });
});

// @desc    Get all reviews for an internship
// @route   GET /api/enrollments/reviews/:internshipId
// @access  Public
exports.getInternshipReviews = asyncHandler(async (req, res, next) => {
    const query = {
        reviewText: { $exists: true, $ne: '' }
    };

    if (req.params.internshipId && req.params.internshipId !== 'all') {
        query.internship = req.params.internshipId;
    }

    const reviews = await Enrollment.find(query)
        .select('reviewText reviewDate fullName user internship')
        .populate('internship', 'title')
        .sort('-reviewDate');

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});
