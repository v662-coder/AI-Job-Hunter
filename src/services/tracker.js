const { appendJSON, readJSON } = require("../utils/fileManager");
const logger = require("../utils/logger");

const TRACKER_FILE = "data/appliedJobs.json";

/**
 * Records applied job results into the persistent tracker file,
 * avoiding duplicate entries for the same job URL.
 */
function recordApplications(results) {
    const existing = readJSON(TRACKER_FILE, []);
    const existingUrls = new Set(existing.map((j) => j.url));

    let newCount = 0;

    for (const result of results) {
        if (!existingUrls.has(result.url)) {
            appendJSON(TRACKER_FILE, result);
            existingUrls.add(result.url);
            newCount++;
        } else {
            logger.debug(`Already tracked, skipping duplicate: ${result.url}`);
        }
    }

    logger.success(`Tracked ${newCount} new application(s) in ${TRACKER_FILE}`);
}

/**
 * Checks if a job URL has already been applied to (prevents re-applying).
 */
function hasAlreadyApplied(jobUrl) {
    const existing = readJSON(TRACKER_FILE, []);
    return existing.some((j) => j.url === jobUrl && j.applyStatus === "applied");
}

module.exports = { recordApplications, hasAlreadyApplied };