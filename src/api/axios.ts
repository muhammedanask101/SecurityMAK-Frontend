import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 🔐 Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Force logout on 401 (except login/register)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;

    const isAuthRoute =
      url?.includes("/auth/login") ||
      url?.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      const { logout } = useAuthStore.getState();

      logout(); // clears persisted auth

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
