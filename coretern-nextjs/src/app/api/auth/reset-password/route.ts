import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// PUT /api/auth/reset-password
export async function PUT(request) {
    try {
        await dbConnect();
        const { email, otp, password } = await request.json();

        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return errorResponse('Invalid or expired OTP', 400);
        }

        user.password = password;
        user.isVerified = true;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        const token = generateToken(user);
        return successResponse({ token });
    } catch (err) {
        return handleApiError(err);
    }
}
