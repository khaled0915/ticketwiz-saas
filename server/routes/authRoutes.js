const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// POST /register-saas - Register a new SaaS organization with admin user
router.post('/register-saas', async (req, res) => {
    try {
        const { company_name, admin_name, email, password } = req.body;

        // Validate required fields
        if (!company_name || !admin_name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Generate domain slug from company name
        const domain = company_name.toLowerCase().replace(/\s+/g, '-');

        // Generate API key for the organization
        const api_key = require('crypto').randomBytes(32).toString('hex');

        // Insert organization
        const [orgResult] = await pool.query(
            'INSERT INTO organizations (name, domain, api_key) VALUES (?, ?, ?)',
            [company_name, domain, api_key]
        );

        const organization_id = orgResult.insertId;

        // Insert admin user
        const [userResult] = await pool.query(
            'INSERT INTO users (organization_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [organization_id, admin_name, email, password_hash, 'admin']
        );

        const user_id = userResult.insertId;

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user_id,
                email: email,
                role: 'admin',
                organization_id: organization_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and user info
        res.status(201).json({
            message: 'Organization registered successfully',
            token,
            user: {
                id: user_id,
                name: admin_name,
                email: email,
                role: 'admin',
                organization_id: organization_id
            },
            organization: {
                id: organization_id,
                name: company_name,
                domain: domain
            }
        });

    } catch (error) {
        // console.error('Registration error:', error);
        // res.status(500).json({ error: 'Server error during registration' });
        console.error("❌ Registration Error:", error); // Print the actual error to terminal
res.status(500).json({ error: error.message }); // Send the actual error to Postman
    }
});

module.exports = router;
