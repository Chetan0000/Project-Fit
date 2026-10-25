import Constants from "expo-constants";

type Extra = { apiBaseUrl?: string };

/**
 * The single place the API origin lives. Point `expo.extra.apiBaseUrl` in
 * app.json at the Rust server to switch the app off the in-memory mocks;
 * while it is blank, every endpoint serves mock data.
 */
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const API_BASE_URL = extra.apiBaseUrl ?? "";

export const USE_MOCKS = API_BASE_URL.length === 0;
