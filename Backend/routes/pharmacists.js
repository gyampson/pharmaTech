import express from "express";
import { protect, pharmacistOnly } from "../middleware/authMiddleware.js";
import { getPendingPrescriptions, approvePrescription, rejectPrescription, getPharmacistAppointments, getInventory } from "../controllers/pharmacistsController.js";

const router = express.Router();

// ✅ Get pending prescription requests
router.get("/prescriptions/pending", protect, pharmacistOnly, getPendingPrescriptions);

// ✅ Approve a prescription refill
router.patch("/prescriptions/:id/approve", protect, pharmacistOnly, approvePrescription);

// ✅ Reject a prescription refill
router.patch("/prescriptions/:id/reject", protect, pharmacistOnly, rejectPrescription);

// ✅ Get pharmacist inventory data
router.get("/inventory", protect, pharmacistOnly, getInventory);

router.get("/appointments", protect, pharmacistOnly, getPharmacistAppointments);
export default router;
