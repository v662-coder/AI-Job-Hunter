const { select } = require("@inquirer/prompts");
const logger = require("../utils/logger");
const settings = require("../config/settings");

/**
 * Shows a single job to the user and asks for a decision.
 * Returns: "approve" | "skip" | "quit"
 */
async function reviewJob(job, index, total) {
    console.log("\n" + "=".repeat(60));
    console.log(`Job ${index + 1}/${total}`);
    console.log(`Title:      ${job.title}`);
    console.log(`Company:    ${job.company}`);
    console.log(`Location:   ${job.location}`);
    console.log(`Experience: ${job.experience}`);
    console.log(`Match Score: ${job.matchScore}/100`);
    console.log(`Matched:    ${(job.matchedSkills || []).join(", ") || "-"}`);
    console.log(`Missing:    ${(job.missingSkills || []).join(", ") || "-"}`);
    console.log(`Summary:    ${job.summary || "-"}`);
    console.log(`URL:        ${job.url}`);
    console.log("=".repeat(60));

    const decision = await select({
        message: "What do you want to do with this job?",
        choices: [
            { name: "✅ Approve (apply to this job)", value: "approve" },
            { name: "⏭️  Skip (don't apply)", value: "skip" },
            { name: "🛑 Quit review (stop reviewing remaining jobs)", value: "quit" }
        ]
    });

    return decision;
}

/**
 * Runs the review flow over a list of matched jobs.
 * Returns an array of approved jobs only.
 */
async function runReviewPanel(matchedJobs) {
    const { minScoreToShow, maxJobsToReview } = settings.review;

    const candidates = matchedJobs
        .filter((job) => job.matchScore >= minScoreToShow)
        .slice(0, maxJobsToReview);

    if (candidates.length === 0) {
        logger.warn(`No jobs found above the minimum score threshold (${minScoreToShow}).`);
        return [];
    }

    logger.info(`Starting review for ${candidates.length} job(s) (score >= ${minScoreToShow}).`);

    const approved = [];

    for (let i = 0; i < candidates.length; i++) {
        const job = candidates[i];
        const decision = await reviewJob(job, i, candidates.length);

        if (decision === "approve") {
            approved.push(job);
            logger.success(`Approved: ${job.title} @ ${job.company}`);
        } else if (decision === "skip") {
            logger.info(`Skipped: ${job.title} @ ${job.company}`);
        } else if (decision === "quit") {
            logger.warn("Review stopped by user.");
            break;
        }
    }

    logger.success(`Review complete. ${approved.length} job(s) approved for application.`);
    return approved;
}

module.exports = { runReviewPanel, reviewJob };