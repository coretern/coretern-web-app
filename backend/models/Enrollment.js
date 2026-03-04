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
    // Student Details for Enrollment/Certificate
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    collegeRegNumber: String,
    collegeName: String,
    course: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resume: String,
    agreedToRefundPolicy: {
        type: Boolean,
        default: false
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    // Review Details
    reviewText: String,
    reviewDate: {
        type: Date
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
