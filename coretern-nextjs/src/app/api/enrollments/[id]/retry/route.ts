import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Internship from '@/models/Internship';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

export async function POST(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        
        const { id } = await params;
        const enrollment = await Enrollment.findById(id).populate('internship');
        if (!enrollment) return errorResponse('Enrollment not found', 404);

        if (enrollment.user.toString() !== authResult.user.id.toString()) {
            return errorResponse('Unauthorized', 403);
        }

        if (enrollment.paymentStatus === 'paid') {
            return errorResponse('This enrollment is already paid', 400);
        }

        const internship = enrollment.internship;
        if (!internship) return errorResponse('Internship not found', 404);

        const orderId = `ORDER_${Date.now()}`;
        
        const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        let returnUrl = `${frontendUrl}/dashboard?order_id=${orderId}`;
        if (process.env.CASHFREE_ENV === 'production' && returnUrl.startsWith('http:')) {
            returnUrl = returnUrl.replace('http:', 'https:');
        }

        enrollment.cfOrderId = orderId;
        await enrollment.save();

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
                    customer_name: enrollment.fullName || authResult.user.name,
                    customer_email: enrollment.email || authResult.user.email,
                    customer_phone: enrollment.whatsappNumber || '9999999999'
                },
                order_meta: { return_url: returnUrl }
            })
        };

        const cfResponse = await fetch(cfUrl, cfOptions);
        const cfData = await cfResponse.json();

        if (!cfResponse.ok) {
            return errorResponse(cfData.message || 'Failed to create payment order', 500);
        }

        return successResponse({ payment_session_id: cfData.payment_session_id }, 200);
    } catch (err) {
        return handleApiError(err);
    }
}
