import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserAppointments, getDentists } from "../api/api";
import "../styles/MyAppointments.css";

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [dentists, setDentists] = useState([]);
    const user_id = localStorage.getItem("user_id");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user_id) return;

        const fetchData = async () => {
            try {
                const [appointmentsData, dentistsData] = await Promise.all([
                    fetchUserAppointments(user_id),
                    getDentists(),
                ]);
                setAppointments(appointmentsData);
                setDentists(dentistsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user_id]);

    const getDentistInfo = (dentist_id, field) => {
        if (!dentists.length) return "Loading...";
        const dentist = dentists.find((d) => d.dentist_id === dentist_id);
        return dentist ? dentist[field] || "Not Available" : "Unknown Dentist";
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "booked":
                return "confirmed";
            case "pending":
                return "pending";
            case "canceled":
                return "canceled";
            default:
                return "default";
        }
    };

    return (
        <div className="appointments-container">
            <h2>My Appointments</h2>

            <div className="appointments-list">
                {/* ✅ If user is not logged in */}
                {!user_id ? (
                    <div className="unavailable_appointment-container">
                        <h2>Appointments Unavailable</h2>
                        <p>Please login first.</p>
                        <button onClick={() => navigate("/")}>Login</button>
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div
                            key={appointment.appointment_id}
                            className={`appointment-card ${getStatusClass(
                                appointment.appointment_status
                            )}`}
                        >
                            <div className="appointment-header">
                                <h3 className="dentist-name">
                                    {getDentistInfo(appointment.dentist_id, "dentist_name")}
                                </h3>
                                <p className="clinic-name">
                                    {getDentistInfo(appointment.dentist_id, "dentist_clinic")}
                                </p>
                            </div>
                            <div className="appointment-details">
                                {appointment.appointment_status.toLowerCase() === "canceled" ? (
                                    <p className="canceled-status">Booking Cancelled</p>
                                ) : appointment.appointment_status.toLowerCase() === "pending" ? (
                                    <p className="pending-status">Pending Confirmation</p>
                                ) : (
                                    <>
                                        <p>
                                            <strong>Date:</strong> {appointment.appointment_date}
                                        </p>
                                        <p>
                                            <strong>Time:</strong> {appointment.appointment_time}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className={`status-badge ${getStatusClass(appointment.appointment_status)}`}>
                                {appointment.appointment_status}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-appointments">No appointments found.</p>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
