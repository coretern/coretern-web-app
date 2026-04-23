import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import crypto from 'crypto';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth, requireAdmin, identifyUser } from '@/lib/auth';

// GET /api/tickets - Get all tickets (Admin)
export async function GET(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        return successResponse({ count: tickets.length, data: tickets });
    } catch (err) {
        return handleApiError(err);
    }
}

// POST /api/tickets - Create ticket (Public, with optional auth)
export async function POST(request) {
    try {
        await dbConnect();
        const user = await identifyUser(request);
        const { name, email, phone, subject, message } = await request.json();

        const ticketId = `TS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const ticketData = {
            ticketId, subject, type: user ? 'registered' : 'guest',
            conversation: [{ sender: 'user', message }]
        };

        if (user) {
            ticketData.user = user.id;
            ticketData.name = user.name;
            ticketData.email = user.email;
            ticketData.phone = user.phone || 'N/A';
        } else {
            ticketData.name = name;
            ticketData.email = email;
            ticketData.phone = phone;
        }

        const ticket = await Ticket.create(ticketData);
        return successResponse({ data: ticket }, 201);
    } catch (err) {
        return handleApiError(err);
    }
}
