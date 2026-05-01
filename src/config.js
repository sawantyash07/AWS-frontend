// Use environment variable for API URL with a fallback to the relative proxy path
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default API_BASE_URL;
