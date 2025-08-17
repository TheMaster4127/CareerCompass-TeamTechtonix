// src/lib/api.ts
// Centralized Axios instance that reads the backend base URL from Vite env.
// The base URL is taken from .env.local (for dev) or hosting env (e.g., Vercel).

import axios from "axios";

// Ensure no trailing slash on the base to avoid double slashes.
const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Example: http://127.0.0.1:5000 + "/api" → http://127.0.0.1:5000/api
export const api = axios.create({
  baseURL: `${base}/api`,
  // Optional: configure a timeout if desired
  // timeout: 15000,
});

// Helper to attach Authorization header from localStorage
export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Optional response interceptor template (add if needed)
/*
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Handle unauthorized (e.g., navigate to /login)
    }
    return Promise.reject(err);
  }
);
*/
