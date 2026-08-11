import axios from "axios";

/** Shared axios instance. Feature api/ files build on top of this. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  withCredentials: true,
});
