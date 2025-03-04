import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientPrescriptions, getPatientAppointments } from "../../services/patientService";
import { Pill, Calendar, RefreshCw, AlertCircle } from "lucide-react";

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    if (!storedUser || storedUser.role !== "patient") {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchData(storedUser.token);
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      setLoading(true);
      const [prescriptionData, appointmentData] = await Promise.all([
        getPatientPrescriptions(token),
        getPatientAppointments(token),
      ]);
      setPrescriptions(prescriptionData);
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
     
      <div className="stats-grid glass-card">
        <h1>Welcome, {user?.name || "Patient"}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon stat-primary">
                <Pill size={24} />
              </div>
              <div className="stat-value">
                {prescriptions.filter((p) => p.status === "active").length}
              </div>
              <div className="stat-label">Active Prescriptions</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-secondary">
                <Calendar size={24} />
              </div>
              <div className="stat-value">{appointments.length}</div>
              <div className="stat-label">Upcoming Appointments</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-warning">
                <RefreshCw size={24} />
              </div>
              <div className="stat-value">
                {prescriptions.filter((p) => p.refillsRemaining > 0).length}
              </div>
              <div className="stat-label">Available Refills</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-danger">
                <AlertCircle size={24} />
              </div>
              <div className="stat-value">
                {prescriptions.filter((p) => p.status === "expired").length}
              </div>
              <div className="stat-label">Expired Prescriptions</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
