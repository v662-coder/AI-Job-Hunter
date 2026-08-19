const logger = require("./logger");
const { ValidationError } = require("./errorHandler");

function validateEnvironment() {
    const required = ["GROQ_API_KEY", "MONGODB_URI"];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new ValidationError(
            `Missing required environment variables: ${missing.join(", ")}`,
            { missing }
        );
    }

    logger.success("Environment validation passed.");
}

module.exports = { validateEnvironment };