const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db'); 
const cors = require('cors');

const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`➡️  Method: ${req.method} | URL: ${req.url}`);
    console.log('📝 Content-Type:', req.get('Content-Type'));
    console.log('📦 Body:', req.body); 
    next();
});

const PORT = process.env.PORT || 5000;

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Start Server and Test DB
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    try {
        // Test the database connection
        await db.query('SELECT 1');
        console.log('✅ MySQL Connected Successfully');
    } catch (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
    }
});