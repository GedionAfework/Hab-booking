import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3131/hab-booking",
});

// Base origin for assets like /uploads (served outside the /hab-booking prefix)
export const UPLOADS_BASE = "http://localhost:3131";

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default API;
