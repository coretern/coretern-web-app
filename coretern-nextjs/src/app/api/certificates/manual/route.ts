import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import { generateQRCode } from '@/lib/qrGenerator';
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { requireAdmin } from '@/lib/auth';

// POST /api/certificates/manual - Issue manual certificate (Admin)
export async function POST(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const { certificateId, recipientName, certType, description } = await request.json();

        let certificate = await Certificate.findOne({ certificateId });
        if (certificate) return errorResponse('Certificate ID already exists', 400);

        certificate = new Certificate({ certificateId, recipientName, certType, description, isManual: true });

        const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/verify/${certificate.certificateId}`;
        const qrCodeData = await generateQRCode(verificationUrl);

        certificate.verificationUrl = verificationUrl;
        certificate.qrCode = qrCodeData;
        await certificate.save();

        return successResponse({ data: certificate }, 201);
    } catch (err) {
        return handleApiError(err);
    }
}

// GET /api/certificates/manual - Get all manual certs (Admin)
export async function GET(request) {
    try {
        const authResult = await requireAdmin(request);
        if (authResult.error) return errorResponse(authResult.error, authResult.status);

        await dbConnect();
        const certificates = await Certificate.find({ isManual: true }).sort({ issueDate: -1 });

        return successResponse({ count: certificates.length, data: certificates });
    } catch (err) {
        return handleApiError(err);
    }
}
