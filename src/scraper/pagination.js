const logger = require("../utils/logger");
const settings = require("../config/settings");
const { randomDelay } = require("../utils/delay");
const { extractJobCards } = require("./searchJobs");

/**
 * Goes through multiple pages of a search result (up to maxPagesPerSearch)
 * and returns all job cards combined.
 */
async function scrapeWithPagination(page, baseUrl, roleLabel) {
    const { maxPagesPerSearch } = settings.scraper;
    const allJobs = [];

    for (let pageNum = 1; pageNum <= maxPagesPerSearch; pageNum++) {
        const pageUrl = pageNum === 1 ? baseUrl : `${baseUrl}&page=${pageNum}`;

        logger.info(`Fetching page ${pageNum} for "${roleLabel}"...`);
        await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
        await randomDelay(1500, 2500);

        const jobs = await extractJobCards(page);

        if (jobs.length === 0) {
            logger.warn(`No more jobs found. Stopping at page ${pageNum}.`);
            break;
        }

        allJobs.push(...jobs.map((job) => ({ ...job, role: roleLabel, page: pageNum })));
    }

    return allJobs;
}

module.exports = { scrapeWithPagination };