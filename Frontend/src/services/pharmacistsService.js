import axios from "axios";
import { getPendingPrescriptions, approvePrescription, rejectPrescription } from "./prescriptionService";

const API_URL = "http://localhost:5000/api/pharmacist";

// ✅ Fetch upcoming appointments
export const getPatientAppointments = async (token) => {
  const response = await axios.get(`${API_URL}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const getPharmacistAppointments = async (token) => {
  const response = await axios.get("http://localhost:5000/api/pharmacist/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const confirmAppointment = async (id, token) => {
  const response = await axios.put(`${API_URL}/appointments/${id}/confirm`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const rejectAppointment = async (id, token) => {
  const response = await axios.put(`${API_URL}/appointments/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const rescheduleAppointment = async (id, newDate, token) => {
  try {
    console.log(`🔄 Sending reschedule request for appointment ID: ${id}, New Date: ${newDate}`);

    const response = await axios.put(
      `http://localhost:5000/api/pharmacist/appointments/${id}/reschedule`,
      { newDate }, // ✅ Ensure newDate is in request body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Appointment rescheduled:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error rescheduling appointment:", error.response?.data || error.message);
    throw error;
  }
};

export const cancelAppointment = async (id, token) => {
  return await axios.put(`${API_URL}/appointments/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// 📌 Fetch all pending prescriptions

export const fetchPendingPrescriptions = async (token) => {
  return await getPendingPrescriptions(token);
};


  

// 📌 Approve a prescription
export const approvePrescriptionRequest = async (id, token) => {
  return await approvePrescription(id, token);
};

// 📌 Reject a prescription

export const rejectPrescriptionRequest = async (id, token) => {
  return await rejectPrescription(id, token);
};




// ✅ Fetch inventory details
export const getInventory = async (token) => {
  const response = await axios.get(`${API_URL}/inventory`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



