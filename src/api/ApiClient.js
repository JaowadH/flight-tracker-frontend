const RAW_BASE = process.env.REACT_APP_API_BASE_URL || '';
const BASE = RAW_BASE.replace(/\/+$/, '');

async function getJson(path) {
    const url = BASE ? `${BASE}${path}` : path;
    const res = await fetch(url, {
        headers: {Accept: 'application/json'},
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `${res.status} ${res.statusText}`);
    }
    // tolerate empty 204 responses
    if (res.status === 204) return null;
    return res.json();
}

const ApiClient = {
    getAllAirports: () => getJson('/airports'),
    getAllAircraft: () => getJson('/aircraft'),
    getAllPassengers: () => getJson('/passengers'),
};

export default ApiClient;