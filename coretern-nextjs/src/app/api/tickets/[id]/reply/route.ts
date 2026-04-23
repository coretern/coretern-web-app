import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

// PUT /api/tickets/[id]/reply - Reply to ticket
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const { message } = await request.json();

        let ticket = await Ticket.findById(id);
        if (!ticket) return errorResponse(`No ticket with id ${id}`, 404);

        if (authResult.user.role !== 'admin' && ticket.user?.toString() !== authResult.user.id) {
            return errorResponse('Not authorized to reply to this ticket', 401);
        }

        const sender = authResult.user.role === 'admin' ? 'admin' : 'user';

        ticket = await Ticket.findByIdAndUpdate(id, {
            $push: { conversation: { sender, message } },
            status: authResult.user.role === 'admin' ? 'pending' : 'open'
        }, { new: true, runValidators: true });

        return successResponse({ data: ticket });
    } catch (err) {
        return handleApiError(err);
    }
}
