import React, { useState, useEffect } from "react";
import { fetchUserAppointments, getDentists } from "../api/api";
import "../styles/MyAppointments.css";

const statusColors = {
    Confirmed: "#4CAF50", // Green
    Pending: "#FFC107", // Yellow
    InProgress: "#2196F3", // Blue
};

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [dentists, setDentists] = useState([]);

    useEffect(() => {
        fetchUserAppointments().then(setAppointments);
        getDentists().then(setDentists);
    }, []);

    // Get Dentist Name by ID
    const getDentistName = (dentistId) => {
        const dentist = dentists.find((d) => d.id === dentistId);
        return dentist ? dentist.name : "Unknown Dentist";
    };

    // Sort appointments by date and time
    const sortedAppointments = [...appointments].sort((a, b) => {
        return new Date(a.appointment_date + " " + a.appointment_time) - new Date(b.appointment_date + " " + b.appointment_time);
    });

    return (
        <div className="appointments-container">
            <h2>My Appointments</h2>
            <div className="appointments-list">
                {sortedAppointments.length > 0 ? (
                    sortedAppointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card" style={{ borderLeft: `6px solid ${statusColors[appointment.appointment_status] || "#ccc"}` }}>
                            <h3>{getDentistName(appointment.dentist_id)}</h3>
                            <p><strong>Date:</strong> {appointment.appointment_date}</p>
                            <p><strong>Time:</strong> {appointment.appointment_time}</p>
                            <p className="status" style={{ backgroundColor: statusColors[appointment.appointment_status] || "#ccc" }}>
                                {appointment.appointment_status}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No appointments found.</p>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
