import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const getJobs = (params = {}) =>
    axios.get(`${API_BASE}/jobs`, { params }).then((res) => res.data);

export const getStats = () =>
    axios.get(`${API_BASE}/jobs/stats`).then((res) => res.data);

export const approveJob = (id) =>
    axios.patch(`${API_BASE}/jobs/${id}/approve`).then((res) => res.data);

export const skipJob = (id) =>
    axios.patch(`${API_BASE}/jobs/${id}/skip`).then((res) => res.data);