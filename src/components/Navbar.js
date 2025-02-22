import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const navigate = useNavigate();

  useEffect(() => {
    setUserId(localStorage.getItem("user_id")); // Update state on page reload
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id"); // Clear user_id on logout
    setUserId(null); // Update state
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          🦷 Dental Appointment
        </Link>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </div>

        {/* Nav Links */}
        <ul className={isOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/services" onClick={() => setIsOpen(false)}>Services</Link></li>
          <li><Link to="/dentists" onClick={() => setIsOpen(false)}>Dentists</Link></li>
          <li><Link to="/appointment" onClick={() => setIsOpen(false)}>Book Appointment</Link></li>
          <li><Link to="/my-appointments" onClick={() => setIsOpen(false)}>My Appointments</Link></li>

          {/* Show "Logout" if user is logged in, otherwise show "Login" */}
          {userId ? (
            <li><button className="login-btn" onClick={handleLogout}>Logout</button></li>
          ) : (
            <li><Link to="/login" className="login-btn" onClick={() => setIsOpen(false)}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
