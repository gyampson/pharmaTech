import { useState, useEffect } from "react";
import {
  requestPrescription,
  getPatientPrescriptions,
} from "../../services/prescriptionService";
import io from "socket.io-client";
import "./Prescription.css";

const socket = io("https://pharmatech-yepi.onrender.com"); // ✅ Connect to backend socket

function PatientPrescriptions() {
  const [formData, setFormData] = useState({
    doctor: "",
    medication: "",
    dosage: "",
    frequency: "",
  });

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userData") || "{}")
  );
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (!user?.token) {
      console.error("❌ No valid token found.");
      return;
    }

    const fetchPrescriptions = async () => {
      try {
        console.log("🔵 Fetching prescriptions...");
        setLoading(true);
        const data = await getPatientPrescriptions(user.token);
        setPrescriptions(data);
      } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions(); // ✅ Fetch prescriptions on component mount

    // ✅ Handle real-time updates from pharmacist
    if (user?.id) {
      console.log(
        `🔵 Listening for prescription updates on: prescriptionUpdate-${user.id}`
      );

      const handlePrescriptionUpdate = (update) => {
        console.log("🔔 New notification received:", update);

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

        // ✅ Show pop-up notification
        setNotification({ show: true, message: update.message });

        // ✅ Hide notification after 3 seconds
        setTimeout(() => setNotification({ show: false, message: "" }), 3000);
      };

      socket.on(`prescriptionUpdate-${user.id}`, handlePrescriptionUpdate);

      // ✅ Cleanup function to remove listener when component unmounts
      return () => {
        console.log("🔴 Removing socket listener for prescription updates.");
        socket.off(`prescriptionUpdate-${user.id}`, handlePrescriptionUpdate);
      };
    }
  }, [user?.token, user?.id]); // ✅ Added `user?.id` to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      console.error("❌ No valid token found.");
      return;
    }

    try {
      console.log("🟢 Sending prescription request...");
      await requestPrescription(formData, user.token);

      // ✅ Clear the form after submission
      setFormData({ doctor: "", medication: "", dosage: "", frequency: "" });

      // ✅ Show success notification
      setNotification({
        show: true,
        message: "✅ Prescription request sent successfully!",
      });

      // ✅ Hide notification after 3 seconds
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);

      // ✅ Refresh prescriptions
      fetchPrescriptions();
    } catch (error) {
      console.error("❌ Error sending prescription request:", error);
      setNotification({ show: true, message: "❌ Failed to send request." });

      // ✅ Hide error notification after 3 seconds
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    }
  };

  return (
    <div className="prescription-container">
      {notification.show && <div className="popup">{notification.message}</div>}

      <h1>Prescription Requests</h1>
      <form onSubmit={handleSubmit} className="prescription-form">
        <input
          type="text"
          name="doctor"
          placeholder="Doctor's Name"
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          required
        />
        <input
          type="text"
          name="medication"
          placeholder="Medication"
          value={formData.medication}
          onChange={(e) =>
            setFormData({ ...formData, medication: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          required
        />
        <input
          type="text"
          name="frequency"
          placeholder="Frequency"
          value={formData.frequency}
          onChange={(e) =>
            setFormData({ ...formData, frequency: e.target.value })
          }
          required
        />
        <button type="submit" className="btn btn-primary">
          Request Prescription
        </button>
      </form>

      <h2>My Prescriptions</h2>
      {loading ? (
        <p>Loading prescriptions...</p>
      ) : (
        <ul className="prescription-list">
          {prescriptions.map((prescription) => (
            <li key={prescription._id} className="prescription-item">
              <h3>🩺 {prescription.medication}</h3>
              <p>
                <strong>Doctor:</strong> {prescription.doctor}
              </p>
              <p>
                <strong>Dosage:</strong> {prescription.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {prescription.frequency}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={prescription.status}>
                  {prescription.status}
                </span>
              </p>

              {/* ✅ Show rejection reason if prescription is rejected */}
              {prescription.status === "rejected" && (
                <p className="rejected">
                  <strong>Reason:</strong>{" "}
                  {prescription.rejectReason || "No reason provided"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientPrescriptions;
