// src/apiClient.js

// Works with CRA (REACT_APP_*)
// If not set, we default to "/api" so CF/NGINX routes like /api/* still work
const RAW_BASE = process.env.REACT_APP_API_BASE_URL || "";

function normalizeBase(b) {
  if (!b || typeof b !== "string") return "/api";
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
      // credentials: "include", // uncomment if you use cookie-based auth
    });
  } finally {
    clearTimeout(t);
  }

  if (res.status === 204) return null;

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const isJson = ct.includes("application/json");

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    const message = errText || `HTTP ${res.status} ${res.statusText}`;
    const error = new Error(message);
    error.status = res.status;
    error.url = url;
    throw error;
  }

  return isJson ? res.json() : res.text();
}

/* ------------ Response mappers / normalizers ------------ */

function mapAircraft(a) {
  if (!a || typeof a !== "object") return a;
  return {
    id: a.id,
    type: a.type ?? a.aircraftType ?? a.name ?? "",
    airlineName: a.airlineName ?? a.airline ?? null,
    // normalize passengers property name
    numberOfPassengers:
      a.numberOfPassengers ??
      a.numOfPassengers ??
      a.passengerCount ??
      null,
    // keep original for compatibility if someone reads raw
    ...a,
  };
}

function mapArray(data, mapper) {
  if (!Array.isArray(data)) return [];
  return data.map(mapper);
}

/* ------------ Public API ------------ */

const ApiClient = {
  /* Canonical helpers */
  async getAllAirports() {
    return request("/airports");
  },

  async getAllAircraft() {
    const data = await request("/aircraft");
    return mapArray(data, mapAircraft);
  },

  async getAllPassengers() {
    return request("/passengers");
  },

  /* Aliases so existing pages keep working */
  getAirports() {
    return this.getAllAirports();
  },
  getAircraft() {
    return this.getAllAircraft();
  },
  getAircrafts() {
    return this.getAllAircraft();
  },
  getPassengers() {
    return this.getAllPassengers();
  },

  /* If you add writes later, keep them normalized too */
  // createPassenger: (payload) => request("/passengers", { method: "POST", body: payload }),
  // updatePassenger: (id, payload) => request(`/passengers/${id}`, { method: "PUT", body: payload }),
  // deletePassenger: (id) => request(`/passengers/${id}`, { method: "DELETE" }),
};

export default ApiClient;
