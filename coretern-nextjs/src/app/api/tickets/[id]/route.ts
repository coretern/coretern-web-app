import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/tickets/[id] - Get single ticket
export async function GET(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const ticket = await Ticket.findById(id);

        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);
        if (authResult.user.role !== 'admin' && ticket.user?.toString() !== authResult.user.id) {
            return errorResponse('Not authorized to access this ticket', 401);
        }

        return successResponse({ data: ticket });
    } catch (err) {
        return handleApiError(err);
    }
}

// DELETE /api/tickets/[id] - Delete ticket (Admin)
export async function DELETE(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const ticket = await Ticket.findById(id);

        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);
        await ticket.deleteOne();

        return successResponse({ data: {} });
    } catch (err) {
        return handleApiError(err);
    }
}
