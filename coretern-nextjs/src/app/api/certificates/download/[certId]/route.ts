import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';

export async function GET(req: NextRequest, { params }: { params: Promise<{ certId: string }> }) {
    const { certId } = await params;

    try {
        await dbConnect();
        const cert = await Certificate.findOne({ certificateId: certId })
            .populate({ path: 'user', select: 'name email' })
            .populate({ path: 'internship', select: 'title duration domain' })
            .populate({ path: 'enrollment', select: 'fullName collegeName course branch collegeRegNumber startDate endDate' });

        if (!cert) {
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
        }

        // Build certificate data for client-side PDF generation
        const data: any = {
            certificateId: cert.certificateId,
            issueDate: cert.issueDate,
            isManual: cert.isManual,
        };

        if (cert.isManual) {
            data.recipientName = cert.recipientName;
            data.description = cert.description;
            data.certType = cert.certType;
        } else {
            const enrollment = cert.enrollment as any;
            const internship = cert.internship as any;
            data.recipientName = enrollment?.fullName || (cert.user as any)?.name || '';
            data.course = enrollment?.course || '';
            data.branch = enrollment?.branch || '';
            data.collegeName = enrollment?.collegeName || '';
            data.collegeRegNumber = enrollment?.collegeRegNumber || '';
            data.internshipTitle = internship?.title || '';
            data.duration = internship?.duration || '';
            data.startDate = enrollment?.startDate;
            data.endDate = enrollment?.endDate;
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
