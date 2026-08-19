const logger = require("../utils/logger");
const settings = require("../config/settings");
const { BrowserError } = require("../utils/errorHandler");
const { captureScreenshot } = require("../utils/screenshot");

/**
 * Checks whether the user is currently logged in to Naukri
 * by looking for an element that only exists in the logged-in state.
 */
async function isLoggedIn(page) {
    try {
        const indicator = settings.portals.naukri.homeIndicator;
        const element = await page.$(indicator);
        return element !== null;
    } catch (err) {
        return false;
    }
}

/**
 * Ensures the user is logged in to Naukri.
 * - If already logged in (from persistent session), continues immediately.
 * - If not, opens the login page and waits for the user to log in manually.
 * Throws BrowserError if login isn't completed within the timeout.
 */
async function ensureNaukriLogin(page) {
    const { baseUrl, loginUrl } = settings.portals.naukri;
    const { loginTimeoutMs, loginCheckIntervalMs } = settings.auth;

    logger.info("Checking Naukri login status...");
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    const alreadyLoggedIn = await isLoggedIn(page);

    if (alreadyLoggedIn) {
        logger.success("Already logged in (session restored).");
        return true;
    }

    logger.warn("Not logged in. Opening login page for manual login...");
    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

    logger.info(
        `Please log in manually in the opened browser window. Waiting up to ${
            loginTimeoutMs / 1000
        }s...`
    );

    const startTime = Date.now();

    while (Date.now() - startTime < loginTimeoutMs) {
        const loggedIn = await isLoggedIn(page);

        if (loggedIn) {
            logger.success("Login detected. Session will be reused next time.");
            return true;
        }

        await new Promise((resolve) => setTimeout(resolve, loginCheckIntervalMs));
    }

    await captureScreenshot(page, "login-timeout");
    throw new BrowserError(
        "Login was not completed within the allowed time.",
        { timeoutMs: loginTimeoutMs }
    );
}

module.exports = { isLoggedIn, ensureNaukriLogin };