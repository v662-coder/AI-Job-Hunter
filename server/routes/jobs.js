const express = require("express");
const Job = require("../../src/models/Job");
const logger = require("../../src/utils/logger");

const router = express.Router();

// GET /api/jobs — list jobs with optional filters
router.get("/", async (req, res) => {
    try {
        const { status, minScore, role } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (role) filter.role = role;
        if (minScore) filter.matchScore = { $gte: Number(minScore) };

        const jobs = await Job.find(filter).sort({ matchScore: -1 }).lean();
        res.json({ count: jobs.length, jobs });
    } catch (err) {
        logger.error(`GET /jobs failed: ${err.message}`);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// GET /api/jobs/stats — dashboard summary numbers
router.get("/stats", async (req, res) => {
    try {
        const [total, matched, approved, applied, failed] = await Promise.all([
            Job.countDocuments({}),
            Job.countDocuments({ status: "matched" }),
            Job.countDocuments({ status: "approved" }),
            Job.countDocuments({ status: "applied" }),
            Job.countDocuments({ status: "failed" })
        ]);

        res.json({ total, matched, approved, applied, failed });
    } catch (err) {
        logger.error(`GET /jobs/stats failed: ${err.message}`);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// PATCH /api/jobs/:id/approve
router.patch("/:id/approve", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        if (!job) return res.status(404).json({ error: "Job not found" });
        res.json({ job });
    } catch (err) {
        logger.error(`PATCH approve failed: ${err.message}`);
        res.status(500).json({ error: "Failed to approve job" });
    }
});

// PATCH /api/jobs/:id/skip
router.patch("/:id/skip", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: "skipped" },
            { new: true }
        );
        if (!job) return res.status(404).json({ error: "Job not found" });
        res.json({ job });
    } catch (err) {
        logger.error(`PATCH skip failed: ${err.message}`);
        res.status(500).json({ error: "Failed to skip job" });
    }
});

module.exports = router;