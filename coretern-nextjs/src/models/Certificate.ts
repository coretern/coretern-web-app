import mongoose from 'mongoose';
import crypto from 'crypto';

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: function () { return !this.isManual; }
    },
    internship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        required: function () { return !this.isManual; }
    },
    enrollment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enrollment',
        required: function () { return !this.isManual; }
    },
    isManual: {
        type: Boolean,
        default: false
    },
    // New fields for Manual Certificates
    recipientName: {
        type: String
    },
    certType: {
        type: String
    },
    description: {
        type: String
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    qrCode: {
        type: String
    },
    verificationUrl: {
        type: String
    }
});

// Generate unique certificate ID before saving
certificateSchema.pre('validate', function () {
    if (!this.certificateId) {
        this.certificateId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    }
});

export interface ICertificate extends mongoose.Document {
    certificateId: string;
    user?: mongoose.Types.ObjectId;
    internship?: mongoose.Types.ObjectId;
    enrollment?: mongoose.Types.ObjectId;
    isManual: boolean;
    recipientName?: string;
    certType?: string;
    description?: string;
    issueDate: Date;
    qrCode?: string;
    verificationUrl?: string;
}

const Certificate: mongoose.Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', certificateSchema);
export default Certificate;
