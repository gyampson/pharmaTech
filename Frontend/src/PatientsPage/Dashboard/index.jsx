import { useEffect, useState } from "react";
import {
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
} from "../../services/patientService";
import io from "socket.io-client";
import "./PatientsDashboard.css"; // ✅ Now using the scoped styleFs
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});
const PatientDashboard = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userData") || "{}");
  });
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || [] // ✅ Load saved notifications
  );

  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    date: "",
    location: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
  
    if (!storedUser?.token || storedUser.role !== "patient") {
      console.error("❌ No valid token found. Redirecting to login...");
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchAppointments();
    }
  
    // ✅ Load previous notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);
  
    if (storedUser?.id) {
      console.log(`🔵 Listening for notifications on: appointmentUpdate-${storedUser.id}`);
  
      const handleNotification = (update) => {
        console.log("🔔 New notification received:", update);
  
        // ✅ Update the UI with the new appointment status
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === update.id ? { ...appointment, status: update.status } : appointment
          )
        );
  
        // ✅ Add the new notification & store in localStorage
        setNotifications((prev) => {
          const newNotifications = [...prev, update.message];
          localStorage.setItem("notifications", JSON.stringify(newNotifications));
          return newNotifications;
        });
      };
  
      // ✅ Attach socket listener (avoiding duplicates)
      socket.off(`appointmentUpdate-${storedUser.id}`).on(`appointmentUpdate-${storedUser.id}`, handleNotification);
    }
  
    // ✅ Cleanup function to remove socket listener when component unmounts
    return () => {
      if (storedUser?.id) {
        socket.off(`appointmentUpdate-${storedUser.id}`);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  
 // ✅ Function to clear all notifications
 const clearNotifications = () => {
  setNotifications([]);
  localStorage.removeItem("notifications");
};

// ✅ Function to remove a single notification
const removeNotification = (index) => {
  const updatedNotifications = notifications.filter((_, i) => i !== index);
  setNotifications(updatedNotifications);
  localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
};


  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000); // Hide after 3 seconds
  };

  const fetchAppointments = async () => {
    try {
      console.log("🔵 Fetching scheduled appointments...");
      const data = await getPatientAppointments(user.token);

      // ✅ Filter out canceled appointments
      const scheduledAppointments = data.filter(
        (appointment) => appointment.status === "scheduled"
      );

      setAppointments(scheduledAppointments); // ✅ Update state with only scheduled appointments
      localStorage.setItem(
        "appointments",
        JSON.stringify(scheduledAppointments)
      ); // ✅ Persist only scheduled ones
    } catch (error) {
      console.error(
        "❌ Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      console.error("❌ No token found!");
      showNotification("Authentication error.", "error");
      return;
    }

    try {
      const response = await bookAppointment(formData, user.token);
      setAppointments([...appointments, response.newAppointment]); // Update UI
      setFormData({ doctor: "", specialty: "", date: "", location: "" }); // Clear form
      showNotification("Appointment booked successfully!", "success");
    } catch (error) {
      console.error(
        "❌ Error booking appointment:",
        error.response?.data || error.message
      );
      showNotification("Failed to book appointment.", "error");
    }
  };
  const handleCancelAppointment = async (id) => {
    try {
      await cancelAppointment(id, user.token);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      ); // Remove cancelled appointment
    } catch (error) {
      console.error(
        "❌ Error cancelling appointment:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="booking-page ">
      {/* ✅ Notification Component */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="notifications glass-card">
        <h2>Notifications</h2>

        {/* ✅ "Clear All" Button */}
        {notifications.length > 0 && (
          <button onClick={clearNotifications} className="clear-btn btn-primary">
            Clear All Notifications
          </button>
        )}

        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul>
            {notifications.map((notif, index) => (
              <li key={index} className="notif-item">
                {notif}
                {/* ✅ Remove Single Notification Button */}
                <button onClick={() => removeNotification(index)} className="remove-btn btn-secondary">
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <header className="booking-header shine">
        <h1> {user?.name || "Patient"} &rsquo;s Appointments </h1>
        <p>Manage your appointments</p>
      </header>

      <section className="booking-form shine">
        <h2>Book an Appointment</h2>
        <form onSubmit={handleBookingSubmit}>
          <label htmlFor="doctor">Doctor&apos;s Name</label>
          <input
            id="doctor"
            type="text"
            placeholder="Enter doctor's name"
            className="form-control"
            value={formData.doctor}
            onChange={(e) =>
              setFormData({ ...formData, doctor: e.target.value })
            }
            required
          />

          <label htmlFor="specialty">Specialty</label>
          <input
            id="specialty"
            type="text"
            placeholder="e.g., Cardiology, Dermatology"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            required
          />

          <label htmlFor="date">Date & Time</label>
          <input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="Clinic location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />

          <button className="btn btn-primary " type="submit">
            Book Appointment
          </button>
        </form>
      </section>

      <section className="appointments-list shine ">
        <h2>Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-card">
                <div>
                  <h3>{appointment.doctor}</h3>
                  <p>{appointment.specialty}</p>
                  <p>{new Date(appointment.date).toLocaleString()}</p>
                  <p>{appointment.location}</p>
                </div>
                <button
                  className="btn btn-secondary "
                  onClick={() =>
                    handleCancelAppointment(appointment._id, user.token)
                  }
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;
