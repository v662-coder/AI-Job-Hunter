const fs = require("fs");
const path = require("path");
const settings = require("../config/settings");
const logger = require("../utils/logger");
const { ValidationError } = require("../utils/errorHandler");

/**
 * Lists available resumes in data/resumes/.
 * For now (single resume setup), returns the first .pdf/.docx found.
 * Future: could match resume variant to job role (e.g. frontend-resume.pdf).
 */
function getDefaultResumePath() {
    const dir = path.join(process.cwd(), settings.directories.resumes);

    if (!fs.existsSync(dir)) {
        throw new ValidationError(`Resumes directory not found: ${dir}`);
    }

    const files = fs.readdirSync(dir).filter((f) => /\.(pdf|docx)$/i.test(f));

    if (files.length === 0) {
        throw new ValidationError(
            `No resume found in ${dir}. Please add a .pdf or .docx resume.`
        );
    }

    if (files.length > 1) {
        logger.warn(`Multiple resumes found. Using: ${files[0]}`);
    }

    return path.join(dir, files[0]);
}

module.exports = { getDefaultResumePath };