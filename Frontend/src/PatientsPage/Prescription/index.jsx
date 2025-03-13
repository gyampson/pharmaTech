import { useState, useEffect } from "react";
import { requestPrescription } from "../../services/prescriptionService";
import "./Prescription.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Connect to backend Socket.io server

function RequestPrescription() {
  const [formData, setFormData] = useState({
    doctor: "",
    medication: "",
    dosage: "",
    frequency: "",
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userData") || "{}");
  });

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // ✅ Listen for prescription updates via Socket.io
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");

    if (storedUser?.id) {
      console.log(
        `🔵 Listening for notifications on: prescriptionUpdate-${storedUser.id}`
      );

      const handleNotification = (update) => {
        console.log("🔔 New notification received:", update);

        // ✅ Add notification & store in localStorage
        setNotifications((prev) => {
          const newNotifications = [...prev, update.message];
          localStorage.setItem(
            "notifications",
            JSON.stringify(newNotifications)
          );
          return newNotifications;
        });

        // ✅ Show pop-up notification
        setNotification({
          show: true,
          message: update.message,
          type: "success",
        });
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
      };

      socket
        .off(`prescriptionUpdate-${storedUser.id}`)
        .on(`prescriptionUpdate-${storedUser.id}`, handleNotification);
    }

    return () => {
      if (storedUser?.id) {
        socket.off(`prescriptionUpdate-${storedUser.id}`);
      }
    };
  }, []);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle prescription request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPrescription(formData, user?.token);
      showNotification("✅ Prescription request sent successfully!", "success");
      setFormData({ doctor: "", medication: "", dosage: "", frequency: "" });
    } catch (error) {
      showNotification("❌ Failed to send request.", "error");
    }
  };

  // ✅ Show pop-up notification function
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

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

  return (
    <div className="container-prescription">
      {/* ✅ Pop-up Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {/* ✅ Notifications Section */}
      <div className="notifications glass-card">
        <h2>Notifications</h2>

        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="clear-btn btn-primary"
          >
            Clear All Notifications
          </button>
        )}

        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notif, index) => (
              <li key={index} className="notif-item">
                {notif}
                {/* ✅ Remove Single Notification Button */}
                <button
                  onClick={() => removeNotification(index)}
                  className="remove-btn btn-secondary"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="prescription-card ">
        <h1>Request a Prescription</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctor">Doctor&apos;s Name</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              placeholder="Enter doctor's name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medication">Medication</label>
            <input
              type="text"
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
              placeholder="Enter medication name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dosage">Dosage</label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              placeholder="Enter dosage (e.g., 50mg)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency</label>
            <input
              type="text"
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              placeholder="Enter frequency (e.g., twice daily)"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestPrescription;
