const logger = require("./logger");

/**
 * Retries an async function up to `retries` times with delay between attempts.
 */
async function retry(fn, retries = 3, delayMs = 2000) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            logger.warn(`Attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
    }
    throw lastError;
}

/**
 * Formats a Date object into a readable string (used in filenames, logs, reports).
 */
function formatDate(date = new Date()) {
    return date.toISOString().replace(/[:.]/g, "-");
}

/**
 * Generates a short unique ID (used for job entries, screenshot names, etc.)
 */
function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Removes extra whitespace, newlines from scraped text.
 */
function sanitizeText(text) {
    if (typeof text !== "string") return "";
    return text.replace(/\s+/g, " ").trim();
}

/**
 * Checks if a value is empty (null, undefined, empty string/array/object).
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

module.exports = {
    retry,
    formatDate,
    generateId,
    sanitizeText,
    isEmpty
};