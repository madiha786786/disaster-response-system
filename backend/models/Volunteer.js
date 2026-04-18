const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: String,
    location: {
        type: String,
        required: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    skills: [{
        type: String,
        enum: ['rescue', 'medical', 'fire', 'food', 'flood', 'accident']
    }],
    availability: {
        type: String,
        enum: ['free', 'busy', 'offline'],
        default: 'free'
    },
    reachTime: {
        type: Number,
        required: true,
        min: 1,
        max: 180
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    totalMissions: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    lastActive: Date
});

module.exports = mongoose.model('Volunteer', volunteerSchema);