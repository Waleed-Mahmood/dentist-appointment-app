import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import "../styles/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        phone_number: "",
        age: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerUser(formData);
            navigate("/"); // Redirect to login after successful signup
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
                    <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                    <input type="tel" name="phone_number" placeholder="Phone Number" required onChange={handleChange} />
                    <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
                <p className="switch-text">
                    Already have an account? <a href="/">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
