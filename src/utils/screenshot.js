const path = require("path");
const settings = require("../config/settings");
const { ensureDirectory } = require("./fileManager");
const { generateId } = require("./helpers");
const logger = require("./logger");

/**
 * Captures a screenshot of the given page and saves it under /screenshots.
 * Returns the saved file path.
 */
async function captureScreenshot(page, label = "screenshot") {
    try {
        const dir = path.join(process.cwd(), settings.directories.screenshots);
        ensureDirectory(dir);

        const fileName = `${label}_${generateId()}.png`;
        const filePath = path.join(dir, fileName);

        await page.screenshot({ path: filePath, fullPage: true });
        logger.debug(`Screenshot saved: ${filePath}`);

        return filePath;
    } catch (err) {
        logger.error(`Failed to capture screenshot: ${err.message}`);
        return null;
    }
}

module.exports = { captureScreenshot };