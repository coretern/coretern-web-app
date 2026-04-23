import dbConnect from '@/lib/db';
import Internship from '@/models/Internship';
import { successResponse, handleApiError, errorResponse } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

// GET /api/internships - Get all active internships (Public)
export async function GET() {
    try {
        await dbConnect();
        const internships = await Internship.find({ active: { $ne: false } });
        return successResponse({ count: internships.length, data: internships });
    } catch (err) {
        return handleApiError(err);
    }
}

// POST /api/internships - Create new internship (Admin only)
export async function POST(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();

        const formData = await request.formData();
        const body = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'image' && value instanceof File) {
                // Handle file upload
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
            try { body.videos = JSON.parse(body.videos); } catch (e) { body.videos = []; }
        } else if (!body.videos) {
            body.videos = [];
        }

        const internship = await Internship.create(body);
        return successResponse({ data: internship }, 201);
    } catch (err) {
        return handleApiError(err);
    }
}
