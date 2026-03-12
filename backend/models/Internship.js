const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String
    },
    domain: {
        type: String,
        required: [true, 'Please specify the domain (e.g. Web Dev, AI)']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    duration: {
        type: String,
        required: [true, 'Please add duration (e.g. 4 Weeks, 3 Months)']
    },
    fee: {
        type: Number,
        required: [true, 'Please add the internship fee']
    },
    curriculum: [String],
    details: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    videos: [
        {
            title: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            duration: String
        }
    ],
    whatsappGroup: {
        type: String,
        default: ''
    },
    storageType: {
        type: String,
        enum: ['database', 'file'],
        default: 'database'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', internshipSchema);
