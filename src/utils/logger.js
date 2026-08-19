const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const settings = require("../config/settings");

const LOG_DIR = path.join(process.cwd(), settings.directories.logs);
const LOG_FILE = path.join(LOG_DIR, "app.log");

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

function getTimestamp() {
    return new Date().toLocaleString("en-IN", { hour12: false });
}

function writeToFile(level, message) {
    try {
        ensureLogDir();
        const line = `[${getTimestamp()}] [${level}] ${message}\n`;
        fs.appendFileSync(LOG_FILE, line);
    } catch (err) {
        console.error(chalk.red(`[LOGGER] Failed to write log file: ${err.message}`));
    }
}

class Logger {
    info(message) {
        console.log(chalk.blue(`[${getTimestamp()}] [INFO] ${message}`));
        writeToFile("INFO", message);
    }

    success(message) {
        console.log(chalk.green(`[${getTimestamp()}] [SUCCESS] ${message}`));
        writeToFile("SUCCESS", message);
    }

    warn(message) {
        console.log(chalk.yellow(`[${getTimestamp()}] [WARN] ${message}`));
        writeToFile("WARN", message);
    }

    error(message) {
        console.log(chalk.red(`[${getTimestamp()}] [ERROR] ${message}`));
        writeToFile("ERROR", message);
    }

    debug(message) {
        if (process.env.LOG_LEVEL === "debug") {
            console.log(chalk.magenta(`[${getTimestamp()}] [DEBUG] ${message}`));
        }
        writeToFile("DEBUG", message);
    }
}

module.exports = new Logger();