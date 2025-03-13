import express from "express";
import { protect, pharmacistOnly,  patientOnly } from "../middleware/authMiddleware.js";
import {
  createPrescription,
  getPrescriptions,
  approvePrescription,
  rejectPrescription,
  getPatientPrescriptions,
  requestPrescription,
  getPendingPrescriptions
} from "../controllers/prescriptionsController.js";

const router = express.Router();

// 📌 Pharmacists create prescriptions
router.post("/create", protect, createPrescription);


router.get("/pharmacist", protect, pharmacistOnly, getPendingPrescriptions);

router.post("/request", protect, requestPrescription); 

// 📌 Get all prescriptions (for pharmacists)
router.get("/", protect, pharmacistOnly, getPrescriptions);

// 📌 Get a patient's prescriptions
router.get("/patient", protect, patientOnly, getPatientPrescriptions);

// 📌 Approve a prescription
router.put("/:id/approve", protect, pharmacistOnly, approvePrescription);

// 📌 Reject a prescription
router.put("/:id/reject", protect, pharmacistOnly, rejectPrescription);

export default router;
