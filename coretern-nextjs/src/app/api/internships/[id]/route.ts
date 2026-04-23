import dbConnect from '@/lib/db';
import Internship from '@/models/Internship';
import { successResponse, handleApiError, errorResponse } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

// GET /api/internships/[id] - Get single internship (Public)
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const internship = await Internship.findById(id);

        if (!internship) {
            return errorResponse(`Internship not found with id of ${id}`, 404);
        }

        return successResponse({ data: internship });
    } catch (err) {
        return handleApiError(err);
    }
}

// PUT /api/internships/[id] - Update internship (Admin only)
export async function PUT(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        let internship = await Internship.findById(id);

        if (!internship) {
            return errorResponse(`Internship not found with id of ${id}`, 404);
        }

        const formData = await request.formData();
        const body = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'image' && value instanceof File && value.size > 0) {
                if (isCloudinaryConfigured) {
                    const buffer = Buffer.from(await value.arrayBuffer());
                    const result = await uploadToCloudinary(buffer);
                    body.image = result.secure_url;
                }
            } else {
                body[key] = value;
            }
        }

        // Handle curriculum normalization
        if (body['curriculum[]']) {
            body.curriculum = Array.isArray(body['curriculum[]'])
                ? body['curriculum[]']
                : [body['curriculum[]']];
            delete body['curriculum[]'];
        } else if (body.curriculum && typeof body.curriculum === 'string') {
            body.curriculum = body.curriculum.split(',').map(i => i.trim()).filter(i => i !== '');
        }

        // Parse videos JSON
        if (body.videos && typeof body.videos === 'string') {
            try { body.videos = JSON.parse(body.videos); } catch (e) { /* keep original */ }
        }

        Object.keys(body).forEach(key => {
            internship[key] = body[key];
        });

        await internship.save();

        return successResponse({ data: internship });
    } catch (err) {
        return handleApiError(err);
    }
}

// DELETE /api/internships/[id] - Delete internship (Admin only)
export async function DELETE(request, { params }) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { id } = await params;
        const internship = await Internship.findById(id);

        if (!internship) {
            return errorResponse(`Internship not found with id of ${id}`, 404);
        }

        await internship.deleteOne();
        return successResponse({ data: {} });
    } catch (err) {
        return handleApiError(err);
    }
}
