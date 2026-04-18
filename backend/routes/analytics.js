const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const Volunteer = require('../models/Volunteer');
const Assignment = require('../models/Assignment');

router.get('/dashboard', async (req, res) => {
    try {
        const totalDisasters = await Disaster.countDocuments();
        const activeDisasters = await Disaster.countDocuments({ status: 'pending' });
        const resolvedDisasters = await Disaster.countDocuments({ status: 'resolved' });
        
        const totalVolunteers = await Volunteer.countDocuments();
        const availableVolunteers = await Volunteer.countDocuments({ availability: 'free' });
        const busyVolunteers = await Volunteer.countDocuments({ availability: 'busy' });
        
        const totalAssignments = await Assignment.countDocuments();
        const completedAssignments = await Assignment.countDocuments({ status: 'completed' });
        
        const urgentDisasters = await Disaster.find({ urgency: 'high', status: 'pending' })
            .sort({ priorityScore: -1 })
            .limit(5);
        
        const recentAssignments = await Assignment.find()
            .populate('disaster', 'location type')
            .populate('volunteer', 'name')
            .sort({ assignedAt: -1 })
            .limit(5);
        
        // Disaster type distribution
        const disasterTypes = await Disaster.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        
        // Average response time (simulated)
        const avgResponseTime = 28.5; // minutes
        
        res.json({
            stats: {
                disasters: { total: totalDisasters, active: activeDisasters, resolved: resolvedDisasters },
                volunteers: { total: totalVolunteers, available: availableVolunteers, busy: busyVolunteers },
                assignments: { total: totalAssignments, completed: completedAssignments },
                avgResponseTime
            },
            urgentDisasters,
            recentAssignments,
            disasterTypes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;