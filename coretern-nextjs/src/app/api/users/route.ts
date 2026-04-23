import dbConnect from '@/lib/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Certificate from '@/models/Certificate';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';

// GET /api/users - Get all users (Admin)
export async function GET(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const users = await User.find().select('-password');
        return successResponse({ count: users.length, data: users });
    } catch (err) {
        return handleApiError(err);
    }
}
