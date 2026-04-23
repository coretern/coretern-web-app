import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// GET /api/certificates/my - Get user's certificates
export async function GET(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const certificates = await Certificate.find({ user: authResult.user.id })
            .populate('internship')
            .populate('enrollment');

        return successResponse({ count: certificates.length, data: certificates });
    } catch (err) {
        return handleApiError(err);
    }
}
