const BASE_URL = ''; // CRA proxy in dev

async function handleResponse(res, url) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(text || `${res.status} ${res.statusText}`);
        err.status = res.status;
        err.url = url;
        throw err;
    }

    if (res.status === 204) return null;
    return res.json();
}

async function get(url) {
    const res = await fetch(url, {headers: {Accept: 'application/json'}});
    return handleResponse(res, url);
}

function toArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content; // pageable
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.airports)) return data.airports;
    return [];
}

const ApiClient = {
    // existing
    getAirportsByCity: (cityId) => get(`${BASE_URL}/cities/${cityId}/airports`),
    getAircraftByPassenger: (passengerId) => get(`${BASE_URL}/passengers/${passengerId}/aircraft`),
    getAirportsForAircraft: (aircraftId) => get(`${BASE_URL}/aircraft/${aircraftId}/airports`),
    getAirportsUsedByPassenger: (passengerId) => get(`${BASE_URL}/passengers/${passengerId}/airports`),

    getAllAirports: async () => {
        try {
            const data = await get(`${BASE_URL}/airports`);
            const list = toArray(data);
            if (list.length) return list;

            if (data && !Array.isArray(data)) return toArray(data);
        } catch (e) {

            if (e.status && e.status !== 404) throw e;
        }

        const cities = toArray(await get(`${BASE_URL}/cities`));
        const all = await Promise.all(
            cities.map(c => ApiClient.getAirportsByCity(c.id).catch(() => []))
        );
        return all.flat();
    },
};

export default ApiClient;
