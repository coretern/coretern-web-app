import dbConnect from '@/lib/db';
import User from '@/models/User';
import sendEmail from '@/lib/email';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// POST /api/auth/resend-otp
export async function POST(request) {
    try {
        await dbConnect();
        const { email } = await request.json();
        const user = await User.findOne({ email });

        if (!user) return errorResponse('User not found', 404);
        if (user.isVerified) return errorResponse('User is already verified', 400);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'New Email Verification OTP',
                message: `Your new verification OTP is: ${otp}. It will expire in 10 minutes.`,
                html: `<h3>Email Verification</h3><p>Your new verification OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
            });
            return successResponse({ message: 'New OTP sent to email.' });
        } catch (err) {
            return errorResponse('Email could not be sent', 500);
        }
    } catch (err) {
        return handleApiError(err);
    }
}
