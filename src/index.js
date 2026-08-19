const config = require("./config/config");
const logger = require("./utils/logger");
const { initializeDirectories } = require("./utils/directoryInitializer");
const { validateEnvironment } = require("./utils/envValidator");
const { connectDB, disconnectDB } = require("./config/db");
const { launchBrowser, getPage, closeBrowser } = require("./services/browserManager");
const { ensureNaukriLogin } = require("./auth/session");
const { searchAllRoles } = require("./scraper/searchJobs");
const { extractResumeText } = require("./ai/resumeParser");
const { getDefaultResumePath } = require("./ai/resumeSelector");
const { matchResumeToJob } = require("./ai/matcher");
const { applyToJobs } = require("./apply/submit");
const {
    saveScrapedJobs,
    saveMatchResult,
    getUnmatchedJobs,
    getApprovedJobs,
    updateApplyResult
} = require("./services/jobRepository");
const { getFriendlyMessage } = require("./utils/errorHandler");

async function bootstrap() {
    console.clear();
    logger.info(`${config.app.name} v${config.app.version} starting...`);

    try {
        validateEnvironment();
        initializeDirectories();
        await connectDB();

        const resumePath = getDefaultResumePath();
        const resumeText = await extractResumeText(resumePath);
        logger.success(`Resume parsed (${resumeText.length} characters).`);

        await launchBrowser();
        const page = await getPage();
        await ensureNaukriLogin(page);

        // Step 1: Scrape and save new jobs
        const scrapedJobs = await searchAllRoles(page);
        await saveScrapedJobs(scrapedJobs);

        // Step 2: AI Match any unmatched jobs in DB
        const unmatched = await getUnmatchedJobs();
        logger.info(`Matching ${unmatched.length} unmatched job(s)...`);

        for (let i = 0; i < unmatched.length; i++) {
            const job = unmatched[i];
            try {
                const match = await matchResumeToJob(resumeText, job);
                await saveMatchResult(job.url, match);
                logger.success(`[${i + 1}/${unmatched.length}] ${job.title} — ${match.matchScore}/100`);
            } catch (err) {
                logger.warn(`Match failed for "${job.title}": ${err.message}`);
            }
        }

        // Step 3: Apply to jobs approved via dashboard (or previously via CLI)
        const approvedJobs = await getApprovedJobs();

        if (approvedJobs.length === 0) {
            logger.info("No approved jobs pending application. Check the dashboard to approve some.");
        } else {
            logger.info(`Applying to ${approvedJobs.length} approved job(s)...`);
            const results = await applyToJobs(page, approvedJobs, resumePath);

            for (const result of results) {
                await updateApplyResult(result.url, result);
            }

            const successCount = results.filter((r) => r.applyStatus === "applied").length;
            logger.success(`${successCount}/${results.length} application(s) submitted.`);
        }

        logger.success("✅ PHASE 6 PIPELINE RUN COMPLETE.");

        await closeBrowser();
        await disconnectDB();

    } catch (err) {
        logger.error(getFriendlyMessage(err));
        process.exit(1);
    }
}

bootstrap();