import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        Cookies.set("accessToken", data.accessToken, {
          secure: true,
          sameSite: "none",
        });

        api.defaults.headers.common[
          "authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Refresh token failed, redirecting to login...");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
