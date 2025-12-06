import client from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";
import dayjs from 'dayjs';

export const getUserEvents = async () => {
    const response = await client.get(API_ENDPOINTS.USER.GET_EVENTS);
    const mappedEvents = response.data.map(event => ({
        id: event.event_id,
        image: `${process.env.EXPO_PUBLIC_BACKEND_URL}${event.image_url}`,
        location : event.location,
        time: `${dayjs(event.start_date).format('hh:mm')} - ${dayjs(event.end_date).format('hh:mm')}`,
        bookmarked : Boolean(event.bookmarked),
        attendance : Boolean(event.attended),
        feedback : Boolean(event.feedback_given),
        date : event.start_date.split('T')[0],
        title : event.title,   
        desc : event.description,
    }));
    return mappedEvents;
}

export const attendance = async (eventId, scanned_at) => {
    const response = await client.post(
        API_ENDPOINTS.USER.ATTENDANCE(eventId),
        { scanned_at }
    );
    return response.message;
};


export const bookmark = async (eventId) => {
    return client.post(API_ENDPOINTS.USER.BOOKMARK(eventId));
}

export const unbookmark = async (eventId) => {
    return client.delete(API_ENDPOINTS.USER.BOOKMARK(eventId));
}

export const getEventDetails = async (eventId) => {
    const response = await client.get(API_ENDPOINTS.USER.GET_EVENT_DETAILS(eventId));
    const mappedEvent = {
        id: response.data.event_id,
        image: `${process.env.EXPO_PUBLIC_BACKEND_URL}${response.data.image_url}`,
        bookmarked : Boolean(response.data.bookmarked),
        attendance : Boolean(response.data.attendance),
        date : response.data.start_date.split('T')[0],
        title : response.data.title,   
        desc : response.data.description,
        location : response.data.location,
        start_time : response.data.start_time,
        end_time : response.data.end_time,
        category : response.data.category,
        tags : response.data.tags,
    };
    return mappedEvent;
}

export const giveFeedback = async (eventId, rating, feedback) => {
    const response = await client.post(API_ENDPOINTS.USER.FEEDBACK(eventId), { rating, feedback });
    return response.message;
}
