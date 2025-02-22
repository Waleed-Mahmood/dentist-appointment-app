import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Dentists from "./pages/Dentists";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/dentists" element={<Dentists />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* Dynamic Routes */}
        <Route path="/dentists/:service_id" element={<Dentists />} />
        <Route path="/services/:dentist_id" element={<Services />} />
      </Routes>
    </>
  );
};

export default App;
