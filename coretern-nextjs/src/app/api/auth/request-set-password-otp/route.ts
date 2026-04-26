import dbConnect from '@/lib/db';
import User from '@/models/User';
import sendEmail from '@/lib/email';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/request-set-password-otp
export async function POST(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();

        const user = await User.findById(authResult.user.id).select('+password');
        if (!user) return errorResponse('User not found', 404);

        if (user.password) {
            return errorResponse('User already has a password set. Use the change password flow instead.', 400);
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        // Fire and forget email to prevent hanging
        sendEmail({
            email: user.email,
            subject: 'Set Password OTP',
            message: `Your OTP to set a new password is: ${otp}. It will expire in 10 minutes.`,
            html: `<h3>Set Password</h3><p>Your OTP to set a new password is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
        }).catch(err => console.error('Email send error:', err));

        return successResponse({ message: 'OTP sent to your email.' });
    } catch (err) {
        return handleApiError(err);
    }
}
