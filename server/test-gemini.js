const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function checkModels() {
  // Use a fetch to call the list_models endpoint manually
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ API Error:", data.error.message);
    } else {
        console.log("✅ API Key is Valid. Available Models:");
        data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(` - ${m.name}`); // Copy one of these names!
            }
        });
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

checkModels();