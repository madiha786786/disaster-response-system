// const express = require('express');
// const router = express.Router();
// const Disaster = require('../models/Disaster');
// const Volunteer = require('../models/Volunteer');
// const Assignment = require('../models/Assignment');
// const scoringEngine = require('../utils/scoringEngine');

// // Firebase Admin setup
// const admin = require('firebase-admin');

// // ✅ FIXED: Use your actual file path
// const serviceAccount = require('C:/Users/Dell/Downloads/disasterresponsesystem-d5545-firebase-adminsdk-fbsvc-d41de0f91d.json');

// // Initialize only if not already initialized
// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//     });
//     console.log('✅ Firebase Admin initialized');
// }

// // Function to send notification to volunteers
// async function sendDisasterNotification(disaster, volunteers) {
//     if (!volunteers || volunteers.length === 0) return;
    
//     console.log(`📨 Sending notifications to ${volunteers.length} volunteers...`);
    
//     for (const volunteer of volunteers) {
//         if (!volunteer.fcmToken) continue;
        
//         const message = {
//             notification: {
//                 title: `🚨 ${disaster.type.toUpperCase()} Emergency!`,
//                 body: `${disaster.location} - ${disaster.peopleAffected} people affected. Urgency: ${disaster.urgency}`
//             },
//             webpush: {
//                 fcmOptions: {
//                     link: `https://disaster-response-frontend-piex.onrender.com/allocation.html?disaster=${disaster._id}`
//                 },
//                 notification: {
//                     icon: 'https://cdn-icons-png.flaticon.com/512/4474/4474294.png',
//                     badge: 'https://cdn-icons-png.flaticon.com/512/4474/4474294.png',
//                     vibrate: [200, 100, 200],
//                     requireInteraction: true
//                 }
//             },
//             data: {
//                 disasterId: disaster._id.toString(),
//                 type: disaster.type,
//                 location: disaster.location,
//                 urgency: disaster.urgency,
//                 click_action: 'FLUTTER_NOTIFICATION_CLICK',
//                 route: '/allocation.html'
//             },
//             token: volunteer.fcmToken
//         };

//         try {
//             await admin.messaging().send(message);
//             console.log(`✅ Notification sent to ${volunteer.name}`);
//         } catch (error) {
//             console.error(`❌ Failed to send to ${volunteer.name}:`, error.message);
//         }
//     }
// }

// // Get all disasters
// router.get('/', async (req, res) => {
//     try {
//         const disasters = await Disaster.find()
//             .sort({ priorityScore: -1, createdAt: -1 })
//             .populate('assignedVolunteer', 'name skills');
//         res.json(disasters);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get single disaster
// router.get('/:id', async (req, res) => {
//     try {
//         const disaster = await Disaster.findById(req.params.id)
//             .populate('assignedVolunteer', 'name skills location phone');
        
//         if (!disaster) {
//             return res.status(404).json({ message: 'Disaster not found' });
//         }
        
//         const volunteers = await Volunteer.find({ 
//             availability: 'free',
//             status: 'active'
//         });
        
//         const recommendations = volunteers.map(volunteer => {
//             const score = scoringEngine.calculateTotalScore(volunteer, disaster);
//             return { volunteer, score: score.total };
//         }).sort((a, b) => b.score - a.score).slice(0, 5);
        
//         res.json({ disaster, recommendations });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Create disaster - THIS IS WHERE NOTIFICATIONS ARE SENT
// router.post('/', async (req, res) => {
//     try {
//         // Auto-adjust urgency based on people affected
//         if (req.body.peopleAffected > 50 && req.body.urgency !== 'high') {
//             req.body.urgency = 'high';
//         }
        
//         const disaster = new Disaster(req.body);
//         await disaster.save();
        
//         console.log(`🚨 New disaster created: ${disaster.type} at ${disaster.location}`);
        
//         // ✅ SEND NOTIFICATIONS TO FREE VOLUNTEERS
//         try {
//             const freeVolunteers = await Volunteer.find({ 
//                 availability: 'free',
//                 status: 'active',
//                 fcmToken: { $ne: null, $exists: true }
//             });
            
//             console.log(`📋 Found ${freeVolunteers.length} volunteers with FCM tokens`);
            
