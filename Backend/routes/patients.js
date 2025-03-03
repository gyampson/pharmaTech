import express from "express";
import { protect, patientOnly } from "../middleware/authMiddleware.js";
import { getPatientPrescriptions, markMedicationTaken, requestRefill,getPatientAppointments, bookAppointment, cancelAppointments } from "../controllers/patientController.js";

const router = express.Router();

// ✅ Get patient's prescriptions
router.get("/prescriptions", protect, patientOnly, getPatientPrescriptions);

// ✅ Mark medication as taken
router.patch("/medications/:id/taken", protect, patientOnly, markMedicationTaken);

// ✅ Get upcoming appointments
router.get("/appointments", protect, patientOnly, getPatientAppointments);

// ✅ Book a new appointment
router.post("/appointments/book", protect, patientOnly, bookAppointment);

// ✅ Cancel an appointment
router.delete("/appointments/:id/cancel", protect, patientOnly, cancelAppointments);

// ✅ Request a prescription refill
router.post("/prescriptions/:id/refill", protect, patientOnly, requestRefill);

export default router;
