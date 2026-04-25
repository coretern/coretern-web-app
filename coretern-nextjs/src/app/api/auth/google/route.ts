import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { tokenId } = await request.json();

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.isVerified = true;
                await user.save();
            }
        } else {
            user = await User.create({
                name, email, googleId,
                isVerified: true, status: 'active',
                gender: 'Other', agreedToTerms: true, agreedToPrivacy: true
            });
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
