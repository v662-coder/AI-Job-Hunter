const OpenAI = require("openai");
const config = require("../config/config");
const logger = require("../utils/logger");
const { ScraperError } = require("../utils/errorHandler");

const client = new OpenAI({
    apiKey: config.ai.apiKey,
    baseURL: config.ai.baseURL
});
/**
 * Extracts key technical skills/keywords from a job description using AI.
 * Returns an array of keyword strings (e.g. ["React", "Node.js", "MongoDB"]).
 */
async function extractKeywords(jobDescription) {
    if (!jobDescription || jobDescription.trim().length === 0) {
        return [];
    }

    try {
        const response = await client.chat.completions.create({
            model: config.ai.model,
            messages: [
                {
                    role: "system",
                    content:
                        "You extract technical skills and keywords from job descriptions. " +
                        "Respond ONLY with a JSON array of strings, nothing else. No markdown, no explanation."
                },
                {
                    role: "user",
                    content: `Extract the key technical skills/keywords from this job description:\n\n${jobDescription}`
                }
            ],
            temperature: 0
        });

        const raw = response.choices[0].message.content.trim();
        const cleaned = raw.replace(/```json|```/g, "").trim();

        const keywords = JSON.parse(cleaned);
        return Array.isArray(keywords) ? keywords : [];
    } catch (err) {
        logger.error(`Keyword extraction failed: ${err.message}`);
        throw new ScraperError("Failed to extract keywords via AI", { original: err.message });
    }
}

module.exports = { extractKeywords };