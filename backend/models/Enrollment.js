const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['pending', 'enrolled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    cfOrderId: String,
    paymentId: String,
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
