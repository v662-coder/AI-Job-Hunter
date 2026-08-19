require("dotenv").config();

const settings = require("./settings");

const config = Object.freeze({
    app: {
        ...settings.app,
        environment: process.env.NODE_ENV || "development"
    },

    browser: {
        ...settings.browser,
        headless: process.env.HEADLESS === "true",
        sessionDir:
            process.env.SESSION_DIR ||
            settings.directories.session
    },

    ai: {
        apiKey: process.env.GROQ_API_KEY || "",
        model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
        baseURL: "https://api.groq.com/openai/v1"
    },

    db: {
        uri: process.env.MONGODB_URI || ""
    },

    server: {
        port: process.env.PORT || 5000
    },

    logging: {
        level: process.env.LOG_LEVEL || "info"
    },

    scraper: {
        ...settings.scraper
    },

    directories: settings.directories,

    supportedPortals: settings.supportedPortals
});

module.exports = config;