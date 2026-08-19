const config = require("./config");

const browserConfig = Object.freeze({
    headless: config.browser.headless,

    timeout: config.browser.defaultTimeout,

    navigationTimeout:
        config.browser.navigationTimeout,

    sessionDir: config.browser.sessionDir,

    viewport: {
        width: 1440,
        height: 900
    }
});

module.exports = browserConfig;