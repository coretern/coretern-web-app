import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import Enrollment from '@/models/Enrollment';
import { generateQRCode } from '@/lib/qrGenerator';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAuth, requireAdmin } from '@/lib/auth';

// POST /api/certificates - Issue certificate (Admin)
export async function POST(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { enrollmentId } = await request.json();

        const enrollment = await Enrollment.findById(enrollmentId).populate('user internship');
        if (!enrollment) return errorResponse(`No enrollment with id ${enrollmentId}`, 404);

        if (enrollment.status !== 'enrolled' && enrollment.paymentStatus !== 'paid') {
            return errorResponse('Certificate cannot be issued for unpaid or pending enrollment', 400);
        }

        let certificate = await Certificate.findOne({ user: enrollment.user._id, internship: enrollment.internship._id });

        if (certificate) {
            return successResponse({ data: certificate });
        }

        certificate = new Certificate({ user: enrollment.user._id, internship: enrollment.internship._id, enrollment: enrollment._id });
        await certificate.validate();

        const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/verify/${certificate.certificateId}`;
        const qrCodeData = await generateQRCode(verificationUrl);

        certificate.verificationUrl = verificationUrl;
        certificate.qrCode = qrCodeData;
        await certificate.save();

        enrollment.status = 'completed';
        await enrollment.save();

        return successResponse({ data: certificate }, 201);
    } catch (err) {
        return handleApiError(err);
    }
}
