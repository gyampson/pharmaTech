import axios from "axios";

const API_URL = "http://localhost:5000/api/patient";

// ✅ Fetch patient's prescriptions
export const getPatientPrescriptions = async (token) => {
  const response = await axios.get(`${API_URL}/prescriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Mark medication as taken
export const markMedicationTaken = async (id, token) => {
  const response = await axios.patch(`${API_URL}/medications/${id}/taken`, {}, {
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

export const bookAppointment = async (appointmentData, token) => {
  const response = await axios.post(
    "http://localhost:5000/api/patient/appointments/book",
    appointmentData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ✅ Request a prescription refill
export const requestRefill = async (id, token) => {
  const response = await axios.post(`${API_URL}/prescriptions/${id}/refill`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
