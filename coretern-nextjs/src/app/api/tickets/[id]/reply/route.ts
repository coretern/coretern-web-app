import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// PUT /api/tickets/[id]/reply
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const { message } = await request.json();

        if (!message) return errorResponse('Message is required', 400);

        const ticket = await Ticket.findById(id);
        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);

        if (ticket.type !== 'registered') {
            return errorResponse('Cannot reply to guest tickets via chat', 403);
        }

        const isAdmin = authResult.user.role === 'admin';
        if (!isAdmin && ticket.user?.toString() !== authResult.user.id) {
            return errorResponse('Not authorized to access this ticket', 401);
        }

        ticket.conversation.push({
            sender: isAdmin ? 'admin' : 'user',
            message,
            createdAt: new Date()
        });

        // Auto-update status if replied by admin
        if (isAdmin && ticket.status === 'open') {
            ticket.status = 'pending';
        }

        await ticket.save();

        return successResponse({ data: ticket });
    } catch (err) {
        return handleApiError(err);
    }
}
