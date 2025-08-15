// src/apiClient.js

// Works with CRA (REACT_APP_*)
const RAW_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  ""; // if empty, we'll default to /api

function normalizeBase(b) {
  if (!b || typeof b !== "string") return "/api"; // default so CF behavior /api/* matches
  // trim spaces and trailing slashes
  let s = b.trim().replace(/\/+$/, "");
  // allow bare "api" -> "/api"
  if (!/^https?:\/\//i.test(s) && s[0] !== "/") s = "/" + s;
  return s || "/api";
}

const BASE = normalizeBase(RAW_BASE);

const DEFAULT_TIMEOUT_MS = 15000;

async function request(path, { method = "GET", body, headers = {}, timeoutMs } = {}) {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs ?? DEFAULT_TIMEOUT_MS);

  const isJsonBody = body && typeof body === "object";
  const reqHeaders = {
    Accept: "application/json",
    ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: reqHeaders,
      body: isJsonBody ? JSON.stringify(body) : body,
      signal: controller.signal,
      // If you use cookie-based auth, uncomment the next line:
      // credentials: "include",
    });
  } finally {
    clearTimeout(t);
  }

  // 204 No Content
  if (res.status === 204) return null;

  // Try to parse JSON if the server says it's JSON
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.toLowerCase().includes("application/json");

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    const message = errText || `${res.status} ${res.statusText}`;
    const error = new Error(message);
    error.status = res.status;
    error.url = url;
    throw error;
  }

  if (isJson) return res.json();

  // Fallback: return raw text (useful if backend sends plain text on success)
  return res.text();
}

const ApiClient = {
  // READ
  getAllAirports: () => request("/airports"),
  getAllAircraft: () => request("/aircraft"),
  getAllPassengers: () => request("/passengers"),

  // If add writes:
  // createPassenger: (payload) => request("/passengers", { method: "POST", body: payload }),
  // updatePassenger: (id, payload) => request(`/passengers/${id}`, { method: "PUT", body: payload }),
  // deletePassenger: (id) => request(`/passengers/${id}`, { method: "DELETE" }),
};

export default ApiClient;
