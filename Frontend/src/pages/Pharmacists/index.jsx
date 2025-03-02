import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingPrescriptions,
  approvePrescription,
  rejectPrescription,
  getInventory,
} from "../../services/pharmacistsService";
import { Pill} from "lucide-react";
// import { mockInventory, mockPatients, mockPrescriptions } from "../../data";
import { format } from "date-fns";
import Sidebar from "../../Components/Sidebar";
import "./Pharmacists.css";
const PharmacistDashboard = () => {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    if (!storedUser || storedUser.role !== "pharmacist") {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchPrescriptions(storedUser.token);
      fetchInventory(storedUser.token);
    }
  }, [navigate]);

  const fetchPrescriptions = async (token) => {
    try {
      const data = await getPendingPrescriptions(token);
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchInventory = async (token) => {
    try {
      const data = await getInventory(token);
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const updatedPrescription = await approvePrescription(id, user.token);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? updatedPrescription.prescription : p))
      );
    } catch (error) {
      console.error("Error approving prescription:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const updatedPrescription = await rejectPrescription(id, user.token);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? updatedPrescription.prescription : p))
      );
    } catch (error) {
      console.error("Error rejecting prescription:", error);
    }
  };

  return (
    <div className=" ">  
    <Sidebar />
    <div className="pharmacists-container glass-card">
      <h1>Welcome,   Dr.  {user?.name} </h1>
      
      {/* ✅ Display Inventory Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Pill size={24} />
          </div>
          <div className="stat-value">{inventory.length}</div>
          <div className="stat-label">Medications in Stock</div>
        </div>
      </div>

      {/* ✅ Display Pending Prescriptions */}
      <h2>Pending Prescriptions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Request Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription._id}>
              <td>{prescription.patient.name}</td>
              <td>{prescription.medication}</td>
              <td>{prescription.dosage}</td>
              <td>
                {format(new Date(prescription.requestDate), "MMM d, yyyy")}
              </td>
              <td>{prescription.status}</td>
              <td>
                {prescription.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(prescription._id)}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(prescription._id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PharmacistDashboard;
