import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Certificate from '@/models/Certificate';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// POST /api/enrollments/[id]/review - Submit review
export async function POST(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const { reviewText } = await request.json();

        if (!reviewText) return errorResponse('Please provide review text', 400);

        const enrollment = await Enrollment.findById(id);
        if (!enrollment) return errorResponse(`No enrollment found with id ${id}`, 404);

        if (enrollment.user.toString() !== authResult.user.id.toString() && authResult.user.role !== 'admin') {
            return errorResponse('Not authorized to review this enrollment', 401);
        }

        const certExists = await Certificate.exists({ user: enrollment.user, internship: enrollment.internship });
        if (enrollment.status !== 'completed' && !certExists && authResult.user.role !== 'admin') {
            return errorResponse('You can only review after completing the internship', 400);
        }

        await Enrollment.findByIdAndUpdate(id, { reviewText, reviewDate: Date.now() });

        return successResponse({ message: 'Review submitted successfully' });
    } catch (err) {
        return handleApiError(err);
    }
}
