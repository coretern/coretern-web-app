import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/db';

/**
 * Verify JWT token and return user
 * @param {Request} request - Next.js request object
 * @returns {Object|null} user object or null
 */
export async function getAuthUser(request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return null;
    }

    try {
        await dbConnect();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return null;

        // Check token version
        const currentVersion = user.tokenVersion || 0;
        if (decoded.version !== currentVersion) {
            return null;
        }

        return user;
    } catch (err) {
        return null;
    }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request) {
    const user = await getAuthUser(request);
    if (!user) {
        return { error: 'Not authorized to access this route', status: 401 };
    }
    return { user };
}

/**
 * Require admin role
 */
export async function requireAdmin(request) {
    const result = await requireAuth(request);
    if (result.error) return result;

    if (result.user.role !== 'admin') {
        return { error: 'Not authorized - admin only', status: 403 };
    }
    return result;
}

/**
 * Generate JWT token
 */
export function generateToken(user) {
    return jwt.sign(
        { id: user._id, version: user.tokenVersion || 0 },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
}

/**
 * Optional identification (doesn't block if not logged in)
 */
export async function identifyUser(request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        await dbConnect();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findById(decoded.id);
    } catch (err) {
        return null;
    }
}
