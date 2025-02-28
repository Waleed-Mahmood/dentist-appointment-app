import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
    const fetchServices = async () => {
      try {
        const response = await api.get("/get-services");
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (err) {
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, userId, navigate, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredServices(
      services.filter((service) =>
        service.service_name.toLowerCase().includes(query)
      )
    );
  };

  const handleViewDentists = (service_id) => {
    navigate(`/dentists/${service_id}`);
  };

  return (
    <div className="services-container">
      <h1 className="page-title">Our Services</h1>

      <input
        type="text"
        placeholder="Search services..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service.service_id} className="service-card">
            <h2 className="service-name">{service.service_name}</h2>
            <p className="service-description">
              {service.service_description}
            </p>
            <button
              className="view-details-btn"
              onClick={() => handleViewDentists(service.service_id)}
            >
              View Dentists
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
