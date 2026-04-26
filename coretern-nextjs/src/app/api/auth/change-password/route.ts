import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth, generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import bcrypt from 'bcryptjs';

// PUT /api/auth/change-password
export async function PUT(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { currentPassword, newPassword, otp } = await request.json();

        const user = await User.findById(authResult.user.id).select('+password');
        if (!user) return errorResponse('User not found', 404);

        if (user.password) {
            if (!currentPassword) return errorResponse('Current password is required to change password', 400);
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return errorResponse('Incorrect current password', 400);
        } else {
            if (!otp) return errorResponse('OTP is required to set a new password', 400);
            if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
                return errorResponse('Invalid or expired OTP', 400);
            }
            // Clear OTP
            user.otp = undefined;
            user.otpExpires = undefined;
        }

        user.password = newPassword;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        // Optional: you can choose not to send a token if you want the frontend to forcefully logout, 
        // but since we want to give frontend the choice, we return it.
        const token = generateToken(user);

        return successResponse({ message: 'Password changed successfully', token });
    } catch (err) {
        return handleApiError(err);
    }
}
