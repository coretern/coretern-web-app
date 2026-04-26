import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// PUT /api/tickets/[id]/status - Update ticket status (Admin or Ticket Owner)
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const { status } = await request.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);

        const isAdmin = authResult.user.role === 'admin';
        if (!isAdmin && ticket.user?.toString() !== authResult.user.id) {
            return errorResponse('Not authorized to access this ticket', 401);
        }

        // Only let users reopen resolved tickets, prevent them from setting arbitrary statuses
        if (!isAdmin && status !== 'open') {
             return errorResponse('Users can only reopen tickets', 403);
        }

        ticket.status = status;
        await ticket.save();

        return successResponse({ data: ticket });
    } catch (err) {
        return handleApiError(err);
    }
}
