const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const genAI = require('../config/gemini'); // Import Gemini

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        // 1. Prepare the Prompt
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
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
            // We continue even if AI fails
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

module.exports = router;