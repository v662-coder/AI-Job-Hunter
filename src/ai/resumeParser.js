const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const logger = require("../utils/logger");
const { sanitizeText } = require("../utils/helpers");
const { ValidationError } = require("../utils/errorHandler");

/**
 * Extracts raw text from a resume file (.pdf or .docx).
 */
async function extractResumeText(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new ValidationError(`Resume file not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === ".pdf") {
            const buffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            return sanitizeText(result.text);
        }

        if (ext === ".docx") {
            const result = await mammoth.extractRawText({ path: filePath });
            return sanitizeText(result.value);
        }

        throw new ValidationError(`Unsupported resume format: ${ext}. Use .pdf or .docx`);
    } catch (err) {
        logger.error(`Failed to parse resume: ${err.message}`);
        throw err;
    }
}

module.exports = { extractResumeText };