const LOCAL_API_URL = (
  process.env.SERVER_URL_LOCAL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const PRODUCTION_API_URL = (
  process.env.SERVER_URL_PROD ||
  process.env.NEXT_PUBLIC_API_URL_PROD ||
  "https://api.jokerclash.com"
).replace(/\/+$/, "");

function isConnectionRefused(error: unknown): boolean {
  let currentError: unknown = error;

  while (currentError instanceof Error) {
    if ("code" in currentError && currentError.code === "ECONNREFUSED") {
      return true;
    }
    currentError = currentError.cause;
  }

  return false;
}

export async function fetchServerApi(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const normalizedPath = path.replace(/^\/+/, "");

  if (process.env.NODE_ENV !== "development") {
    return fetch(`${PRODUCTION_API_URL}/api/${normalizedPath}`, init);
  }

  try {
    return await fetch(`${LOCAL_API_URL}/api/${normalizedPath}`, init);
  } catch (error) {
    if (!isConnectionRefused(error)) throw error;
    return fetch(`${PRODUCTION_API_URL}/api/${normalizedPath}`, init);
  }
}
