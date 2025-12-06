export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
    },
    USER: {
        GET_EVENTS: "/me/events",
        FEEDBACK: (id) => `/feedback/${id}`,
        ATTENDANCE: (id) => `/attendance/${id}`,
        BOOKMARK: (id) => `/bookmark/${id}`,
        UNBOOKMARK: (id) => `/unbookmark/${id}`,
    },
    ADMIN: {
        GET_EVENTS: "/events",
        CREATE_EVENT: "/events",
        UPDATE_EVENT: (id) => `/events/${id}`,
        DELETE_EVENT: (id) => `/events/${id}`,
    },
    GET_EVENTS_BY_ID: (id) => `/events/${id}`,
};
