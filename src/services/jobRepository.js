const Job = require("../models/Job");
const logger = require("../utils/logger");

/**
 * Inserts scraped jobs into MongoDB, skipping duplicates (by url).
 * Uses upsert so re-scraping the same job updates it instead of erroring.
 */
async function saveScrapedJobs(jobs) {
    let savedCount = 0;

    for (const job of jobs) {
        try {
            await Job.updateOne(
                { url: job.url },
                { $setOnInsert: { ...job, status: "scraped" } },
                { upsert: true }
            );
            savedCount++;
        } catch (err) {
            logger.warn(`Skipped duplicate/invalid job: ${job.title} (${err.message})`);
        }
    }

    logger.success(`${savedCount} job(s) processed into database.`);
    return savedCount;
}

/**
 * Updates a job with AI match results.
 */
async function saveMatchResult(url, matchData) {
    return Job.updateOne(
        { url },
        { $set: { ...matchData, status: "matched" } }
    );
}

/**
 * Fetches jobs that haven't been matched by AI yet.
 */
async function getUnmatchedJobs() {
    return Job.find({ status: "scraped" }).lean();
}

/**
 * Fetches jobs approved (via dashboard or CLI) but not yet applied.
 */
async function getApprovedJobs() {
    return Job.find({ status: "approved" }).lean();
}

/**
 * Updates a job's status after an apply attempt.
 */
async function updateApplyResult(url, result) {
    const update = {
        status: result.applyStatus === "applied" ? "applied" : "failed",
        appliedAt: result.applyStatus === "applied" ? new Date() : null,
        applyError: result.error || ""
    };
    return Job.updateOne({ url }, { $set: update });
}

module.exports = {
    saveScrapedJobs,
    saveMatchResult,
    getUnmatchedJobs,
    getApprovedJobs,
    updateApplyResult
};