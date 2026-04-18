const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    disaster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disaster',
        required: true
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    matchScore: {
        type: Number,
        required: true
    },
    scoreBreakdown: {
        skillMatch: Number,
        distanceMatch: Number,
        availabilityMatch: Number,
        experienceMatch: Number
    },
    distance: {
        type: Number,
        default: 5  // 👈 ADD THIS LINE - default 5km
    },
    estimatedArrival: Date,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

module.exports = mongoose.model('Assignment', assignmentSchema);