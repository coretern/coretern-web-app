import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';

// PUT /api/enrollments/[id]/pay - Update enrollment to paid (Admin)
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const enrollment = await Enrollment.findById(id);

        if (!enrollment) return errorResponse(`No enrollment with id ${id}`, 404);

        const { paymentId } = await request.json();
        enrollment.paymentStatus = 'paid';
        enrollment.status = 'enrolled';
        enrollment.paymentId = paymentId;
        await enrollment.save();

        return successResponse({ data: enrollment });
    } catch (err) {
        return handleApiError(err);
    }
}