//             if (freeVolunteers.length > 0) {
//                 await sendDisasterNotification(disaster, freeVolunteers);
//             } else {
//                 console.log('⚠️ No volunteers with FCM tokens found');
//             }
//         } catch (notifyError) {
//             console.error('Notification error:', notifyError);
//             // Don't fail the request if notification fails
//         }
        
//         res.status(201).json(disaster);
//     } catch (error) {
//         console.error('Error creating disaster:', error);
//         res.status(400).json({ message: error.message });
//     }
// });

// // Update disaster
// router.put('/:id', async (req, res) => {
//     try {
//         const disaster = await Disaster.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         res.json(disaster);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Delete disaster
// router.delete('/:id', async (req, res) => {
//     try {
//         await Disaster.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Disaster deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const Volunteer = require('../models/Volunteer');
const Assignment = require('../models/Assignment');
const scoringEngine = require('../utils/scoringEngine');

// Firebase Admin setup
const admin = require('firebase-admin');

// ✅ USE ENVIRONMENT VARIABLE instead of local file path
let adminInitialized = false;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            adminInitialized = true;
            console.log('✅ Firebase Admin initialized from environment variable');
        }
    } catch (error) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
    }
} else {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT environment variable not set - notifications disabled');
}

// Function to send notification to volunteers
async function sendDisasterNotification(disaster, volunteers) {
    if (!adminInitialized) {
        console.log('📨 Firebase not initialized - skipping notifications');
        return;
    }
    
    if (!volunteers || volunteers.length === 0) return;
    
    console.log(`📨 Sending notifications to ${volunteers.length} volunteers...`);
    
    for (const volunteer of volunteers) {
        if (!volunteer.fcmToken) continue;
        
        const message = {
            notification: {
                title: `🚨 ${disaster.type.toUpperCase()} Emergency!`,
                body: `${disaster.location.substring(0, 50)} - ${disaster.peopleAffected} people affected. Urgency: ${disaster.urgency}`
            },
            webpush: {
                fcmOptions: {
                    link: `https://disaster-response-frontend-piex.onrender.com/allocation.html?disaster=${disaster._id}`
                },
                notification: {
                    icon: 'https://cdn-icons-png.flaticon.com/512/4474/4474294.png',
                    badge: 'https://cdn-icons-png.flaticon.com/512/4474/4474294.png',
                    vibrate: [200, 100, 200],
                    requireInteraction: true
                }
            },
            data: {
                disasterId: disaster._id.toString(),
                type: disaster.type,
                location: disaster.location,
                urgency: disaster.urgency,
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                route: '/allocation.html'
            },
            token: volunteer.fcmToken
        };

        try {
            await admin.messaging().send(message);
            console.log(`✅ Notification sent to ${volunteer.name}`);
        } catch (error) {
            console.error(`❌ Failed to send to ${volunteer.name}:`, error.message);
        }
    }
}

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
        
        const volunteers = await Volunteer.find({ 
            availability: 'free',
            status: 'active'
        });
        
        const recommendations = volunteers.map(volunteer => {
            const score = scoringEngine.calculateTotalScore(volunteer, disaster);
            return { volunteer, score: score.total };
        }).sort((a, b) => b.score - a.score).slice(0, 5);
        
        res.json({ disaster, recommendations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create disaster - THIS IS WHERE NOTIFICATIONS ARE SENT
router.post('/', async (req, res) => {
    try {
        // Auto-adjust urgency based on people affected
        if (req.body.peopleAffected > 50 && req.body.urgency !== 'high') {
            req.body.urgency = 'high';
        }
        
        const disaster = new Disaster(req.body);
        await disaster.save();
        
        console.log(`🚨 New disaster created: ${disaster.type} at ${disaster.location}`);
        
        // ✅ SEND NOTIFICATIONS TO FREE VOLUNTEERS
        try {
            const freeVolunteers = await Volunteer.find({ 
                availability: 'free',
                status: 'active',
                fcmToken: { $ne: null, $exists: true }
            });
            
            console.log(`📋 Found ${freeVolunteers.length} volunteers with FCM tokens`);
            
            if (freeVolunteers.length > 0) {
                await sendDisasterNotification(disaster, freeVolunteers);
            } else {
                console.log('⚠️ No volunteers with FCM tokens found');
            }
        } catch (notifyError) {
            console.error('Notification error:', notifyError);
            // Don't fail the request if notification fails
        }
        
        res.status(201).json(disaster);
    } catch (error) {
        console.error('Error creating disaster:', error);
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