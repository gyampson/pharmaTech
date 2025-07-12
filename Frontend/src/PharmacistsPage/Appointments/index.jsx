import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPharmacistAppointments, confirmAppointment, rejectAppointment, rescheduleAppointment, cancelAppointment } from "../../services/pharmacistsService";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react";
import "./Appointments.css";
import io from "socket.io-client";

const socket = io("https://pharmatech-yepi.onrender.com", { transports: ["websocket", "polling"] });
const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("userData") || "{}"));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleDate, setRescheduleDate] = useState("");

  useEffect(() => {
    if (!user?.token || user.role !== "pharmacist") {
      console.error("❌ No valid token found. Redirecting to login...");
      navigate("/login");
    } else {
      fetchAppointments(); // ✅ Fetch appointments on page load
    }
  
    // ✅ Listen for real-time updates from the backend
    socket.on("appointmentUpdate", (update) => {
      console.log("🔔 New appointment update received:", update);
  
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === update.id ? { ...appointment, status: update.status } : appointment
        )
      );
    });
  
    // ✅ Cleanup function to remove the event listener
    return () => socket.off("appointmentUpdate");
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user?.token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getPharmacistAppointments(user.token);
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      console.log("🔵 Confirming appointment ID:", id);
      const response = await confirmAppointment(id, user.token);
      console.log("✅ Appointment confirmed:", response);
  
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status: "confirmed" } : appointment
        )
      );
    } catch (error) {
      console.error("❌ Error confirming appointment:", error);
    }
  };
  
  const handleReject = async (id) => {
    try {
      console.log("🔴 Rejecting appointment ID:", id);
      const response = await rejectAppointment(id, user.token);
      console.log("✅ Appointment rejected:", response);
  
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status: "rejected" } : appointment
        )
      );
    } catch (error) {
      console.error("❌ Error rejecting appointment:", error);
    }
  };
  
  const handleReschedule = async (id) => {
    try {
      if (!rescheduleDate) {
        console.error("❌ No new date provided for rescheduling.");
        return;
      }
  
      console.log("🔄 Rescheduling appointment ID:", id, "New Date:", rescheduleDate);
      
      const response = await rescheduleAppointment(id, rescheduleDate, user.token);
      console.log("✅ Appointment rescheduled:", response);
  
      // ✅ Update only the selected appointment
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status: "rescheduled", date: rescheduleDate } : appointment
        )
      );
  
      // ✅ Ensure `setNotifications` is defined before calling
      // eslint-disable-next-line no-undef
      if (setNotifications) {
        // eslint-disable-next-line no-undef
        setNotifications((prev) => {
          const newNotifications = [
            ...prev,
            `🔄 Your appointment on ${new Date(rescheduleDate).toLocaleString()} has been rescheduled.`,
          ];
          localStorage.setItem("notifications", JSON.stringify(newNotifications));
          return newNotifications;
        });
      } else {
        console.warn("⚠️ setNotifications is not available.");
      }
  
      console.log("📢 Sending real-time notification...");
    } catch (error) {
      console.error("❌ Error rescheduling appointment:", error.response?.data?.message || error.message);
    }
  };
  
  const handleCancel = async (id) => {
    try {
      console.log("🛑 Cancelling appointment ID:", id);
      const response = await cancelAppointment(id, user.token);
      console.log("✅ Appointment cancelled:", response);
  
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status: "cancelled" } : appointment
        )
      );
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
    }
  };
  
  return (
    <div className="pharmacist-dashboard">
      <header className="dashboard-header shine">
        <h1>Welcome, {user?.name || "Pharmacist"}</h1>
        <p>Your Appointments Dashboard</p>
      </header>

      <main className="appointments-container">
        <h2 className="section-title shine">Booked Appointments</h2>

        {loading ? (
          <div className="loading-container">
            <p>Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <p className="empty-state">No upcoming appointments</p>
        ) : (
          <ul className="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <User className="icon" />
                  <span>{appointment.patient?.name}</span>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <Calendar className="icon" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="icon" />
                    <span>{new Date(appointment.date).toLocaleTimeString()}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin className="icon" />
                    <span>{appointment.location}</span>
                  </div>
                </div>

                <div className="appointment-actions">
  <button className="confirm-btn" onClick={() => handleConfirm(appointment._id)}>
    <CheckCircle /> Confirm
  </button>
  
  <button className="reject-btn" onClick={() => handleReject(appointment._id)}>
    <XCircle /> Reject
  </button>
  
  <input
    type="datetime-local"
    value={rescheduleDate}
    onChange={(e) => setRescheduleDate(e.target.value)}
  />
  
  <button className="reschedule-btn" onClick={() => handleReschedule(appointment._id)}>
    <RefreshCw /> Reschedule
  </button>
  
  <button className="cancel-btn" onClick={() => handleCancel(appointment._id)}>
    <Trash2 /> Cancel
  </button>
</div>

              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default PharmacistDashboard;
