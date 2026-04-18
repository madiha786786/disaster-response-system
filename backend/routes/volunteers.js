const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// Get all volunteers
router.get('/', async (req, res) => {
    try {
        const { availability, skill } = req.query;
        let query = {};
        
        if (availability) query.availability = availability;
        if (skill) query.skills = skill;
        
        const volunteers = await Volunteer.find(query)
            .sort({ registeredAt: -1 });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single volunteer
router.get('/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create volunteer
router.post('/', async (req, res) => {
    try {
        // Check if email exists
        const existingVolunteer = await Volunteer.findOne({ email: req.body.email });
        if (existingVolunteer) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update volunteer
router.put('/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete volunteer
router.delete('/:id', async (req, res) => {
    try {
        await Volunteer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;