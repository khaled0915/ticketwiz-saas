const express = require('express');
const app = express();
const db = require('./config/db'); // Import your database connection
require('dotenv').config();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());



// 👇 ADD THIS DEBUG BLOCK 👇
app.use((req, res, next) => {
    console.log(`➡️  Method: ${req.method} | URL: ${req.url}`);
    console.log('📝 Content-Type:', req.get('Content-Type')); // This MUST say application/json
    console.log('📦 Body:', req.body); // This should show your data
    next();
});
// 👆 END DEBUG BLOCK 👆


const PORT = process.env.PORT || 5000;

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


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