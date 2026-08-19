import { useEffect, useState, useCallback } from "react";
import { getJobs, getStats, approveJob, skipJob } from "./api";
import "./App.css";

function scoreClass(score) {
    if (score >= 75) return "high";
    if (score >= 50) return "mid";
    return "low";
}

const TABS = ["matched", "approved", "applied", "failed", "skipped"];

function App() {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [statusFilter, setStatusFilter] = useState("matched");
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [jobsRes, statsRes] = await Promise.all([
                getJobs({ status: statusFilter, minScore: 0 }),
                getStats()
            ]);
            setJobs(jobsRes.jobs);
            setStats(statsRes);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-refresh every 10s so you don't need to manually hit F5
    // while the CLI pipeline is scraping/matching in the background.
    useEffect(() => {
        const interval = setInterval(() => loadData(true), 10000);
        return () => clearInterval(interval);
    }, [loadData]);

    const handleApprove = async (id) => {
        setJobs((prev) => prev.filter((j) => j._id !== id));
        await approveJob(id);
        loadData(true);
    };

    const handleSkip = async (id) => {
        setJobs((prev) => prev.filter((j) => j._id !== id));
        await skipJob(id);
        loadData(true);
    };

    const unmatchedCount = stats ? stats.total - stats.matched - stats.approved - stats.applied - stats.failed : 0;

    return (
        <div className="app">
            <div className="top-row">
                <h1>AI Job Hunter Dashboard</h1>
                {lastUpdated && (
                    <span className="last-updated">
                        <span className="pulse-dot" /> Live · updated {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {stats && (
                <div className="stats-row">
                    <StatCard label="Total" value={stats.total} />
                    <StatCard label="Matched" value={stats.matched} highlight={stats.matched > 0} />
                    <StatCard label="Approved" value={stats.approved} />
                    <StatCard label="Applied" value={stats.applied} />
                    <StatCard label="Failed" value={stats.failed} />
                </div>
            )}

            {stats && unmatchedCount > 0 && (
                <div className="pending-banner">
                    ⏳ {unmatchedCount} job(s) scraped but not yet matched by AI. Run{" "}
                    <code>npm start</code> to continue matching.
                </div>
            )}

            <div className="filters">
                {TABS.map((s) => (
                    <button
                        key={s}
                        className={statusFilter === s ? "active" : ""}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s}
                        {stats && stats[s] > 0 && <span className="count-badge">{stats[s]}</span>}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="job-list">
                    <div className="skeleton" />
                    <div className="skeleton" />
                    <div className="skeleton" />
                </div>
            ) : (
                <div className="job-list">
                    {jobs.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <p className="empty-title">No jobs in "{statusFilter}" yet</p>
                            <p className="empty-sub">
                                Run <code>npm start</code> in the terminal to scrape and match new jobs.
                            </p>
                        </div>
                    )}
                    {jobs.map((job, i) => (
                        <div
                            key={job._id}
                            className="job-card"
                            style={{ animationDelay: `${i * 0.04}s` }}
                        >
                            <div className="job-header">
                                <h3>{job.title}</h3>
                                <span className={`score ${scoreClass(job.matchScore)}`}>
                                    {job.matchScore}/100
                                </span>
                            </div>
                            <p className="company">{job.company} — {job.location}</p>
                            {job.experience && <p className="exp">Experience: {job.experience}</p>}
                            <p className="summary">{job.summary}</p>
                            {job.matchedSkills?.length > 0 && (
                                <p className="skills">
                                    <strong>Matched:</strong> {job.matchedSkills.join(", ")}
                                </p>
                            )}
                            {job.missingSkills?.length > 0 && (
                                <p className="skills">
                                    <strong>Missing:</strong> {job.missingSkills.join(", ")}
                                </p>
                            )}
                            <div className="actions">
                                <a href={job.url} target="_blank" rel="noreferrer">View Job</a>
                                {job.status === "matched" && (
                                    <>
                                        <button className="approve-btn" onClick={() => handleApprove(job._id)}>
                                            ✓ Approve
                                        </button>
                                        <button className="skip-btn" onClick={() => handleSkip(job._id)}>
                                            ✕ Skip
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, highlight }) {
    return (
        <div className={`stat-card ${highlight ? "stat-highlight" : ""}`}>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default App;