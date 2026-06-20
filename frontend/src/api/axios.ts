import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/authSlice";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const serverMessage = error.response?.data?.message;
    const fallbackMessage = "An unexpected server error occurred.";

    if (status === 401 && !originalRequest.url.includes("/users/login")) {
      store.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 403) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    toast.error(serverMessage || fallbackMessage);

    return Promise.reject(error);
  },
);

export default api;
