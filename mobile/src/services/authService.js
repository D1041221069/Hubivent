import axios from "axios";
import { API_BASE, API_ENDPOINTS } from "../api/endpoints";

export const login = async (email, password) => {
    return axios.post(API_BASE + API_ENDPOINTS.AUTH.LOGIN, {
        email, password
    });
};
export const register = async (name, email, password) => {
    return axios.post(API_BASE + API_ENDPOINTS.AUTH.REGISTER, {
        name, email, password
    });
}