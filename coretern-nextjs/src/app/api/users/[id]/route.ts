import dbConnect from '@/lib/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Certificate from '@/models/Certificate';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';

// POST /api/users/[id]/impersonate - Impersonate user (Admin)
export async function POST(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) return errorResponse(`No user with id ${id}`, 404);

        const token = jwt.sign({ id: user._id, version: user.tokenVersion || 0 }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        return successResponse({ token });
    } catch (err) {
        return handleApiError(err);
    }
}

// PUT /api/users/[id]/toggle-status
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) return errorResponse(`No user with id ${id}`, 404);

        user.status = user.status === 'active' ? 'suspended' : 'active';
        await User.findByIdAndUpdate(id, { status: user.status });

        return successResponse({ data: user });
    } catch (err) {
        return handleApiError(err);
    }
}

// DELETE /api/users/[id]
export async function DELETE(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) return errorResponse(`No user with id ${id}`, 404);

        await Enrollment.deleteMany({ user: user._id });
        await Certificate.deleteMany({ user: user._id });
        await user.deleteOne();

        return successResponse({ data: {} });
    } catch (err) {
        return handleApiError(err);
    }
}
