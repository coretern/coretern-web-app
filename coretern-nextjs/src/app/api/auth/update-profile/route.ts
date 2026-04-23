import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// PUT /api/auth/update-profile
export async function PUT(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { name, gender, phone } = await request.json();

        const user = await User.findById(authResult.user.id);
        if (!user) return errorResponse('User not found', 404);

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (phone) user.phone = phone;

        await user.save();

        return successResponse({ data: user, message: 'Profile updated successfully' });
    } catch (err) {
        return handleApiError(err);
    }
}
