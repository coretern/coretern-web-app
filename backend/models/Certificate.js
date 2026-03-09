const mongoose = require('mongoose');
const crypto = require('crypto');

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

module.exports = mongoose.model('Certificate', certificateSchema);
