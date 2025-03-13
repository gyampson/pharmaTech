import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";
import {
  getPendingPrescriptions,
  approvePrescription,
  rejectPrescription,
} from "../../services/prescriptionService";
import { useNavigate } from "react-router-dom";
import "./Prescription.css";

// Initialize Socket.io connection
const socket = io("http://localhost:5000");

function PharmacistPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userData") || "{}")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingPrescriptionId, setRejectingPrescriptionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!storedUser?.token || storedUser.role !== "pharmacist") {
      console.error("❌ No valid token found. Redirecting to login...");
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchPrescriptions(storedUser.token);
    }

    if (storedUser?.id) {
      console.log(
        `🔵 Listening for notifications on: prescriptionUpdate-${storedUser.id}`
      );

      const handleNotification = (update) => {
        console.log("🔔 New notification received:", update);

        setNotifications((prev) => [...prev, update.message]);

        setNotificationMessage(update.message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
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
  }, [navigate]);

  const fetchPrescriptions = async (token) => {
    try {
      console.log("🔵 Fetching prescriptions...");

      const data = await getPendingPrescriptions(token);
      console.log("✅ Prescriptions fetched:", data);

      setPrescriptions(data);
    } catch (err) {
      console.error(
        "❌ Error fetching prescriptions:",
        err.response?.data || err.message
      );
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, patientId) => {
    try {
      await approvePrescription(id);
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
      );

      // Emit real-time notification to the patient
      socket.emit("prescriptionUpdate", {
        userId: patientId,
        message: "✅ Your prescription has been approved!",
      });

      triggerNotification("Prescription approved successfully");
    } catch (error) {
      triggerNotification("Failed to approve prescription", "error");
    }
  };

  const handleReject = async (id, patientId) => {
    if (!rejectReason) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectPrescription(id, rejectReason);
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "rejected", rejectReason } : p
        )
      );

      // Emit real-time notification to the patient
      socket.emit("prescriptionUpdate", {
        userId: patientId,
        message: `❌ Your prescription request was rejected. Reason: ${rejectReason}`,
      });

      triggerNotification("Prescription rejected successfully");
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      triggerNotification("Failed to reject prescription", "error");
    }
  };

  // Function to trigger pop-up notification
  const triggerNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && prescription.status === selectedFilter;
  });

  return (
    <div className="app glass-card">
      {/* ✅ Pop-up Notification */}
      {showNotification && (
        <div className="popup-notification">{notificationMessage}</div>
      )}

      <header className="header glass-card">
        <h1>Pharmacy Prescription Management</h1>
        <div className="stats">
          <div className="stat">
            <Clock size={20} />
            <span>
              Pending:{" "}
              {prescriptions.filter((p) => p.status === "pending").length}
            </span>
          </div>
          <div className="stat">
            <CheckCircle2 size={20} />
            <span>
              Approved:{" "}
              {prescriptions.filter((p) => p.status === "approved").length}
            </span>
          </div>
          <div className="stat">
            <XCircle size={20} />
            <span>
              Rejected:{" "}
              {prescriptions.filter((p) => p.status === "rejected").length}
            </span>
          </div>
        </div>
      </header>

      <div className="prescriptions">
        {filteredPrescriptions.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No prescriptions found</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <h3>{prescription.medication}</h3>
              <span className={`status ${prescription.status}`}>
                {prescription.status}
              </span>
              <button
                onClick={() =>
                  handleApprove(prescription.id, prescription.patient.id)
                }
              >
                ✅ Approve
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(true);
                  setRejectingPrescriptionId(prescription.id);
                }}
              >
                ❌ Reject
              </button>
            </div>
          ))
        )}
      </div>

      {showRejectModal && (
        <div className="modal">
          <h3>Provide a reason for rejection</h3>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>
          <button onClick={() => handleReject(rejectingPrescriptionId)}>
            Submit
          </button>
          <button onClick={() => setShowRejectModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PharmacistPrescriptions;
