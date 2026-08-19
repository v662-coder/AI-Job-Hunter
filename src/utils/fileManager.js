const fs = require("fs");
const path = require("path");
const logger = require("./logger");

/**
 * Ensures a directory exists, creating it (and parents) if needed.
 */
function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.debug(`Created directory: ${dirPath}`);
    }
}

/**
 * Checks if a file exists.
 */
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * Reads and parses a JSON file. Returns fallback if file doesn't exist or is invalid.
 */
function readJSON(filePath, fallback = {}) {
    try {
        if (!fileExists(filePath)) return fallback;
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        logger.error(`Failed to read JSON (${filePath}): ${err.message}`);
        return fallback;
    }
}

/**
 * Writes an object to a JSON file (pretty-printed).
 */
function writeJSON(filePath, data) {
    try {
        ensureDirectory(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
        return true;
    } catch (err) {
        logger.error(`Failed to write JSON (${filePath}): ${err.message}`);
        return false;
    }
}

/**
 * Appends an item to a JSON array file. Creates the file if it doesn't exist.
 */
function appendJSON(filePath, item) {
    const data = readJSON(filePath, []);
    if (!Array.isArray(data)) {
        logger.error(`Cannot append: ${filePath} does not contain an array`);
        return false;
    }
    data.push(item);
    return writeJSON(filePath, data);
}

/**
 * Reads a plain text file.
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (err) {
        logger.error(`Failed to read file (${filePath}): ${err.message}`);
        return null;
    }
}

/**
 * Writes plain text to a file.
 */
function writeFile(filePath, content) {
    try {
        ensureDirectory(path.dirname(filePath));
        fs.writeFileSync(filePath, content, "utf-8");
        return true;
    } catch (err) {
        logger.error(`Failed to write file (${filePath}): ${err.message}`);
        return false;
    }
}

module.exports = {
    ensureDirectory,
    fileExists,
    readJSON,
    writeJSON,
    appendJSON,
    readFile,
    writeFile
};