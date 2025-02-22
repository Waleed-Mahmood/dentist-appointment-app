import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Generic function to handle API requests with error handling
const fetchData = async (endpoint) => {
    try {
        console.log(`Fetching from: ${BASE_URL}/${endpoint}`); // Debug log
        const response = await api.get(endpoint);
        return response.data; // Return the JSON response
    } catch (error) {
        console.error(`API Fetch Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
        return null; // Return null in case of an error
    }
};

// Signup API Call
export const registerUser = async (userData) => {
    try {
        const response = await api.post("/signup", userData);
        console.log("Signup Successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw error.response?.data?.message || "Failed to signup.";
    }
};

// Login API Call
export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/login", credentials);
        console.log("Login Successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error.response?.data?.message || "Invalid login credentials.";
    }
};

// API functions
export const getServices = async () => fetchData("/get-services");

export const getServiceDentists = async (serviceId) => fetchData(`/get-service-dentists/${serviceId}`);

export const getDentists = async () => fetchData("/get-dentists");

export const getDentistServices = async (dentistId) => fetchData(`/get-dentist-services/${dentistId}`);




export const fetchUserAppointments = async () => {
    return [
        { id: 1, dentist_id: 1, appointment_date: "2025-02-15", appointment_time: "10:30 AM", appointment_status: "Confirmed" },
        { id: 2, dentist_id: 2, appointment_date: "2025-02-14", appointment_time: "02:00 PM", appointment_status: "Pending" },
        { id: 3, dentist_id: 1, appointment_date: "2025-02-16", appointment_time: "09:00 AM", appointment_status: "InProgress" }
    ];
};

export default api;