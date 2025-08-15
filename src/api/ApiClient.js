// src/apiClient.js

// Works with CRA (REACT_APP_*)
// If not set, we default to "/api" so CF/NGINX routes like /api/* still work
const RAW_BASE = process.env.REACT_APP_API_BASE_URL || "";

function normalizeBase(b) {
  if (!b || typeof b !== "string") return "/api";
  let s = b.trim().replace(/\/+$/, "");
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
    numberOfPassengers:
        a.numberOfPassengers ??
        a.numOfPassengers ??
        a.passengerCount ??
        null,
    ...a,
  };
}

function mapFlight(f) {
  if (!f || typeof f !== "object") return f;
  return {
    id: f.id,
    airline: f.airline ?? null,
    flightNumber: f.flightNumber ?? null,
    departureAirport: f.departureAirport ?? null,
    arrivalAirport: f.arrivalAirport ?? null,
    departureAirportName: f.departureAirport?.name ?? null,
    arrivalAirportName: f.arrivalAirport?.name ?? null,
    scheduledDeparture: f.scheduledDeparture ?? null,
    scheduledArrival: f.scheduledArrival ?? null,
    status: f.status ?? null,
    distanceKm: f.distanceKm ?? null,
    durationMinutes: f.durationMinutes ?? null,
    ...f,
  };
}

function mapArray(data, mapper) {
  if (!Array.isArray(data)) return [];
  return data.map(mapper);
}

/* ------------ Public API ------------ */

const ApiClient = {
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

  async getAllFlights() {
    const data = await request("/flights");
    return mapArray(data, mapFlight);
  },

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
  getFlights() {
    return this.getAllFlights();
  },
};

export default ApiClient;
