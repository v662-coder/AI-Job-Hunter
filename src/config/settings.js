const settings = Object.freeze({
    app: {
        name: "AI Job Hunter",
        version: "1.0.0"
    },

    scraper: {
        maxRetries: 3,

        // Delay between requests
        requestDelay: 2000,

        // Delay between pages
        pageDelay: 1500,

        // Increased so we can collect up to 100 jobs
        maxPagesPerSearch: 10,

        // Maximum jobs to collect across searches
        maxJobsPerRun: 100,

        // Avoid duplicate jobs
        deduplicateBy: "jobUrl"
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

    /*
    |--------------------------------------------------------------------------
    | PORTAL CONFIGURATION
    |--------------------------------------------------------------------------
    */

    portals: {
        naukri: {
            baseUrl: "https://www.naukri.com",
            loginUrl: "https://www.naukri.com/nlogin/login",

            homeIndicator: "a[href*='mnjuser/profile']",

            searchPath: "/jobs?k={query}&l={location}",

            jobListSelector: ".jobTuple",

            jobCardSelectors: {
                title: ".title a",
                company: ".subTitle .companyName",
                experience: ".exp",
                location: ".location"
            },

            nextPageSelector: ".pagination .next",

            applyButtonSelectors: [
                "#apply-button",
                ".styles_apply-button__uUuHl",
                "button[class*='apply']"
            ],

            easyApplyIndicator: "Apply"
        },

        linkedin: {
            baseUrl: "https://www.linkedin.com",
            loginUrl: "https://www.linkedin.com/login",

            homeIndicator: ".global-nav__me-photo",

            searchPath:
                "/jobs/search/?keywords={query}&location={location}&f_TPR=r604800",

            jobListSelector: ".jobs-search__results-list li",

            jobCardSelectors: {
                title: ".job-title",
                company: ".company-name",
                location: ".job-location"
            },

            nextPageSelector:
                ".jobs-search-pagination__next-button",

            applyButtonSelectors: [
                ".jobs-apply-button",
                "button[data-control-name='apply']"
            ],

            easyApplyIndicator:
                ".jobs-apply-button--easy-apply"
        },

        indeed: {
            baseUrl: "https://www.indeed.com",
            loginUrl: "https://www.indeed.com/account/login",

            homeIndicator: "#userOptions",

            searchPath:
                "/jobs?q={query}&l={location}&fromage=7",

            jobListSelector:
                "#mosaic-jobResults li",

            jobCardSelectors: {
                title: ".jobTitle",
                company: ".companyName",
                location: ".companyLocation"
            },

            nextPageSelector:
                "a[data-testid='pagination-page-next']",

            applyButtonSelectors: [
                ".indeed-apply-button",
                "button[data-testid='apply-button']"
            ],

            easyApplyIndicator:
                "Easy Apply"
        },

        hirist: {
            baseUrl: "https://www.hirist.com",
            loginUrl: "https://www.hirist.com/login",

            homeIndicator: ".user-profile",

            searchPath:
                "/jobs?q={query}&loc={location}",

            jobListSelector:
                ".job-listing-item",

            jobCardSelectors: {
                title: ".job-title a",
                company: ".company-name",
                experience: ".experience",
                location: ".location"
            },

            nextPageSelector:
                ".pagination-next",

            applyButtonSelectors: [
                ".apply-btn",
                "button[class*='apply']"
            ],

            easyApplyIndicator:
                "Apply Now"
        },

        cutshort: {
            baseUrl: "https://www.cutshort.io",
            loginUrl: "https://www.cutshort.io/login",

            homeIndicator: ".profile-menu",

            searchPath:
                "/jobs?q={query}&location={location}",

            jobListSelector:
                ".job-list-item",

            jobCardSelectors: {
                title: ".job-title",
                company: ".company-name",
                experience: ".exp-text",
                location: ".location-text"
            },

            nextPageSelector:
                ".next-page",

            applyButtonSelectors: [
                ".apply-button",
                "button[class*='apply']"
            ],

            easyApplyIndicator:
                "Easy Apply"
        },

        wellfound: {
            baseUrl: "https://wellfound.com",
            loginUrl: "https://wellfound.com/login",

            homeIndicator: ".user-avatar",

            searchPath:
                "/jobs?query={query}&location={location}",

            jobListSelector:
                ".job-card",

            jobCardSelectors: {
                title: ".job-title a",
                company: ".company-name",
                location: ".location",
                experience: ".experience"
            },

            nextPageSelector:
                ".next-button",

            applyButtonSelectors: [
                ".apply-btn",
                "a[class*='apply']"
            ],

            easyApplyIndicator:
                "Apply"
        }
    },

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    auth: {
        loginTimeoutMs: 120000,
        loginCheckIntervalMs: 3000
    },

    /*
    |--------------------------------------------------------------------------
    | REVIEW
    |--------------------------------------------------------------------------
    */

    review: {
        // Only show jobs above this matching score
        minScoreToShow: 50,

        // Increased from 20 → 100
        maxJobsToReview: 100,

        // Don't show duplicate jobs
        removeDuplicates: true
    },

    /*
    |--------------------------------------------------------------------------
    | APPLY
    |--------------------------------------------------------------------------
    */

    apply: {
        // Increased from 35 → 100
        maxApplicationsPerRun: 100,

        /*
        |--------------------------------------------------------------------------
        | Only jobs that can be applied directly through supported portal
        |--------------------------------------------------------------------------
        */

        allowExternalCareerSite: false,

        skipExternalCareerSite: true,

        applyButtonSelectors: [
            "#apply-button",
            ".styles_apply-button__uUuHl",
            "button[class*='apply']",
            ".jobs-apply-button",
            ".indeed-apply-button",
            ".apply-btn",
            ".apply-button"
        ],

        easyApplyIndicatorText: "Apply",

        /*
        |--------------------------------------------------------------------------
        | External application indicators
        |--------------------------------------------------------------------------
        */

        externalApplicationIndicators: [
            "apply on company website",
            "apply on employer website",
            "apply externally",
            "external application",
            "company website",
            "career site",
            "careers page",
            "redirecting to",
            "visit company website"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | JOB SEARCH
    |--------------------------------------------------------------------------
    */

    jobSearch: {

        /*
        |--------------------------------------------------------------------------
        | India
        |--------------------------------------------------------------------------
        */

        country: "India",

        /*
        |--------------------------------------------------------------------------
        | Major + emerging Indian IT locations
        |--------------------------------------------------------------------------
        */

        locations: [
            "Bangalore",
            "Bengaluru",
            "Hyderabad",
            "Pune",
            "Mumbai",
            "Navi Mumbai",
            "Thane",
            "Chennai",
            "Delhi",
            "New Delhi",
            "Noida",
            "Greater Noida",
            "Gurgaon",
            "Gurugram",
            "Ghaziabad",
            "Faridabad",
            "Kolkata",
            "Ahmedabad",
            "Gandhinagar",
            "Jaipur",
            "Indore",
            "Chandigarh",
            "Mohali",
            "Panchkula",
            "Lucknow",
            "Kochi",
            "Thiruvananthapuram",
            "Coimbatore",
            "Mysore",
            "Mysuru",
            "Nagpur",
            "Bhubaneswar",
            "Bhubaneshwar",
            "Vadodara",
            "Surat",
            "Nashik",
            "Visakhapatnam",
            "Vishakhapatnam",
            "Vijayawada",
            "Patna",
            "Ranchi",
            "Bhopal",
            "Raipur",
            "Dehradun",
            "Udaipur",
            "Kanpur",
            "Varanasi",
            "Agra",
            "Jodhpur",
            "Madurai",
            "Trichy",
            "Tiruchirappalli",
            "Salem",
            "Mangalore",
            "Mangaluru",
            "Goa",
            "Remote"
        ],

        /*
        |--------------------------------------------------------------------------
        | Experience
        |--------------------------------------------------------------------------
        */

        searchExperience: 0,

        maxAcceptableExperience: 3,

        /*
        |--------------------------------------------------------------------------
        | Posted within last 7 days
        |--------------------------------------------------------------------------
        */

        postedWithinDays: 7,

        /*
        |--------------------------------------------------------------------------
        | Maximum jobs
        |--------------------------------------------------------------------------
        */

        maxJobsPerRun: 100,

        /*
        |--------------------------------------------------------------------------
        | Job roles
        |--------------------------------------------------------------------------
        */

        roles: [

            // JavaScript
            {
                key: "javascript-developer",
                label: "JavaScript Developer"
            },

            {
                key: "javascript-engineer",
                label: "JavaScript Engineer"
            },

            // React
            {
                key: "react-developer",
                label: "React Developer"
            },

            {
                key: "react-js-developer",
                label: "React JS Developer"
            },

            {
                key: "react-engineer",
                label: "React Engineer"
            },

            // Node
            {
                key: "node-js-developer",
                label: "Node.js Developer"
            },

            {
                key: "node-developer",
                label: "Node Developer"
            },

            {
                key: "node-js-engineer",
                label: "Node.js Engineer"
            },

            // MERN
            {
                key: "mern-developer",
                label: "MERN Developer"
            },

            {
                key: "mern-stack-developer",
                label: "MERN Stack Developer"
            },

            {
                key: "mern-full-stack-developer",
                label: "MERN Full Stack Developer"
            },

            {
                key: "mern-engineer",
                label: "MERN Engineer"
            },

            // Frontend
            {
                key: "frontend-developer",
                label: "Frontend Developer"
            },

            {
                key: "front-end-developer",
                label: "Front End Developer"
            },

            {
                key: "frontend-engineer",
                label: "Frontend Engineer"
            },

            // Backend
            {
                key: "backend-developer",
                label: "Backend Developer"
            },

            {
                key: "back-end-developer",
                label: "Backend Developer"
            },

            {
                key: "backend-engineer",
                label: "Backend Engineer"
            },

            // Full Stack
            {
                key: "full-stack-developer",
                label: "Full Stack Developer"
            },

            {
                key: "fullstack-developer",
                label: "Full Stack Developer"
            },

            {
                key: "full-stack-engineer",
                label: "Full Stack Engineer"
            },

            // Software
            {
                key: "software-developer",
                label: "Software Developer"
            },

            {
                key: "software-engineer",
                label: "Software Engineer"
            },

            // Web
            {
                key: "web-developer",
                label: "Web Developer"
            },

            {
                key: "web-engineer",
                label: "Web Engineer"
            },

            // Additional JS ecosystem
            {
                key: "frontend-full-stack-developer",
                label: "Frontend Full Stack Developer"
            },

            {
                key: "javascript-full-stack-developer",
                label: "JavaScript Full Stack Developer"
            },

            {
                key: "react-node-developer",
                label: "React Node Developer"
            }
        ],

        /*
        |--------------------------------------------------------------------------
        | Search keyword groups
        |--------------------------------------------------------------------------
        |
        | These are broader keywords so that jobs don't get missed because
        | of slightly different job titles.
        |--------------------------------------------------------------------------
        */

        keywordGroups: [
            [
                "JavaScript",
                "React",
                "Node.js",
                "MERN"
            ],

            [
                "React",
                "Frontend",
                "Front End"
            ],

            [
                "Node.js",
                "Backend",
                "Back End"
            ],

            [
                "MERN",
                "Full Stack",
                "Fullstack"
            ],

            [
                "JavaScript",
                "Web Developer",
                "Software Engineer"
            ]
        ],

        /*
        |--------------------------------------------------------------------------
        | Remote jobs
        |--------------------------------------------------------------------------
        */

        includeRemote: true,

        /*
        |--------------------------------------------------------------------------
        | Job filtering
        |--------------------------------------------------------------------------
        */

        filters: {

            // Ignore internships
            excludeInternships: true,

            // Ignore jobs requiring more than 3 years
            excludeAboveMaxExperience: true,

            // Prefer relevant technologies
            preferredSkills: [
                "JavaScript",
                "React",
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "MySQL",
                "MERN",
                "REST API",
                "HTML",
                "CSS"
            ],

            /*
            |--------------------------------------------------------------------------
            | Jobs that should NOT be automatically considered
            |--------------------------------------------------------------------------
            */

            excludedTitles: [
                "Senior Software Engineer",
                "Senior Frontend Developer",
                "Senior Backend Developer",
                "Lead Developer",
                "Tech Lead",
                "Engineering Manager",
                "Architect",
                "Principal Engineer",
                "Director",
                "VP",
                "Manager"
            ]
        }
    },

    /*
    |--------------------------------------------------------------------------
    | MATCHING / SCORING
    |--------------------------------------------------------------------------
    */

    matching: {

        enabled: true,

        /*
        | Higher score = better match
        */

        weights: {
            title: 35,
            skills: 30,
            experience: 20,
            location: 10,
            recency: 5
        },

        preferredTitleKeywords: [
            "javascript",
            "react",
            "react.js",
            "node",
            "node.js",
            "mern",
            "frontend",
            "front end",
            "backend",
            "back end",
            "full stack",
            "fullstack",
            "software engineer",
            "software developer",
            "web developer",
            "web engineer"
        ],

        preferredSkillKeywords: [
            "javascript",
            "typescript",
            "react",
            "react.js",
            "node",
            "node.js",
            "express",
            "express.js",
            "mern",
            "mongodb",
            "mysql",
            "rest api",
            "html",
            "css"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | EXTERNAL CAREER WEBSITE HANDLING
    |--------------------------------------------------------------------------
    */

    externalApplication: {

        enabled: true,

        /*
        | If application redirects to company career site,
        | don't continue application.
        */

        skipCompanyCareerSite: true,

        skipExternalApply: true,

        indicators: [
            "company website",
            "company career",
            "career site",
            "careers",
            "apply externally",
            "external application",
            "employer website",
            "apply on company website",
            "apply on employer website",
            "redirect"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | SAFETY / LIMITS
    |--------------------------------------------------------------------------
    */

    safety: {

        /*
        | Never blindly submit jobs that require an external website.
        */

        requirePortalApplication: true,

        /*
        | Keep human approval before final application.
        */

        requireApprovalBeforeApply: true,

        /*
        | Maximum applications in one execution.
        */

        maxApplicationsPerRun: 100
    }
});

module.exports = settings;