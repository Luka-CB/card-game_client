import axios from "axios";

const supportedLocales = ["en", "ka", "ru"] as const;
type Locale = (typeof supportedLocales)[number];

const resolveLocaleFromPath = (): Locale => {
  if (typeof window === "undefined") return "en";

  const segment = window.location.pathname.split("/")[1];

  if (supportedLocales.includes(segment as Locale)) {
    return segment as Locale;
  }

  return "en";
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const locale = resolveLocaleFromPath();

  config.headers["x-locale"] = locale;

  return config;
})

export default api;
