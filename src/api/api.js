import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Generic function
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


export const getServices = async () => fetchData("/get-services");

export const getServiceDentists = async (serviceId) => fetchData(`/get-service-dentists/${serviceId}`);

export const getDentists = async () => fetchData("/get-dentists");

export const getDentistServices = async (dentistId) => fetchData(`/get-dentist-services/${dentistId}`);

export const storeAppointmentPreferences = async (appointmentData) => {
    try {
        const formData = new FormData();
        formData.append("user_id", appointmentData.user_id);
        formData.append("dentist_id", appointmentData.dentist_id);
        formData.append("first_name", appointmentData.first_name);
        formData.append("last_name", appointmentData.last_name);
        formData.append("patient_gender", appointmentData.patient_gender);
        formData.append("patient_age", appointmentData.patient_age);
        formData.append("patient_phone_number", appointmentData.patient_phone_number);
        formData.append("patient_email_address", appointmentData.patient_email_address);
        formData.append("preferred_dates", appointmentData.preferred_dates);

        if (appointmentData.relation) {
            formData.append("relation", appointmentData.relation);
        }
        if (appointmentData.special_notes) {
            formData.append("special_notes", appointmentData.special_notes);
        }
        if (appointmentData.file) {
            formData.append("file", appointmentData.file);
        }

        const response = await api.post("/store-appointment-preferences", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error storing appointment preferences:", error.response?.data || error.message);
        throw error.response?.data?.message || "Failed to store appointment preferences.";
    }
};


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
