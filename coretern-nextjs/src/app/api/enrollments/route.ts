import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Internship from '@/models/Internship';
import Certificate from '@/models/Certificate';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

// GET /api/enrollments - Get all enrollments (Admin)
export async function GET(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const enrollments = await Enrollment.find().populate('user').populate('internship');

        const validEnrollments = [];
        const orphanedIds = [];

        for (const enrol of enrollments) {
            if (!enrol.user) {
                orphanedIds.push(enrol._id);
            } else {
                validEnrollments.push(enrol);
            }
        }

        if (orphanedIds.length > 0) {
            Enrollment.deleteMany({ _id: { $in: orphanedIds } }).catch(err => console.error('Auto-cleanup error:', err));
            Certificate.deleteMany({ enrollment: { $in: orphanedIds } }).catch(err => console.error('Auto-cleanup error:', err));
        }

        const updatedEnrollments = await Promise.all(validEnrollments.map(async (enrol) => {
            const enrolObj = enrol.toObject();
            if (enrolObj.status === 'completed') {
                const certExists = await Certificate.exists({ user: enrolObj.user?._id, internship: enrolObj.internship?._id });
                if (!certExists) enrolObj.status = 'enrolled';
            }
            return enrolObj;
        }));

        return successResponse({ count: updatedEnrollments.length, data: updatedEnrollments });
    } catch (err) {
        return handleApiError(err);
    }
}

// POST /api/enrollments - Enroll in an internship
export async function POST(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();

        const formData = await request.formData();
        const body = {};
        let resumePath = '';

        for (const [key, value] of formData.entries()) {
            if (key === 'resume' && value instanceof File && value.size > 0) {
                if (isCloudinaryConfigured) {
                    const buffer = Buffer.from(await value.arrayBuffer());
                    const result = await uploadToCloudinary(buffer);
                    resumePath = result.secure_url;
                }
            } else {
                body[key] = value;
            }
        }

        const { internshipId, fullName, gender, collegeRegNumber, collegeName, course, startDate, endDate, whatsappNumber, email, branch, agreedToRefundPolicy } = body;

        const internship = await Internship.findById(internshipId);
        if (!internship) return errorResponse(`No internship with id ${internshipId}`, 404);

        const existingEnrollment = await Enrollment.findOne({ user: authResult.user.id, internship: internshipId, paymentStatus: 'paid' });
        if (existingEnrollment) return errorResponse('You are already enrolled in this internship', 400);

        const orderId = `ORDER_${Date.now()}`;
        const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        let returnUrl = `${frontendUrl}/dashboard?order_id=${orderId}`;
        if (process.env.CASHFREE_ENV === 'production' && returnUrl.startsWith('http:')) {
            returnUrl = returnUrl.replace('http:', 'https:');
        }

        let enrollment = await Enrollment.findOne({ user: authResult.user.id, internship: internshipId });

        const enrollmentData = {
            user: authResult.user.id, internship: internshipId, status: 'pending', paymentStatus: 'unpaid', cfOrderId: orderId,
            fullName, gender, collegeRegNumber, collegeName, course, startDate, endDate, whatsappNumber, email, branch,
            agreedToRefundPolicy, resume: resumePath || (enrollment ? enrollment.resume : undefined)
        };

        if (enrollment) {
            if (enrollment.paymentStatus !== 'paid') {
                Object.assign(enrollment, enrollmentData);
                await enrollment.save();
            }
        } else {
            enrollment = await Enrollment.create(enrollmentData);
        }

        // Cashfree order creation
        const cfUrl = process.env.CASHFREE_ENV === 'production'
            ? 'https://api.cashfree.com/pg/orders'
            : 'https://sandbox.cashfree.com/pg/orders';

        const cfOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json', 'content-type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY
            },
            body: JSON.stringify({
                order_amount: internship.fee, order_currency: 'INR', order_id: orderId,
                customer_details: {
                    customer_id: authResult.user.id.toString(),
                    customer_name: fullName || authResult.user.name,
                    customer_email: email || authResult.user.email,
                    customer_phone: whatsappNumber ? whatsappNumber.replace(/\D/g, '').slice(-10) : '9999999999'
                },
                order_meta: { return_url: returnUrl }
            })
        };

        let cfResponse, cfData;
        try {
            cfResponse = await fetch(cfUrl, cfOptions);
            cfData = await cfResponse.json();
        } catch (error) {
            return errorResponse('Could not connect to payment gateway', 500);
        }

        if (!cfResponse.ok) {
            return errorResponse(cfData.message || 'Failed to create payment order', 500);
        }

        return successResponse({ data: enrollment, payment_session_id: cfData.payment_session_id }, 201);
    } catch (err) {
        return handleApiError(err);
    }
}
