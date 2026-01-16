const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const genAI = require('../config/gemini'); // Import Gemini

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        // 1. Prepare the Prompt
        // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
            Analyze this customer support ticket.
            Title: "${title}"
            Description: "${description}"
            
            Return ONLY a valid JSON object (no markdown formatting) with these fields:
            {
                "sentiment_score": (a number between -1 and 1, e.g. -0.8 for angry),
                "priority": ("high", "medium", or "low"),
                "suggested_solution": (a short response advice)
            }
        `;

        // 2. Call Gemini API
        let aiData = { sentiment_score: 0, priority: 'medium', suggested_solution: '' };
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up Markdown if Gemini adds it (e.g. ```json ... ```)
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            aiData = JSON.parse(text);
            console.log("🤖 AI Analysis:", aiData);

        } catch (aiError) {
            console.error("⚠️ AI Failed:", aiError.message);
           
        }

        // 3. Insert into Database
        const [result] = await pool.query(
            'INSERT INTO tickets (organization_id, user_id, title, description, status, priority, sentiment_score, ai_suggested_solution) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.user.organization_id,
                req.user.id,
                title,
                description,
                'open',
                aiData.priority || 'medium',
                aiData.sentiment_score || 0,
                aiData.suggested_solution || 'Manual review required.'
            ]
        );

        res.status(201).json({ 
            message: 'Ticket created', 
            ticketId: result.insertId,
            ai_analysis: aiData 
        });

    } catch (error) {
        console.error("❌ Ticket Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// GET /api/tickets - Fetch all tickets for the user's organization
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE organization_id = ? ORDER BY created_at DESC', 
            [req.user.organization_id]
        );
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






// POST /api/tickets/public/:orgId (No Auth Required)
router.post('/public/:orgId', async (req, res) => {
    try {
        const { title, description, customer_email } = req.body;
        const orgId = req.params.orgId;

        console.log("📨 Received Public Ticket:", title);

        // 1. AI Analysis
        // MAKE SURE THIS MATCHES THE WORKING MODEL FROM YOUR DASHBOARD ROUTE
        // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
            Analyze this support ticket.
            Title: "${title}"
            Description: "${description}"
            
            Return ONLY a valid JSON object with these fields:
            {
                "sentiment_score": (number -1 to 1),
                "priority": ("high", "medium", or "low"),
                "suggested_solution": (short string)
            }
        `;
        
        let aiData = { sentiment_score: 0, priority: 'medium', suggested_solution: 'Manual review.' };

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            console.log("🤖 Raw AI Response:", responseText); // DEBUG: See what AI actually sent

            // Robust JSON Extraction (Finds the first '{' and last '}')
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = responseText.substring(jsonStart, jsonEnd);
                aiData = JSON.parse(jsonString);
                console.log("✅ AI Parsed Successfully:", aiData);
            } else {
                throw new Error("No JSON found in response");
            }

        } catch (e) { 
            console.error("⚠️ AI Analysis Failed:", e.message); 
       
        }

        // 2. Insert Ticket
        const [result] = await pool.query(
            'INSERT INTO tickets (organization_id, user_id, title, description, status, priority, sentiment_score, ai_suggested_solution) VALUES (?, NULL, ?, ?, ?, ?, ?, ?)',
            [
                orgId,
                title,
                description + (customer_email ? ` [Contact: ${customer_email}]` : ''),
                'open',
                aiData.priority || 'medium',
                aiData.sentiment_score || 0,
                aiData.suggested_solution || 'Manual review.'
            ]
        );

        res.status(201).json({ message: 'Ticket submitted successfully!' });

    } catch (error) {
        console.error("❌ Public Route Critical Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// PUT /api/tickets/:id/status
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE tickets SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Updated' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;