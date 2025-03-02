

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments, bookAppointment } from "../../services/patientService";

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ doctor: "", specialty: "", date: "", location: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!storedUser?.token || storedUser.role !== "patient") {
      console.error("❌ No valid token found. Redirecting to login...");
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchAppointments(storedUser.token);
    }
  }, [navigate]);

  const fetchAppointments = async (token) => {
    try {
      console.log("🔵 Fetching appointments...");
      const data = await getPatientAppointments(token);
      console.log("✅ Appointments fetched:", data);
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error.response?.data || error.message);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      console.error("❌ No token found! Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      console.log("🔵 Sending booking request:", formData);
      console.log("🔵 User token:", user.token);

      const response = await bookAppointment(formData, user.token);
      console.log("✅ Booking response:", response);

      setAppointments([...appointments, response.newAppointment]); // Update UI
      setFormData({ doctor: "", specialty: "", date: "", location: "" }); // Clear form
    } catch (error) {
      console.error("❌ Error booking appointment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="glass-card">
      <h1>Welcome, {user?.name || "Patient"}</h1>

      {/* ✅ Appointment Booking Form */}
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBookingSubmit}>
        <input
          type="text"
          placeholder="Doctor's Name"
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Specialty"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <button type="submit">Book Appointment</button>
      </form>

      {/* ✅ Display Scheduled Appointments */}
      <h2>Upcoming Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {appointment.doctor} ({appointment.specialty}) - {new Date(appointment.date).toLocaleString()} at {appointment.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDashboard;

