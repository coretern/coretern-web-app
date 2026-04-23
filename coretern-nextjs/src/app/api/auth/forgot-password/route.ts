import dbConnect from '@/lib/db';
import User from '@/models/User';
import sendEmail from '@/lib/email';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/forgot-password
export async function POST(request) {
    try {
        await dbConnect();
        const { email, adminOnly } = await request.json();

        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse('There is no user with that email', 404);
        }

        if (adminOnly && user.role !== 'admin') {
            return errorResponse('This recovery portal is for administrators only', 403);
        }

        const resetOtp = generateOTP();
        user.resetPasswordToken = resetOtp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message: `Your password reset OTP is: ${resetOtp}. It will expire in 10 minutes.`,
                html: `<h3>Password Reset</h3><p>Your password reset OTP is: <strong>${resetOtp}</strong></p><p>It will expire in 10 minutes.</p>`
            });

            return successResponse({ data: 'Password reset OTP sent to email' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return errorResponse('Email could not be sent', 500);
        }
    } catch (err) {
        return handleApiError(err);
    }
}
