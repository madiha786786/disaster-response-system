const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const Volunteer = require('../models/Volunteer');
const Assignment = require('../models/Assignment');
const scoringEngine = require('../utils/scoringEngine');

// Get best volunteer for a disaster
router.get('/recommend/:disasterId', async (req, res) => {
    try {
        const disaster = await Disaster.findById(req.params.disasterId);
        if (!disaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }
        
        const volunteers = await Volunteer.find({ 
            availability: 'free',
            status: 'active'
        });
        
        const recommendations = volunteers.map(volunteer => {
            const score = scoringEngine.calculateTotalScore(volunteer, disaster);
            return {
                volunteer,
                score: score.total,
                breakdown: {
                    skillMatch: score.skillMatch,
                    distanceMatch: score.distanceScore,
                    distance: score.distance,
                    availabilityMatch: score.availabilityScore,
                    experienceMatch: score.experienceScore
                }
            };
        }).sort((a, b) => b.score - a.score);
        
        res.json({
            disaster,
            recommendations: recommendations.slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Assign volunteer to disaster
router.post('/assign', async (req, res) => {
    try {
        const { disasterId, volunteerId } = req.body;
        
        const disaster = await Disaster.findById(disasterId);
        const volunteer = await Volunteer.findById(volunteerId);
        
        if (!disaster || !volunteer) {
            return res.status(404).json({ message: 'Disaster or volunteer not found' });
        }
        
        if (disaster.status !== 'pending') {
            return res.status(400).json({ message: 'Disaster already assigned' });
        }
        
        const scoreDetails = scoringEngine.calculateTotalScore(volunteer, disaster);
        
        const assignment = new Assignment({
            disaster: disasterId,
            volunteer: volunteerId,
            matchScore: scoreDetails.total,
            scoreBreakdown: {
                skillMatch: scoreDetails.skillMatch,
                distanceMatch: scoreDetails.distanceScore,
                availabilityMatch: scoreDetails.availabilityScore,
                experienceMatch: scoreDetails.experienceScore
            },
            distance: scoreDetails.distance,
            estimatedArrival: new Date(Date.now() + volunteer.reachTime * 60000)
        });
        
        await assignment.save();
        
        // Update disaster and volunteer
        disaster.status = 'assigned';
        disaster.assignedVolunteer = volunteerId;
        await disaster.save();
        
        volunteer.availability = 'busy';
        volunteer.totalMissions += 1;
        await volunteer.save();
        
        res.status(201).json({
            assignment,
            disaster,
            volunteer,
            scoreDetails
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all assignments
router.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('disaster', 'location type urgency')
            .populate('volunteer', 'name skills')
            .sort({ assignedAt: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Auto-assign all pending disasters
router.post('/auto-assign', async (req, res) => {
    try {
        const pendingDisasters = await Disaster.find({ status: 'pending' })
            .sort({ priorityScore: -1 });
        
        const assignments = [];
        
        for (const disaster of pendingDisasters) {
            const volunteers = await Volunteer.find({ 
                availability: 'free',
                status: 'active'
            });
            
            if (volunteers.length === 0) break;
            
            let bestVolunteer = null;
            let bestScore = -1;
            let bestDetails = null;
            
            for (const volunteer of volunteers) {
                const scoreDetails = scoringEngine.calculateTotalScore(volunteer, disaster);
                if (scoreDetails.total > bestScore && scoreDetails.total > 40) {
                    bestScore = scoreDetails.total;
                    bestVolunteer = volunteer;
                    bestDetails = scoreDetails;
                }
            }
            
            if (bestVolunteer) {
                const assignment = new Assignment({
                    disaster: disaster._id,
                    volunteer: bestVolunteer._id,
                    matchScore: bestScore,
                    scoreBreakdown: {
                        skillMatch: bestDetails.skillMatch,
                        distanceMatch: bestDetails.distanceScore,
                        availabilityMatch: bestDetails.availabilityScore,
                        experienceMatch: bestDetails.experienceScore
                    },
                    distance: bestDetails.distance,
                    estimatedArrival: new Date(Date.now() + bestVolunteer.reachTime * 60000)
                });
                
                await assignment.save();
                
                disaster.status = 'assigned';
                disaster.assignedVolunteer = bestVolunteer._id;
                await disaster.save();
                
                bestVolunteer.availability = 'busy';
                bestVolunteer.totalMissions += 1;
                await bestVolunteer.save();
                
                assignments.push(assignment);
            }
        }
        
        res.json({
            message: `Auto-assigned ${assignments.length} disasters`,
            assignments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;