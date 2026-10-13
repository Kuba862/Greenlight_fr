const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

export class ApiError extends Error {
    constructor(message, status) {
        super(message);

        this.name = "ApiError";
        this.status = status;
    }
}


async function request(path, { params = {}, signal } = {}) {

    if (!API_BASE_URL) {
        throw new Error(
            "Missing NEXT_PUBLIC_API_URL in the frontend configuration"
        );
    }

    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    const endpoint = path.replace(/^\/+/, "");
    const url = new URL(`${baseUrl}/${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {

        if (value === undefined || value === null || value === "") {
            return;
        }

        url.searchParams.set(key, String(value));
    });

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new ApiError(
            `Failed to retrieve data. Response code: ${response.status}.`,
            response.status
        );
    }

    return response.json();
}

export function getStops({
    source = "T",
    query = "",
    limit = 20,
    offset = 0,
    signal,
} = {}) {
    return request("/v1/stops", {
        params: {
            source,
            q: query.trim(),
            limit,
            offset,
        },
        signal,
    });
}

export function getLines({
    source = "T",
    limit = 20,
    offset = 0,
    signal,
} = {}) {
    return request("/v1/routes", {
        params: {
            source,
            limit,
            offset,
        },
        signal,
    });
}

export function getDepartures({
    stopId, 
    source = "T",
    limit = 20,
    windowMinutes = 60,
    at,
    signal,
} = {}) {

    if (!stopId) {
        throw new Error("Provide a stopId to retrieve departures.");
    }

    return request(
        `/v1/stops/${encodeURIComponent(stopId)}/departures`, {
            params: {
                source,
                limit,
                window_minutes: windowMinutes,
                at,
            }, 
            signal,
        }
    );
}