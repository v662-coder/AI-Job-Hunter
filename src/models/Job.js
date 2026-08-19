const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        company: { type: String, default: "" },
        location: { type: String, default: "" },
        experience: { type: String, default: "" },
        description: { type: String, default: "" },
        url: { type: String, required: true, unique: true },
        role: { type: String, default: "" },

        // AI matching fields
        matchScore: { type: Number, default: 0 },
        matchedSkills: { type: [String], default: [] },
        missingSkills: { type: [String], default: [] },
        summary: { type: String, default: "" },

        // Workflow status
        status: {
            type: String,
            enum: ["scraped", "matched", "approved", "skipped", "applied", "failed"],
            default: "scraped"
        },

        appliedAt: { type: Date, default: null },
        applyError: { type: String, default: "" }
    },
    { timestamps: true } // adds createdAt, updatedAt automatically
);

// Avoids "OverwriteModelError" during hot-reloads / multiple requires
module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);