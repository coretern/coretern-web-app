import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Certificate from '@/models/Certificate';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// GET /api/enrollments/my - Get user's enrollments
export async function GET(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const enrollments = await Enrollment.find({ user: authResult.user.id }).populate('internship');

        const updatedEnrollments = await Promise.all(enrollments.map(async (enrol) => {
            const enrolObj = enrol.toObject();
            if (enrolObj.status === 'completed') {
                const certExists = await Certificate.exists({ user: enrolObj.user, internship: enrolObj.internship._id });
                if (!certExists) enrolObj.status = 'enrolled';
            }
            return enrolObj;
        }));

        return successResponse({ count: updatedEnrollments.length, data: updatedEnrollments });
    } catch (err) {
        return handleApiError(err);
    }
}
