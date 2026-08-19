const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const browserConfig = require("../config/browser");
const logger = require("../utils/logger");
const { BrowserError } = require("../utils/errorHandler");

let context = null;
let browser = null;

/**
 * Resolves the absolute path for the persistent session directory.
 */
function getSessionPath() {
    return path.join(process.cwd(), browserConfig.sessionDir);
}

/**
 * Launches a persistent browser context (session/cookies survive restarts).
 * If already launched, returns the existing context.
 */
async function launchBrowser() {
    if (context) {
        logger.warn("Browser already launched. Reusing existing context.");
        return context;
    }

    try {
        const sessionPath = getSessionPath();

        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
            logger.debug(`Created session directory: ${sessionPath}`);
        }

        logger.info("Launching browser...");

        context = await chromium.launchPersistentContext(sessionPath, {
            headless: browserConfig.headless,
            viewport: browserConfig.viewport,
            timeout: browserConfig.timeout
        });

        context.setDefaultTimeout(browserConfig.timeout);
        context.setDefaultNavigationTimeout(browserConfig.navigationTimeout);

        logger.success("Browser launched with persistent session.");

        context.on("close", () => {
            logger.warn("Browser context closed.");
            context = null;
        });

        return context;
    } catch (err) {
        throw new BrowserError("Failed to launch browser", { original: err.message });
    }
}

/**
 * Opens a new page/tab in the current context.
 */
async function newPage() {
    if (!context) {
        throw new BrowserError("Cannot open page: browser not launched yet.");
    }

    try {
        const page = await context.newPage();
        logger.debug("New page opened.");
        return page;
    } catch (err) {
        throw new BrowserError("Failed to open new page", { original: err.message });
    }
}

/**
 * Gets the current active page, or creates one if none exists.
 */
async function getPage() {
    if (!context) {
        throw new BrowserError("Cannot get page: browser not launched yet.");
    }

    const pages = context.pages();
    if (pages.length > 0) {
        return pages[0];
    }
    return newPage();
}

/**
 * Gracefully closes the browser context.
 */
async function closeBrowser() {
    if (!context) {
        logger.warn("Browser already closed or never launched.");
        return;
    }

    try {
        await context.close();
        context = null;
        logger.success("Browser closed gracefully.");
    } catch (err) {
        logger.error(`Error while closing browser: ${err.message}`);
    }
}

/**
 * Returns whether the browser is currently active.
 */
function isLaunched() {
    return context !== null;
}

module.exports = {
    launchBrowser,
    newPage,
    getPage,
    closeBrowser,
    isLaunched
};