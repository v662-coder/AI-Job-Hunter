const express = require("express");
const cors = require("cors");
const config = require("../src/config/config");
const logger = require("../src/utils/logger");
const { connectDB } = require("../src/config/db");
const jobsRouter = require("./routes/jobs");

async function startServer() {
    await connectDB();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/api/jobs", jobsRouter);

    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", app: config.app.name });
    });

    app.listen(config.server.port, () => {
        logger.success(`API server running on http://localhost:${config.server.port}`);
    });
}

startServer().catch((err) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
});