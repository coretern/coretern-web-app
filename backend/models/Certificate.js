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
        required: true
    },
    internship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    qrCode: {
        type: String // We will store the data URL or Cloudinary URL here
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
