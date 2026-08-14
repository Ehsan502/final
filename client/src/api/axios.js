import axios from "axios";

// 💡 Apne backend ka asli Live URL yahan replace karein (Render / Railway ka link)
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://final-lkolszvjo-ehsan502s-projects.vercel.app//api";

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillswap_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;