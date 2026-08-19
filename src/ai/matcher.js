const OpenAI = require("openai");
const config = require("../config/config");
const logger = require("../utils/logger");
const { ScraperError } = require("../utils/errorHandler");

const client = new OpenAI({
    apiKey: config.ai.apiKey,
    baseURL: config.ai.baseURL
});

async function matchResumeToJob(resumeText, job) {
    const jobText = `${job.title}\n${job.company}\n${job.description}`;

    try {
        const response = await client.chat.completions.create({
            model: config.ai.model,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an ATS (Applicant Tracking System) resume matching engine. " +
                        "Compare the candidate's resume against the job description. " +
                        "Respond ONLY with valid JSON in this exact format, no markdown, no explanation:\n" +
                        `{"matchScore": <number 0-100>, "matchedSkills": [<strings>], "missingSkills": [<strings>], "summary": "<one sentence>"}`
                },
                {
                    role: "user",
                    content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobText}`
                }
            ],
            temperature: 0
        });

        const raw = response.choices[0].message.content.trim();
        const cleaned = raw.replace(/```json|```/g, "").trim();

        const result = JSON.parse(cleaned);

        return {
            matchScore: Number(result.matchScore) || 0,
            matchedSkills: result.matchedSkills || [],
            missingSkills: result.missingSkills || [],
            summary: result.summary || ""
        };
    } catch (err) {
        logger.error(`Matching failed for "${job.title}": ${err.message}`);
        throw new ScraperError("Failed to match resume to job", { original: err.message });
    }
}

async function matchResumeToJobs(resumeText, jobs) {
    const results = [];

    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        logger.info(`Matching (${i + 1}/${jobs.length}): ${job.title} @ ${job.company}`);

        try {
            const match = await matchResumeToJob(resumeText, job);
            results.push({ ...job, ...match });
            logger.success(`Score: ${match.matchScore}/100 — ${job.title}`);
        } catch (err) {
            logger.warn(`Skipping job "${job.title}" due to matching error.`);
            results.push({ ...job, matchScore: 0, matchedSkills: [], missingSkills: [], summary: "Matching failed." });
        }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { matchResumeToJob, matchResumeToJobs };