import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPharmacistAppointments } from "../../services/pharmacistsService";
import "./Pharmacists.css";

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("userData") || "{}")
  );
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user?.token || user.role !== "pharmacist") {
      console.error("❌ No valid token found. Redirecting to login...");
      navigate("/login");
    } else {
      fetchAppointments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      console.log("🔵 Fetching pharmacist appointments...");
      const data = await getPharmacistAppointments(user.token);
      setAppointments(data);
    } catch (error) {
      console.error(
        "❌ Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="pharmacist-dashboard glass-card">
      <h1>Welcome, {user?.name || "Pharmacist"}</h1>
      <h2>Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              Patient: {appointment.patient?.name} <br />
              Date: {new Date(appointment.date).toLocaleString()} <br />
              Location: {appointment.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PharmacistDashboard;
