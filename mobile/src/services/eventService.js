import client from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";

export const attendance = async (eventId, scanned_at) => {
    return client.post(API_ENDPOINTS.USER.ATTENDANCE(eventId), {
        scanned_at
    });
}

export const getAllEvents = async () => {
    const response = await client.get(API_ENDPOINTS.ADMIN.GET_EVENTS);
    return response.data;
}

export const createEvent = async (eventData) => {
    return client.post(API_ENDPOINTS.ADMIN.CREATE_EVENT, eventData);
}

export const deleteEvent = async (eventId) => {
    return client.delete(API_ENDPOINTS.ADMIN.DELETE_EVENT(eventId));
}
