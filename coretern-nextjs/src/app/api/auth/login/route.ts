import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// POST /api/auth/login
export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return errorResponse('Please provide an email and password', 400);
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse('User not registered', 401);
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return errorResponse('Incorrect password', 401);
        }

        if (!user.isVerified) {
            return errorResponse('Please verify your email first', 401);
        }

        if (user.status === 'suspended') {
            return errorResponse('Your account is suspended.', 403);
        }

        const token = generateToken(user);
        return successResponse({ token });
    } catch (err) {
        return handleApiError(err);
    }
}
