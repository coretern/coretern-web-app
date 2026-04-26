import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

// PUT /api/auth/update-profile
export async function PUT(request) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        
        const contentType = request.headers.get('content-type') || '';
        let name, gender, phone, avatarUrl;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            name = formData.get('name');
            gender = formData.get('gender');
            phone = formData.get('phone');
            
            const file = formData.get('avatar');
            if (file && file instanceof File) {
                if (file.size > 3 * 1024 * 1024) {
                    return errorResponse('Image must be less than 3MB', 400);
                }
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    return errorResponse('Only JPG and PNG images are allowed', 400);
                }
                if (!isCloudinaryConfigured) {
                    return errorResponse('Cloudinary is not configured for image uploads', 500);
                }
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const result = await uploadToCloudinary(buffer, 'coretern_users');
                avatarUrl = result.secure_url;
            }
        } else {
            const body = await request.json();
            name = body.name;
            gender = body.gender;
            phone = body.phone;
        }

        const user = await User.findById(authResult.user.id);
        if (!user) return errorResponse('User not found', 404);

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (phone) user.phone = phone;
        if (avatarUrl) user.avatar = avatarUrl;

        await user.save();

        return successResponse({ data: user, message: 'Profile updated successfully' });
    } catch (err) {
        return handleApiError(err);
    }
}
