const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const disasterRoutes = require('./routes/disasters');
const volunteerRoutes = require('./routes/volunteers');
const allocationRoutes = require('./routes/allocation');
const analyticsRoutes = require('./routes/analytics');

// Use Routes
app.use('/api/disasters', disasterRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/allocation', allocationRoutes);
app.use('/api/analytics', analyticsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});