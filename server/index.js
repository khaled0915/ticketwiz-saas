const express = require('express');
const app = express();
const db = require('./config/db'); // Import your database connection
require('dotenv').config();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

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