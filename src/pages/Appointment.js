import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Appointment.css";
import { storeAppointmentPreferences, bookAppointment } from "../api/api"; // Import API functions

const Appointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDentist, selectedService } = location.state || {};

  const [selectedDates, setSelectedDates] = useState([]);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("user_id"); // Retrieve user ID from local storage

  if (!selectedDentist) {
    return (
      <div className="appointment-container">
        <h2>Appointment Booking Unavailable</h2>
        <p>Please select a dentist first.</p>
        <button onClick={() => navigate("/dentists")}>Browse Dentists</button>
      </div>
    );
  }

  const handleDateChange = (date) => {
    const dateStr = date.toDateString();

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      if (selectedDates.length < 3) {
        setSelectedDates([...selectedDates, dateStr]);
      } else {
        setSelectedDates([...selectedDates.slice(1), dateStr]);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in to book an appointment.");
      return;
    }

    if (selectedDates.length === 0) {
      alert("Please select at least one preferred date.");
      return;
    }

    setLoading(true);

    try {
      // Ensure preferred_dates is a valid comma-separated string
      const formattedDates = selectedDates.join(", ");

      // Ensure all required fields are correctly formatted
      const requestData = {
        user_id: parseInt(userId, 10),
        dentist_id: parseInt(selectedDentist?.dentist_id, 10),
        preferred_dates: formattedDates.trim(),
        patient_name: patientName.trim(),
        patient_age: patientAge.toString().trim(),
        patient_gender: patientGender.trim(),
        patient_email_address: patientEmail.trim(),
        patient_phone_number: patientPhone.trim(),
        relation_with_patient: description.trim(),
        additional_notes: notes.trim(),
      };

      console.log("Sending Data to API:", requestData); // Debugging log

      // Ensure no required fields are empty
      for (const [key, value] of Object.entries(requestData)) {
        if (value === "" || value === undefined || value === null) {
          throw new Error(`Missing required field: ${key}`);
        }
      }

      // Store appointment preferences
      const preferenceResponse = await storeAppointmentPreferences(requestData);

      if (!preferenceResponse || !preferenceResponse.appointment_preference_id) {
        throw new Error("Failed to store appointment preferences.");
      }

      // Book the appointment
      const bookingResponse = await bookAppointment({
        user_id: requestData.user_id,
        dentist_id: requestData.dentist_id,
        appointment_preference_id: preferenceResponse.appointment_preference_id,
      });

      if (!bookingResponse || !bookingResponse.appointment_id) {
        throw new Error("Failed to book the appointment.");
      }

      alert("Appointment booked successfully!");
      navigate("/my-appointments");
    } catch (error) {
      console.error("Error Storing Preferences:", error.response?.data || error.message);
      alert(error.message || "An error occurred while booking.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="appointment-container">
      <h2>Book Your Appointment</h2>

      <div className="appointment-grid">
        {/* Dentist Details */}
        <div className="appointment-details">
          <h3>Dentist: {selectedDentist.dentist_name}</h3>
          <p>
            <strong>Specialization:</strong> {selectedDentist.dentist_speciality}
          </p>
          {selectedService && <p><strong>Service:</strong> {selectedService}</p>}
        </div>

        {/* Patient Details */}
        <form onSubmit={handleSubmit}>
          <div className="patient-details">
            <label>Patient Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              required
            />

            {/* Gender & Age in the same row */}
            <div className="gender-age">
              <div className="gender-field">
                <label>Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="age-field">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Enter age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Math.max(0, e.target.value))}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <h3>Select Up to 3 Preferred Dates</h3>
          <div className="calendar-wrapper">
            <Calendar
              onClickDay={handleDateChange}
              tileClassName={({ date }) =>
                selectedDates.includes(date.toDateString()) ? "selected-date" : ""
              }
            />
          </div>

          {selectedDates.length > 0 && (
            <div className="selected-dates">
              <p><strong>Selected Dates:</strong> {selectedDates.join(", ")}</p>
              <button type="button" className="clear-btn" onClick={handleClearSelection}>
                Clear
              </button>
            </div>
          )}

          {/* Relation with Patient */}
          <div className="problem-notes-card">
            <label>Relation with Patient</label>
            <textarea
              placeholder="Describe your Relation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div className="problem-notes-card">
            <label>Additional Notes (optional)</label>
            <textarea
              placeholder="Any preferences?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;














// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import "../styles/Appointment.css";

// const Appointment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { selectedDentist, selectedService } = location.state || {};

//   const [selectedDates, setSelectedDates] = useState([]);
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [patientName, setPatientName] = useState("");
//   const [patientAge, setPatientAge] = useState("");
//   const [patientGender, setPatientGender] = useState("");
//   const [patientEmail, setPatientEmail] = useState("");
//   const [patientPhone, setPatientPhone] = useState("");

//   if (!selectedDentist) {
//     return (
//       <div className="appointment-container">
//         <h2>Appointment Booking Unavailable</h2>
//         <p>Please select a dentist first.</p>
//         <button onClick={() => navigate("/dentists")}>Browse Dentists</button>
//       </div>
//     );
//   }

//   const handleDateChange = (date) => {
//     const dateStr = date.toDateString();

//     if (selectedDates.includes(dateStr)) {
//       setSelectedDates(selectedDates.filter((d) => d !== dateStr)); // Remove if already selected
//     } else {
//       if (selectedDates.length < 3) {
//         setSelectedDates([...selectedDates, dateStr]); // Add if within limit
//       } else {
//         setSelectedDates([...selectedDates.slice(1), dateStr]); // Remove oldest, add new
//       }
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedDates([]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Appointment request submitted!");
//   };

//   return (
//     <div className="appointment-container">
//       <h2>Book Your Appointment</h2>

//       <div className="appointment-grid">
//         {/* Dentist Details */}
//         <div className="appointment-details">
//           <h3>Dentist: {selectedDentist.dentist_name}</h3>
//           <p>
//             <strong>Specialization:</strong> {selectedDentist.dentist_speciality}
//           </p>
//           {selectedService && <p><strong>Service:</strong> {selectedService}</p>}
//         </div>

//         {/* Patient Details */}
//         <form onSubmit={handleSubmit}>
//           <div className="patient-details">
//             <label>Patient Name</label>
//             <input
//               type="text"
//               placeholder="Enter full name"
//               value={patientName}
//               onChange={(e) => setPatientName(e.target.value)}
//               required
//             />



//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={patientEmail}
//               onChange={(e) => setPatientEmail(e.target.value)}
//               required
//             />

//             <label>Phone Number</label>
//             <input
//               type="tel"
//               placeholder="Enter phone number"
//               value={patientPhone}
//               onChange={(e) => setPatientPhone(e.target.value)}
//               required
//             />

//             {/* Gender & Age in the same row */}
//             <div className="gender-age">
//               <div className="gender-field">
//                 <label>Gender</label>
//                 <select
//                   value={patientGender}
//                   onChange={(e) => setPatientGender(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div className="age-field">
//                 <label>Age</label>
//                 <input
//                   type="number"
//                   placeholder="Enter age"
//                   value={patientAge}
//                   onChange={(e) => setPatientAge(Math.max(0, e.target.value))}
//                   min="0"
//                   required
//                 />
//               </div>

//             </div>
//           </div>

//           {/* Calendar Section */}
//           <h3>Select Up to 3 Preferred Dates</h3>
//           <div className="calendar-wrapper">
//             <Calendar
//               onClickDay={handleDateChange}
//               tileClassName={({ date }) =>
//                 selectedDates.includes(date.toDateString()) ? "selected-date" : ""
//               }

//             />
//           </div>
//           {console.log(selectedDates)}
//           {selectedDates.length > 0 && (
//             <div className="selected-dates">
//               <p><strong>Selected Dates:</strong> {selectedDates.join(", ")}</p>
//               <button type="button" className="clear-btn" onClick={handleClearSelection}>
//                 Clear
//               </button>
//             </div>
//           )}

//           {/* Relation with Patient */}
//           <div className="problem-notes-card">
//             <label>Relation with Patient</label>
//             <textarea
//               placeholder="Describe your Relation..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           {/* Additional Notes */}
//           <div className="problem-notes-card">
//             <label>Additional Notes (optional)</label>
//             <textarea
//               placeholder="Any preferences?"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//             />
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="submit-btn">Confirm Booking</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Appointment;
