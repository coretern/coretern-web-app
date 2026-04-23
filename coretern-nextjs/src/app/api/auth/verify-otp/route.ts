import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// POST /api/auth/verify-otp
export async function POST(request) {
    try {
        await dbConnect();
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return errorResponse('Please provide email and OTP', 400);
        }

        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse('User not found', 404);
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return errorResponse('Invalid or expired OTP', 400);
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user);
        return successResponse({ token });
    } catch (err) {
        return handleApiError(err);
    }
}
