import axios from "axios";

const supportedLocales = ["en", "ka", "ru"] as const;
type Locale = (typeof supportedLocales)[number];
const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "/api/proxy"
    : `${process.env.NEXT_PUBLIC_API_URL || "https://api.jokerclash.com"}/api`;

const resolveLocaleFromPath = (): Locale => {
  if (typeof window === "undefined") return "en";

  const segment = window.location.pathname.split("/")[1];

  if (supportedLocales.includes(segment as Locale)) {
    return segment as Locale;
  }

  return "en";
};

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const locale = resolveLocaleFromPath();

  config.headers["x-locale"] = locale;

  return config;
});

export default api;
