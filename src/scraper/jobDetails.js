const logger = require("../utils/logger");
const { sanitizeText } = require("../utils/helpers");
const { randomDelay } = require("../utils/delay");
const { ScraperError } = require("../utils/errorHandler");

/**
 * Visits a single job's page and extracts full details
 * (full description, skills, posted date, etc.)
 */
async function getJobDetails(page, jobUrl) {
    try {
        await page.goto(jobUrl, { waitUntil: "domcontentloaded" });
        await randomDelay(1000, 2000);

        const details = await page.evaluate(() => {
            const descEl = document.querySelector(".styles_JDC__dang-inner-html__h0K4t");
            const skillsEls = document.querySelectorAll(".styles_chip__7YCfG span");
            const postedEl = document.querySelector(".styles_jhc__stat__PgY67");

            return {
                fullDescription: descEl ? descEl.innerText : "",
                skills: Array.from(skillsEls).map((el) => el.innerText),
                postedInfo: postedEl ? postedEl.innerText : ""
            };
        });

        return {
            fullDescription: sanitizeText(details.fullDescription),
            skills: details.skills.map(sanitizeText),
            postedInfo: sanitizeText(details.postedInfo)
        };
    } catch (err) {
        throw new ScraperError(`Failed to fetch job details for ${jobUrl}`, {
            original: err.message
        });
    }
}

module.exports = { getJobDetails };