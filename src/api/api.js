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
        return response.data;
    } catch (error) {
        console.error(`API Fetch Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
        return null;
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

// Store Appointment Preferences
export const storeAppointmentPreferences = async (appointmentData) => {
    try {
        console.log(appointmentData);
        const response = await api.post("/store-appointment-preferences", appointmentData);
        console.log("Appointment Preferences Stored:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error Storing Preferences:", error.response?.data || error.message);
        throw error.response?.data?.message || "Failed to store appointment preferences.";
    }
};

// Book Appointment
export const bookAppointment = async (appointmentData) => {
    try {
        const response = await api.post("/book-appointment", appointmentData);
        console.log("Appointment Booked:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error Booking Appointment:", error.response?.data || error.message);
        throw error.response?.data?.message || "Failed to book appointment.";
    }
};

// Get User Appointments
export const fetchUserAppointments = async (userId) => {
    try {
        const response = await api.get(`/get-user-appointment/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error Fetching Appointments:", error.response?.data || error.message);
        return [];
    }
};

export default api;
