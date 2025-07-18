
import { getPatientPrescriptions, requestRefill, markMedicationTaken } from "./prescriptionService";
import axios from "axios";


// ✅ Now, you can call `getPatientPrescriptions(token)` instead of defining it again

const API_URL = "https://pharmatech-yepi.onrender.com/api/patient";


export const fetchPrescriptionsForUser = async (token) => {
  return await getPatientPrescriptions(token);
};
export const refillPrescription = async (id, token) => {
  return await requestRefill(id, token);
};

export const markMedicationAsTaken = async (id, token) => {
  return await markMedicationTaken(id, token);
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
    "https://pharmatech-yepi.onrender.com/api/patient/appointments/book",
    appointmentData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


export const cancelAppointment = async (id, token) => {
  const response = await axios.delete(
    `https://pharmatech-yepi.onrender.com/api/patient/appointments/${id}/cancel`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};




