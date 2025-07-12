import axios from "axios";

const API_URL = "https://pharmatech-yepi.onrender.com/api/prescriptions"; // ✅ Corrected API URL

// ✅ Fetch patient prescriptions
export const getPatientPrescriptions = async (token) => {
  const response = await axios.get(`${API_URL}/patient`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// ✅ Fetch pending prescriptions for a pharmacist
export const getPendingPrescriptions = async (token) => {
  const response = await axios.get(`${API_URL}/pharmacist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
// ✅ Mark medication as taken (patient action)
export const markMedicationTaken = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/taken`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Request a prescription refill
export const requestRefill = async (id, token) => {
  const response = await axios.post(`${API_URL}/${id}/refill`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Approve a prescription
export const approvePrescription = async (id, token) => {
  const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Reject a prescription
export const rejectPrescription = async (id, reason, token) => {
  const response = await axios.put(
    `${API_URL}/${id}/reject`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


export const requestPrescription = async (prescriptionData, token) => {
  const response = await axios.post(`${API_URL}/request`, prescriptionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
