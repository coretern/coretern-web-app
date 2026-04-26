import dbConnect from '@/lib/db';
import User from '@/models/User';
import sendEmail from '@/lib/email';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
export async function POST(request) {
    try {
        await dbConnect();
        const { name, email, password, role, phone, gender, agreedToTerms, agreedToPrivacy } = await request.json();

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return errorResponse('User already exists and is verified', 400);
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        if (user && !user.isVerified) {
            user.name = name || user.name;
            user.password = password || user.password;
            user.phone = phone || user.phone;
            user.gender = gender || user.gender;
            user.role = role || user.role;
            user.agreedToTerms = agreedToTerms || user.agreedToTerms;
            user.agreedToPrivacy = agreedToPrivacy || user.agreedToPrivacy;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            user = await User.create({
                name, email, password, role, phone, gender,
                agreedToTerms, agreedToPrivacy, otp, otpExpires, isVerified: false
            });
        }

        try {
            // Fire and forget email to prevent hanging the response
            sendEmail({
                email: user.email,
                subject: 'Email Verification OTP',
                message: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
                html: `<h3>Email Verification</h3><p>Your verification OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
            }).catch(err => console.error('Email send error:', err));

            return successResponse({ message: 'OTP sent to email. Please verify to complete registration.' });
        } catch (err) {
            console.error('Registration success response error:', err);
            return errorResponse('Something went wrong after saving user', 500);
        }
    } catch (err) {
        return handleApiError(err);
    }
}
