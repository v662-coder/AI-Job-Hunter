const logger = require("../utils/logger");

/**
 * Handles Naukri's post-apply chatbot/questionnaire popups if they appear
 * (common for "screening questions"). This is a best-effort generic handler —
 * complex custom questions will need manual completion.
 */
async function handleScreeningQuestions(page) {
    try {
        const chatbotPopup = await page.$(".chatbot_DrawerContentWrapper");

        if (!chatbotPopup) {
            logger.debug("No screening questions popup detected.");
            return;
        }

        logger.warn(
            "Screening questions popup detected. Please answer manually in the browser window."
        );

        // Wait for the user to manually close/complete the popup
        await page.waitForSelector(".chatbot_DrawerContentWrapper", {
            state: "detached",
            timeout: 90000
        }).catch(() => {
            logger.warn("Screening popup still open after timeout. Continuing anyway.");
        });

    } catch (err) {
        logger.warn(`Screening question handling skipped: ${err.message}`);
    }
}

module.exports = { handleScreeningQuestions };