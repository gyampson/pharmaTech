import axios from "axios";

const API_URL = "http://localhost:5000/api/pharmacist";

// ✅ Fetch pending prescriptions
export const getPendingPrescriptions = async (token) => {
  const response = await axios.get(`${API_URL}/prescriptions/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
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
