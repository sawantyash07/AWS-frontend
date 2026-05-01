// Ensure the API URL includes the /api prefix
const base = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = base ? `${base.replace(/\/$/, "")}/api` : "/api";

export default API_BASE_URL;
