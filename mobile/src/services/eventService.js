import client from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";

export const attendance = async (eventId, scanned_at) => {
    return client.post(API_ENDPOINTS.USER.ATTENDANCE(eventId), {
        scanned_at
    });
}

export const getAllEvents = async () => {
    return client.get(API_ENDPOINTS.ADMIN.GET_EVENTS);
}

export const createEvent = async (eventData) => {
    return client.post(API_ENDPOINTS.ADMIN.CREATE_EVENT, eventData);
}

export const deleteEvent = async (eventId) => {
    return client.delete(API_ENDPOINTS.ADMIN.DELETE_EVENT(eventId));
}
