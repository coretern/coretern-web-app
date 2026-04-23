import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { NextResponse } from 'next/server';

// POST /api/enrollments/webhook - Cashfree Webhook (Public)
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { data } = body;

        if (!data || !data.order || !data.order.order_id) {
            return NextResponse.json('Invalid webhook payload', { status: 400 });
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

        return NextResponse.json('Webhook Received', { status: 200 });
    } catch (err) {
        return handleApiError(err);
    }
}
