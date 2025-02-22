import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Dentist Appointment Help Agent</h1>
            <p>Find the best dental services and book an appointment with ease.</p>
            <div className="home-buttons">
                <Link to="/services" className="btn">Browse Services</Link>
                <Link to="/dentists" className="btn">Find a Dentist</Link>
            </div>
        </div>
    );
};

export default Home;
