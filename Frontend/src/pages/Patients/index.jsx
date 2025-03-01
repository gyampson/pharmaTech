import { useEffect, useState } from "react";
import "./Patients.css"
import { useNavigate } from "react-router-dom";
import {
  Pill,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

// Mock data
const mockPrescriptions = [
  {
    id: "1",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 6, 15),
    refillsRemaining: 2,
    status: "active",
    nextRefillDate: new Date(2023, 5, 30),
    pharmacy: "MediCare Pharmacy",
    prescribedBy: "Dr. Sarah Johnson",
  },
  {
    id: "2",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: new Date(2023, 4, 10),
    endDate: new Date(2023, 10, 10),
    refillsRemaining: 5,
    status: "active",
    nextRefillDate: new Date(2023, 6, 10),
    pharmacy: "MediCare Pharmacy",
    prescribedBy: "Dr. Michael Chen",
  },
  {
    id: "3",
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    startDate: new Date(2023, 3, 5),
    endDate: new Date(2023, 9, 5),
    refillsRemaining: 0,
    status: "expired",
    nextRefillDate: null,
    pharmacy: "HealthPlus Pharmacy",
    prescribedBy: "Dr. Sarah Johnson",
  },
];

const mockAppointments = [
  {
    id: "1",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: new Date(2023, 6, 15, 10, 30),
    location: "Heart Health Clinic",
    status: "scheduled",
  },
  {
    id: "2",
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: new Date(2023, 6, 22, 14, 15),
    location: "Community Medical Center",
    status: "scheduled",
  },
];

const PatientDashboard = () => {
  const [user, setUser] = useState(null);

  const [prescriptions, ] = useState(mockPrescriptions);
  const [appointments,] = useState(mockAppointments);
  const [upcomingMedications, setUpcomingMedications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (!userData || userData.role !== "patient") {
      navigate("/login"); // Redirect if not a patient
    } else {
      setUser(userData);
    }

    // Calculate upcoming medications for today
    
    const activePrescriptions = prescriptions.filter(
      (p) => p.status === "active"
    );

    // This is a simplified example - in a real app, you'd have more complex logic
    // for medication schedules based on frequency
    const medications = [];

    for (const prescription of activePrescriptions) {
      if (prescription.frequency.includes("3 times daily")) {
        medications.push({
          id: `${prescription.id}-1`,
          medication: prescription.medication,
          dosage: prescription.dosage,
          time: "8:00 AM",
          taken: false,
        });
        medications.push({
          id: `${prescription.id}-2`,
          medication: prescription.medication,
          dosage: prescription.dosage,
          time: "2:00 PM",
          taken: false,
        });
        medications.push({
          id: `${prescription.id}-3`,
          medication: prescription.medication,
          dosage: prescription.dosage,
          time: "8:00 PM",
          taken: false,
        });
      } else if (prescription.frequency.includes("Once daily")) {
        medications.push({
          id: `${prescription.id}-1`,
          medication: prescription.medication,
          dosage: prescription.dosage,
          time: "9:00 AM",
          taken: false,
        });
      }
    }

    setUpcomingMedications(medications);
  }, [navigate, prescriptions]);

  const handleMedicationTaken = (id) => {
    setUpcomingMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: true } : med))
    );
  };

  const handleRequestRefill = (id) => {
    // In a real app, this would send a request to the backend
    alert(`Refill requested for prescription #${id}`);
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
        }}
      >
        Welcome, {user?.name || "Patient"}
      </h1>

      <div className="stats-grid">
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
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Today&apos;s Medications</h2>
            <span className="badge badge-info">
              {upcomingMedications.filter((m) => !m.taken).length} remaining
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {upcomingMedications.length === 0 ? (
              <div style={{ padding: "1.25rem", textAlign: "center" }}>
                <p>No medications scheduled for today.</p>
              </div>
            ) : (
              upcomingMedications.map((med) => (
                <div
                  key={med.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid var(--gray-200)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "0.375rem",
                      backgroundColor: med.taken
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(79, 70, 229, 0.1)",
                      color: med.taken ? "var(--secondary)" : "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                    }}
                  >
                    {med.taken ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600" }}>
                      {med.medication} ({med.dosage})
                    </div>
                    <div
                      style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}
                    >
                      {med.time}
                    </div>
                  </div>
                  {!med.taken && (
                    <button
                      className="btn btn-outline"
                      onClick={() => handleMedicationTaken(med.id)}
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header">
              <h2 className="card-title">Upcoming Appointments</h2>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {appointments.length === 0 ? (
                <div style={{ padding: "1.25rem", textAlign: "center" }}>
                  <p>No upcoming appointments.</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid var(--gray-200)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Calendar
                        size={16}
                        style={{
                          color: "var(--primary)",
                          marginRight: "0.5rem",
                        }}
                      />
                      <span style={{ fontWeight: "600" }}>
                        {format(appointment.date, "MMMM d, yyyy")}
                      </span>
                      <span
                        style={{
                          marginLeft: "0.75rem",
                          fontSize: "0.875rem",
                          color: "var(--gray-600)",
                        }}
                      >
                        {format(appointment.date, "h:mm a")}
                      </span>
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: "500" }}>
                        {appointment.doctor}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--gray-600)",
                          marginLeft: "0.5rem",
                        }}
                      >
                        ({appointment.specialty})
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--gray-600)",
                      }}
                    >
                      {appointment.location}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="card-footer">
              <button className="btn btn-outline">View All</button>
              <button className="btn btn-primary">Schedule New</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Health Records</h2>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--gray-50)",
                    textDecoration: "none",
                    color: "var(--gray-700)",
                  }}
                >
                  <FileText size={20} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontWeight: "500" }}>Lab Results</div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}
                    >
                      Last updated: June 10, 2023
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--gray-50)",
                    textDecoration: "none",
                    color: "var(--gray-700)",
                  }}
                >
                  <FileText size={20} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontWeight: "500" }}>Medical History</div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}
                    >
                      Last updated: May 22, 2023
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--gray-50)",
                    textDecoration: "none",
                    color: "var(--gray-700)",
                  }}
                >
                  <FileText size={20} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontWeight: "500" }}>Vaccination Records</div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}
                    >
                      Last updated: April 15, 2023
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <h2 className="card-title">My Prescriptions</h2>
          <button className="btn btn-outline">View All</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Refills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td style={{ fontWeight: "500" }}>
                      {prescription.medication}
                    </td>
                    <td>{prescription.dosage}</td>
                    <td>{prescription.frequency}</td>
                    <td>{prescription.refillsRemaining}</td>
                    <td>
                      <span
                        className={`badge ${
                          prescription.status === "active"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {prescription.status === "active"
                          ? "Active"
                          : "Expired"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem" }}
                          onClick={() =>
                            navigate(`/prescriptions/${prescription.id}`)
                          }
                        >
                          Details
                        </button>
                        {prescription.status === "active" &&
                          prescription.refillsRemaining > 0 && (
                            <button
                              className="btn btn-primary"
                              style={{ padding: "0.25rem 0.5rem" }}
                              onClick={() =>
                                handleRequestRefill(prescription.id)
                              }
                            >
                              Request Refill
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
