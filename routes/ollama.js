const express = require('express');
const router = express.Router();
const ollama = require('ollama'); // Make sure to install ollama-js

router.post("/ollama/response", async (req, res) => {
    const { query } = req.body;
    
    const defaultContext = `
    You are a helpful assistant that provides advice on affordability, nutrition, and value comparisons.
    - When comparing prices, calculate cost per unit (e.g., price per apple).
    - If nutrition is mentioned, consider health benefits.
    - If a diet is specified (e.g., keto, vegan), recommend accordingly.
    - If the user asks what's more filling, prioritize satiety and affordability.
    - Keep responses concise and practical.
    `;
    
    try {
        const response = await ollama.chat({
            model: 'llama2', // Using Llama 2 instead of 3
            messages: [
                { role: 'system', content: defaultContext },
                { role: 'user', content: query }
            ],
            options: {
                temperature: 0.7, // Controls randomness (0 = precise, 1 = creative)
            }
        });
        
        res.json({ reply: response.message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to get response" });
    }
});

module.exports = router;