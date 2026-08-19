const logger = require("./logger");

class ApplicationError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = "ApplicationError";
        this.details = details;
    }
}

class ValidationError extends ApplicationError {
    constructor(message, details = {}) {
        super(message, details);
        this.name = "ValidationError";
    }
}

class BrowserError extends ApplicationError {
    constructor(message, details = {}) {
        super(message, details);
        this.name = "BrowserError";
    }
}

class ScraperError extends ApplicationError {
    constructor(message, details = {}) {
        super(message, details);
        this.name = "ScraperError";
    }
}

/**
 * Wraps an async function so errors are logged consistently
 * instead of crashing silently or with an ugly stack trace.
 */
function asyncWrapper(fn, context = "Unknown") {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (err) {
            logger.error(`[${context}] ${err.name || "Error"}: ${err.message}`);
            if (err.details && Object.keys(err.details).length) {
                logger.debug(`[${context}] Details: ${JSON.stringify(err.details)}`);
            }
            throw err;
        }
    };
}

/**
 * Converts any error into a friendly, user-facing message.
 */
function getFriendlyMessage(err) {
    if (err instanceof ValidationError) return `Invalid input: ${err.message}`;
    if (err instanceof BrowserError) return `Browser issue: ${err.message}`;
    if (err instanceof ScraperError) return `Scraping failed: ${err.message}`;
    return `Something went wrong: ${err.message}`;
}

module.exports = {
    ApplicationError,
    ValidationError,
    BrowserError,
    ScraperError,
    asyncWrapper,
    getFriendlyMessage
};