const logger = require("../utils/logger");
const settings = require("../config/settings");
const { captureScreenshot } = require("../utils/screenshot");
const { uploadResumeIfNeeded } = require("./uploadResume");
const { handleScreeningQuestions } = require("./fillForm");
const { ScraperError } = require("../utils/errorHandler");
const { randomDelay } = require("../utils/delay");

/**
 * Applies to a single job:
 * - navigates to the job URL
 * - clicks the apply button
 * - uploads resume if needed
 * - handles screening popups
 * - confirms submission
 */
async function applyToJob(page, job, resumePath) {
    const { applyButtonSelectors } = settings.apply;

    try {
        logger.info(`Applying to: ${job.title} @ ${job.company}`);
        await page.goto(job.url, { waitUntil: "domcontentloaded" });
        await randomDelay(1500, 2500);

        let applyButton = null;
        for (const selector of applyButtonSelectors) {
            applyButton = await page.$(selector);
            if (applyButton) break;
        }

        if (!applyButton) {
            logger.warn(`No apply button found for "${job.title}". Skipping.`);
            await captureScreenshot(page, `no-apply-button-${job.title.substring(0, 20)}`);
            return { ...job, applyStatus: "no-button-found" };
        }

        await applyButton.click();
        await randomDelay(2000, 3000);

        await uploadResumeIfNeeded(page, resumePath);
        await handleScreeningQuestions(page);

        await captureScreenshot(page, `applied-${job.title.substring(0, 20)}`);

        logger.success(`Applied successfully: ${job.title} @ ${job.company}`);
        return { ...job, applyStatus: "applied", appliedAt: new Date().toISOString() };

    } catch (err) {
        logger.error(`Failed to apply to "${job.title}": ${err.message}`);
        await captureScreenshot(page, `apply-error-${job.title.substring(0, 20)}`);
        return { ...job, applyStatus: "failed", error: err.message };
    }
}

/**
 * Applies to a list of approved jobs sequentially, respecting the max limit.
 */
async function applyToJobs(page, approvedJobs, resumePath) {
    const { maxApplicationsPerRun } = settings.apply;
    const jobsToApply = approvedJobs.slice(0, maxApplicationsPerRun);

    if (approvedJobs.length > maxApplicationsPerRun) {
        logger.warn(
            `${approvedJobs.length} jobs approved, but limiting to ${maxApplicationsPerRun} per run.`
        );
    }

    const results = [];

    for (let i = 0; i < jobsToApply.length; i++) {
        const job = jobsToApply[i];
        logger.info(`[${i + 1}/${jobsToApply.length}] Processing application...`);

        const result = await applyToJob(page, job, resumePath);
        results.push(result);

        await randomDelay(3000, 5000);
    }

    return results;
}

module.exports = { applyToJob, applyToJobs };