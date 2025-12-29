const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking models for API key starting with:", apiKey.substring(0, 5));

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        const generationModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        console.log("✅ Models supporting generateContent:");
        generationModels.forEach(m => {
            console.log(`- ${m.name}`);
        });

        if (generationModels.length === 0) {
            console.log("⚠️ No models supporting generateContent found for this API key!");
        }
    } catch (error) {
        console.error("❌ Fetch Failed:", error.message);
    }
}

checkModels();
