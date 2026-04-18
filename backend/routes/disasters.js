const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const Volunteer = require('../models/Volunteer');
const Assignment = require('../models/Assignment');
const scoringEngine = require('../utils/scoringEngine');

// Get all disasters
router.get('/', async (req, res) => {
    try {
        const disasters = await Disaster.find()
            .sort({ priorityScore: -1, createdAt: -1 })
            .populate('assignedVolunteer', 'name skills');
        res.json(disasters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single disaster
router.get('/:id', async (req, res) => {
    try {
        const disaster = await Disaster.findById(req.params.id)
            .populate('assignedVolunteer', 'name skills location phone');
        
        if (!disaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }
        
        // Get recommendations
        const volunteers = await Volunteer.find({ 
            availability: 'free',
            status: 'active'
        });
        
        const recommendations = volunteers.map(volunteer => {
            const score = scoringEngine.calculateTotalScore(volunteer, disaster);
            return { volunteer, score };
        }).sort((a, b) => b.score.total - a.score.total).slice(0, 5);
        
        res.json({ disaster, recommendations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create disaster
router.post('/', async (req, res) => {
    try {
        // Auto-adjust urgency based on people affected
        if (req.body.peopleAffected > 50 && req.body.urgency !== 'high') {
            req.body.urgency = 'high';
        }
        
        const disaster = new Disaster(req.body);
        await disaster.save();
        res.status(201).json(disaster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update disaster
router.put('/:id', async (req, res) => {
    try {
        const disaster = await Disaster.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(disaster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete disaster
router.delete('/:id', async (req, res) => {
    try {
        await Disaster.findByIdAndDelete(req.params.id);
        res.json({ message: 'Disaster deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;