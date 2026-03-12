const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    allowEmailAuth: {
        type: Boolean,
        default: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Config', configSchema);
