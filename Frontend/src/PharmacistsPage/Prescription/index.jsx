import { useEffect, useState } from "react";
import {
  getPatientPrescriptions,
  requestPrescription,
} from "../../services/prescriptionService";
import { io } from "socket.io-client";
import "./Prescription.css";

const socket = io("https://pharmatech-yepi.onrender.com");

const PatientPrescriptions = () => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userData") || "{}")
  );
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // Fetch Prescriptions
  useEffect(() => {
    setLoading(true);

    const fetchPrescriptions = async () => {
      if (!user?.token) return;
      try {
        console.log("🔵 Fetching prescriptions...");
        const data = await getPatientPrescriptions(user.token);
        setPrescriptions(data);
      } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions(); // Fetch prescriptions on mount

    if (user?.id) {
      socket.on(`prescriptionUpdate-${user.id}`, (update) => {
        console.log("🔔 New notification received:", update);

        // ✅ Update prescriptions in UI
        setPrescriptions((prev) =>
          prev.map((p) =>
            p._id === update.id
              ? {
                  ...p,
                  status: update.status,
                  rejectReason: update.rejectReason || "No reason provided",
                }
              : p
          )
        );

        // ✅ Show notification
        setNotification({ show: true, message: update.message });

        // ✅ Hide notification after 3 seconds
        setTimeout(() => setNotification({ show: false, message: "" }), 3000);
      });
    }

    return () => socket.off(`prescriptionUpdate-${user.id}`);
  }, [user]);

  // Prescription Request Form
  const [formData, setFormData] = useState({
    doctor: "",
    medication: "",
    dosage: "",
    frequency: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPrescription(formData, user.token);
      setFormData({ doctor: "", medication: "", dosage: "", frequency: "" });
      setNotification({
        show: true,
        message: "✅ Prescription request sent successfully!",
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (error) {
      setNotification({ show: true, message: "❌ Failed to send request." });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    }
  };

  return (
    <div className="patient-prescriptions glass-card">
      <h2>📜 Your Prescriptions</h2>

      {/* ✅ Loading Indicator */}
      {loading ? (
        <p className="loading-text">Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul className="prescription-list">
          {prescriptions.map((p) => (
            <li key={p._id} className="prescription-item">
              <p>
                <strong>Medication:</strong> {p.medication}
              </p>
              <p>
                <strong>Dosage:</strong> {p.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {p.frequency}
              </p>
              <p>
                <strong>Status:</strong> {p.status}
              </p>
              {p.status === "rejected" && (
                <p className="reject-reason">
                  <strong>Rejection Reason:</strong> {p.rejectReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Prescription Request Form */}
      <div className="request-form">
        <h3>📝 Request a Prescription</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="doctor"
            placeholder="Doctor's Name"
            value={formData.doctor}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="medication"
            placeholder="Medication"
            value={formData.medication}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dosage"
            placeholder="Dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="frequency"
            placeholder="Frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Request</button>
        </form>
      </div>

      {/* ✅ Notification Popup */}
      {notification.show && (
        <div className="notification-popup">{notification.message}</div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
