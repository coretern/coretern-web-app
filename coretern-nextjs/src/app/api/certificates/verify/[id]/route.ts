import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// GET /api/certificates/verify/[id] - Verify certificate (Public)
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const certificate = await Certificate.findOne({ certificateId: id })
            .populate('user', 'name')
            .populate('internship', 'title domain duration')
            .populate('enrollment');

        if (!certificate) return errorResponse('Certificate not found or invalid', 404);

        return successResponse({ data: certificate });
    } catch (err) {
        return handleApiError(err);
    }
}
