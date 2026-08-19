const logger = require("../utils/logger");
const { ScraperError } = require("../utils/errorHandler");

/**
 * Uploads the resume file if the application form has a file input.
 * Naukri sometimes uses the profile's existing resume automatically,
 * so this is a best-effort fallback.
 */
async function uploadResumeIfNeeded(page, resumePath) {
    try {
        const fileInput = await page.$("input[type='file']");

        if (!fileInput) {
            logger.debug("No file upload input found (likely using profile resume).");
            return false;
        }

        await fileInput.setInputFiles(resumePath);
        logger.success("Resume uploaded via file input.");
        return true;
    } catch (err) {
        throw new ScraperError("Failed to upload resume", { original: err.message });
    }
}

module.exports = { uploadResumeIfNeeded };