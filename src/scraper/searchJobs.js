const logger = require("../utils/logger");
const settings = require("../config/settings");
const { sanitizeText } = require("../utils/helpers");
const { randomDelay } = require("../utils/delay");
const { ScraperError } = require("../utils/errorHandler");
const { captureScreenshot } = require("../utils/screenshot");

/**
 * Builds the Naukri search URL for a given role.
 * Searches broadly from freshers (experience=0) and filters by posting recency.
 */
function buildSearchUrl(roleKey) {
    const { location, searchExperience, postedWithinDays } = settings.jobSearch;
    const base = settings.portals.naukri.baseUrl;

    const params = new URLSearchParams({
        experience: searchExperience,
        days: postedWithinDays
    });

    return `${base}/${roleKey}-jobs-in-${location.toLowerCase()}?${params.toString()}`;
}

/**
 * Parses a Naukri experience string like "2-6 Yrs", "0-3 Yrs", "5 Yrs"
 * and returns { min, max } as numbers. Returns null if unparseable.
 */
function parseExperienceRange(text) {
    if (!text) return null;

    const match = text.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
        return { min: Number(match[1]), max: Number(match[2]) };
    }

    const single = text.match(/(\d+)\s*Yrs?/i);
    if (single) {
        const val = Number(single[1]);
        return { min: val, max: val };
    }

    return null;
}

/**
 * Keeps only jobs whose minimum required experience is within
 * the acceptable threshold (e.g. min <= 3), so ranges like
 * "0-3", "2-3", "2-4", "2-5", "2-6" all qualify, but "5-8" does not.
 */
function filterByExperience(jobs) {
    const { maxAcceptableExperience } = settings.jobSearch;

    return jobs.filter((job) => {
        const range = parseExperienceRange(job.experience);
        if (!range) return true; // keep if we can't parse, avoid over-filtering
        return range.min <= maxAcceptableExperience;
    });
}

async function extractJobCards(page) {
    try {
        await page.waitForSelector(".srp-jobtuple-wrapper", { timeout: 15000 });
    } catch {
        logger.warn("No job cards found on this page (selector timeout).");
        return [];
    }

    const jobs = await page.$$eval(".srp-jobtuple-wrapper", (cards) => {
        return cards.map((card) => {
            const titleEl = card.querySelector("a.title");
            const companyEl = card.querySelector("a.comp-name");
            const expEl = card.querySelector(".exp-wrap .expwdth");
            const locEl = card.querySelector(".loc-wrap .locWdth");
            const descEl = card.querySelector(".job-desc");

            return {
                title: titleEl ? titleEl.innerText : "",
                url: titleEl ? titleEl.href : "",
                company: companyEl ? companyEl.innerText : "",
                experience: expEl ? expEl.innerText : "",
                location: locEl ? locEl.innerText : "",
                description: descEl ? descEl.innerText : ""
            };
        });
    });

    return jobs
        .filter((job) => job.url)
        .map((job) => ({
            title: sanitizeText(job.title),
            url: job.url,
            company: sanitizeText(job.company),
            experience: sanitizeText(job.experience),
            location: sanitizeText(job.location),
            description: sanitizeText(job.description)
        }));
}

async function searchRole(page, role) {
    const url = buildSearchUrl(role.key);
    logger.info(`Searching: ${role.label} → ${url}`);

    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await randomDelay(1500, 2500);

        const jobs = await extractJobCards(page);
        const filtered = filterByExperience(jobs);

        logger.success(
            `Found ${jobs.length} job(s), ${filtered.length} within experience range for "${role.label}"`
        );

        return filtered.map((job) => ({ ...job, role: role.label }));
    } catch (err) {
        await captureScreenshot(page, `search-error-${role.key}`);
        throw new ScraperError(`Failed to search role "${role.label}"`, {
            original: err.message
        });
    }
}

async function searchAllRoles(page) {
    const { roles } = settings.jobSearch;
    const allJobs = [];

    for (const role of roles) {
        try {
            const jobs = await searchRole(page, role);
            allJobs.push(...jobs);
        } catch (err) {
            logger.error(`Skipping role "${role.label}": ${err.message}`);
        }

        await randomDelay(2000, 3500);
    }

    logger.success(`Total jobs collected across all roles: ${allJobs.length}`);
    return allJobs;
}

module.exports = {
    buildSearchUrl,
    extractJobCards,
    searchRole,
    searchAllRoles,
    parseExperienceRange,
    filterByExperience
};