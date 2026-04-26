import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// GET /api/auth/me
export async function GET(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const user = await User.findById(authResult.user.id).select('+password');
        
        const userData = user ? user.toObject() : null;
        if (userData) {
            userData.hasPassword = !!userData.password;
            delete userData.password;
        }

        return successResponse({ data: userData });
    } catch (err) {
        return handleApiError(err);
    }
}
