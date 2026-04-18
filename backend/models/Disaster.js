const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    type: {
        type: String,
        required: true,
        enum: ['rescue', 'flood', 'medical', 'fire', 'accident', 'food']
    },
    urgency: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    peopleAffected: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'resolved'],
        default: 'pending'
    },
    priorityScore: {
        type: Number,
        default: 0
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date
});

// Calculate priority score before saving
disasterSchema.pre('save', function(next) {
    let score = 0;
    
    // Urgency scoring
    if (this.urgency === 'high') score += 40;
    else if (this.urgency === 'medium') score += 25;
    else score += 10;
    
    // People affected scoring
    if (this.peopleAffected > 100) score += 35;
    else if (this.peopleAffected > 50) score += 25;
    else if (this.peopleAffected > 20) score += 15;
    else score += 5;
    
    // Disaster type severity
    const severeTypes = ['fire', 'medical', 'rescue'];
    if (severeTypes.includes(this.type)) score += 25;
    
    this.priorityScore = score;
    next();
});

module.exports = mongoose.model('Disaster', disasterSchema);