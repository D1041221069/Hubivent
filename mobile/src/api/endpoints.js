const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: baseURL + "/auth/login",
        REGISTER: baseURL + "/auth/register",
    },
    USER: {
        GET_EVENTS: baseURL + "/me/events",
        FEEDBACK: (eventId) => `${baseURL}/feedback/${eventId}`,
        ATTENDANCE: (eventId) => `${baseURL}/attendance/${eventId}`,
        BOOKMARK: (eventId) => `${baseURL}/bookmark/${eventId}`,
        UNBOOKMARK: (eventId) => `${baseURL}/unbookmark/${eventId}`,
    },
    ADMIN: {
        GET_EVENTS: baseURL + "/events",
        CREATE_EVENT: baseURL + "/events",
        UPDATE_EVENT: (eventId) => `${baseURL}/events/${eventId}`,
        DELETE_EVENT: (eventId) => `${baseURL}/events/${eventId}`,
    },
    GET_EVENTS_BY_ID: (eventId) => `${baseURL}/events/${eventId}`,
};