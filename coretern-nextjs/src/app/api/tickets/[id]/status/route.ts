import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';

// PUT /api/tickets/[id]/status - Update ticket status (Admin)
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const { status } = await request.json();

        const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);

        return successResponse({ data: ticket });
    } catch (err) {
        return handleApiError(err);
    }
}
