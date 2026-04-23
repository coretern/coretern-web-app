import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { successResponse, handleApiError } from '@/lib/apiResponse';

// GET /api/enrollments/reviews/[internshipId] - Get reviews (Public)
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { internshipId } = await params;

        const query = { reviewText: { $exists: true, $ne: '' } };
        if (internshipId && internshipId !== 'all') {
            query.internship = internshipId;
        }

        const reviews = await Enrollment.find(query)
            .select('reviewText reviewDate fullName user internship')
            .populate('internship', 'title')
            .sort('-reviewDate');

        return successResponse({ count: reviews.length, data: reviews });
    } catch (err) {
        return handleApiError(err);
    }
}
