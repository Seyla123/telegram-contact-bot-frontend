// src/api/api.ts
import axios from "axios";

export const baseApi = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // Include cookies for authentication
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Auto-attach Authorization token if user is logged in
baseApi.interceptors.request.use((config) => {
  const token = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default baseApi;
