import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// GET /api/tickets/my - Get user's tickets
export async function GET(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const tickets = await Ticket.find({ user: authResult.user.id }).sort({ createdAt: -1 });
        return successResponse({ count: tickets.length, data: tickets });
    } catch (err) {
        return handleApiError(err);
    }
}
