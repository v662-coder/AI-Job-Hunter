const settings = Object.freeze({
    app: {
        name: "AI Job Hunter",
        version: "1.0.0"
    },

    scraper: {
        maxRetries: 3,
        requestDelay: 2000,
        pageDelay: 1500,
        maxPagesPerSearch: 3
    },

    browser: {
        defaultTimeout: 30000,
        navigationTimeout: 60000
    },

    directories: {
        logs: "logs",
        screenshots: "screenshots",
        resumes: "data/resumes",
        data: "data",
        session: "playwright-session"
    },

    supportedPortals: [
        "naukri",
        "linkedin",
        "indeed",
        "hirist",
        "cutshort",
        "wellfound"
    ],

    portals: {
        naukri: {
            baseUrl: "https://www.naukri.com",
            loginUrl: "https://www.naukri.com/nlogin/login",
            homeIndicator: "a[href*='mnjuser/profile']"
        }
    },

    auth: {
        loginTimeoutMs: 120000,
        loginCheckIntervalMs: 3000
    },
    review: {
        minScoreToShow: 50,
        maxJobsToReview: 20
    },

    apply: {
        maxApplicationsPerRun: 15,
        applyButtonSelectors: [
            "#apply-button",
            ".styles_apply-button__uUuHl",
            "button[class*='apply']"
        ],
        easyApplyIndicatorText: "Apply"
    },
    // ⭐ New: Job search configuration
    jobSearch: {
        location: "India",
        searchExperience: 0,   // search broadly from freshers upward
        maxAcceptableExperience: 3,  // keep jobs whose minimum required exp is <= 3
        postedWithinDays: 1,
        roles: [
            { key: "software-engineer", label: "Software Engineer" },
            { key: "frontend-developer", label: "Frontend Developer" },
            { key: "react-js-developer", label: "React JS Developer" },
            { key: "mern-full-stack-developer", label: "MERN Full Stack Developer" },
            { key: "backend-developer", label: "Backend Developer" }
        ]
    }
});

module.exports = settings;