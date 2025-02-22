import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Dentists.css";

const Dentists = () => {
    const { service_id } = useParams(); // Extract service_id from URL
    const [dentists, setDentists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDentistsAndServices = async () => {
            try {
                let dentistResponse;
                if (service_id) {
                    dentistResponse = await api.get(`/get-service-dentists/${service_id}`);
                } else {
                    dentistResponse = await api.get("/get-dentists");
                }

                const dentistsData = dentistResponse.data;
                console.log("Fetched Dentists:", dentistsData); // Debugging

                // Fetch services for each dentist in parallel
                const dentistsWithServices = await Promise.all(
                    dentistsData.map(async (dentist) => {
                        try {
                            const servicesResponse = await api.get(
                                `/get-dentist-services/${dentist.dentist_id}`
                            );
                            // console.log(`Services for Dentist ${dentist.dentist_id}:`, servicesResponse.data);
                            return { ...dentist, services: servicesResponse.data };
                        } catch (err) {
                            console.log(`Failed to fetch services for Dentist ${dentist.dentist_id}`);
                            return { ...dentist, services: [] };
                        }
                    })
                );

                setDentists(dentistsWithServices);
            } catch (err) {
                setError("Failed to fetch dentists. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDentistsAndServices();
    }, [service_id]);

    const filteredDentists = dentists.filter((dentist) =>
        dentist.dentist_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dentists-container">
            <h2>{service_id ? "Dentists for Selected Service" : "Find a Dentist"}</h2>
            <input
                type="text"
                placeholder="Search dentists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            <div className="dentist-grid">
                {filteredDentists.length > 0 ? (
                    filteredDentists.map((dentist) => (
                        <div className="dentist-card" key={dentist.dentist_id}>
                            <h3 className="dentist-name">{dentist.dentist_name}</h3>
                            <p className="experience">
                                {dentist.years_of_experience} years of experience
                            </p>
                            <p className="speciality">{dentist.dentist_speciality}</p>
                            <p className="clinic-name">{dentist.dentist_clinic}</p>

                            <div className="services-section">
                                <h4>Services:</h4>
                                <div className="service-tabs">
                                    {dentist.services.length > 0 ? (
                                        dentist.services.map((service) => (
                                            <span key={service.service_id} className="service-tab">
                                                {service.service_name}

                                            </span>
                                        ))
                                    ) : (
                                        <p className="no-services">No services listed</p>
                                    )}
                                </div>
                            </div>

                            <button
                                className="appointment-btn"
                                onClick={() =>
                                    navigate("/appointment", {
                                        state: {
                                            selectedDentist: dentist
                                        }
                                    })
                                }
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No dentists found.</p>
                )}
            </div>
        </div >
    );
};

export default Dentists;
