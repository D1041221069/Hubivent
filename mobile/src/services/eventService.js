import client from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";

export const getAllEvents = async () => {
    const response = await client.get(API_ENDPOINTS.ADMIN.GET_EVENTS);
    const mappedEvents = response.data.map(event => ({
        image: `${process.env.EXPO_PUBLIC_BACKEND_URL}${event.image_url}`,
        id: event.event_id,
        title: event.title,
        description: event.description,
        date: event.start_date.split('T')[0],
        originalData: event // Ensure we keep original data for editing
    }));
    return mappedEvents;
}

export const createEvent = async (eventData) => {
    return client.post(API_ENDPOINTS.ADMIN.CREATE_EVENT, eventData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}


export const deleteEvent = async (eventId) => {
    return client.delete(API_ENDPOINTS.ADMIN.DELETE_EVENT(eventId));
}

export const updateEvent = async (eventId, eventData) => {
    return client.put(API_ENDPOINTS.ADMIN.UPDATE_EVENT(eventId), eventData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}