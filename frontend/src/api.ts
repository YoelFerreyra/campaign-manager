import axios from "axios";

const apiBase = import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:3000/Prod";

export const client = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" }
});
