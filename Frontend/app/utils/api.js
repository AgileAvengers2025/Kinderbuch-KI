import axios from "axios";
import { jwtDecode } from "jwt-decode";


const API_URL = "http://localhost:8082";
let accessToken = null;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies (refreshToken) are sent
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await api.post("/refresh-token");
    accessToken = response.data.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Session expired, please log in again.");
    accessToken = null;
    return null;
  }
};

// Axios Request Interceptor
api.interceptors.request.use(
  async (config) => {
    if (!accessToken) return config;

    const decoded = jwtDecode(accessToken);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        return Promise.reject("Sitzung abgelaufen, bitte erneut einloggen.");
      }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;