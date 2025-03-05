import axios from "axios";

const API_URL = "http://localhost:5000/api/pharmacist";

// ✅ Fetch pending prescriptions
export const getPendingPrescriptions = async (token) => {
  const response = await axios.get(`${API_URL}/prescriptions/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
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

// ✅ Approve a prescription refill
export const approvePrescription = async (id, token) => {
  const response = await axios.patch(`${API_URL}/prescriptions/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Reject a prescription refill
export const rejectPrescription = async (id, token) => {
  const response = await axios.patch(`${API_URL}/prescriptions/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Fetch inventory details
export const getInventory = async (token) => {
  const response = await axios.get(`${API_URL}/inventory`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
