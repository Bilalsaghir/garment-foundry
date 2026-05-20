import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Read token from localStorage (mirror of httpOnly cookie for cross-domain auth)
const TOKEN_KEY = "gf_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const adminAxios = axios.create({ baseURL: API, withCredentials: true });
adminAxios.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
adminAxios.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);
