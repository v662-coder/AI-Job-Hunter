const path = require("path");
const settings = require("../config/settings");
const { ensureDirectory } = require("./fileManager");
const logger = require("./logger");

/**
 * Ensures all required project directories exist before the app runs.
 * Prevents runtime crashes from missing folders (logs, screenshots, data, etc.)
 */
function initializeDirectories() {
    const dirs = [
        settings.directories.logs,
        settings.directories.screenshots,
        settings.directories.resumes,
        settings.directories.data,
        settings.directories.session
    ];

    dirs.forEach((dir) => {
        const fullPath = path.join(process.cwd(), dir);
        ensureDirectory(fullPath);
    });

    logger.success("All required directories verified/created.");
}

module.exports = { initializeDirectories };