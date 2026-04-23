import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// GET /api/enrollments/verify/[orderId] - Verify Cashfree payment
export async function GET(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { orderId } = await params;

        const enrollment = await Enrollment.findOne({ cfOrderId: orderId });
        if (!enrollment) return errorResponse(`No enrollment found for order ${orderId}`, 404);

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

        let cfResponse, cfData;
        try {
            cfResponse = await fetch(url, options);
            cfData = await cfResponse.json();
        } catch (error) {
            return errorResponse('Payment verification failed', 500);
        }

        if (cfData.order_status === 'PAID') {
            const isAlreadyPaid = enrollment.paymentStatus === 'paid';
            enrollment.paymentStatus = 'paid';
            enrollment.status = 'enrolled';

            try {
                const paymentsUrl = process.env.CASHFREE_ENV === 'production'
                    ? `https://api.cashfree.com/pg/orders/${orderId}/payments`
                    : `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`;

                const paymentsResponse = await fetch(paymentsUrl, options);
                const paymentsData = await paymentsResponse.json();

                if (paymentsData && paymentsData.length > 0) {
                    const successfulPayment = paymentsData.find(p => p.payment_status === 'SUCCESS');
                    if (successfulPayment) enrollment.paymentId = successfulPayment.cf_payment_id;
                }
            } catch (paymentErr) {
                console.error('Error fetching payment details:', paymentErr.message);
            }

            await enrollment.save();

            return successResponse({
                message: isAlreadyPaid ? 'Payment already verified' : 'Payment verified and enrollment activated',
                data: enrollment
            });
        } else {
            return errorResponse(`Payment status: ${cfData.order_status}`, 400);
        }
    } catch (err) {
        return handleApiError(err);
    }
}
