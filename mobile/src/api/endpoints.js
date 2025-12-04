export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
    },
    USER: {
        GET_EVENTS: "/me/events",
        FEEDBACK: (eventId) => `/feedback/${eventId}`,
        ATTENDANCE: (eventId) => `/attendance/${eventId}`,
        BOOKMARK: (eventId) => `/bookmark/${eventId}`,
        UNBOOKMARK: (eventId) => `/unbookmark/${eventId}`,
    },
    ADMIN: {
        GET_EVENTS: "/events",
        CREATE_EVENT: "/events",
        UPDATE_EVENT: (eventId) => `/events/${eventId}`,
        DELETE_EVENT: (eventId) => `/events/${eventId}`,
    },
    GET_EVENTS_BY_ID: (eventId) => `/events/${eventId}`,
};