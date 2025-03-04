import Prescription from "../models/Prescription.js";
import Inventory from "../models/Inventory.js";
import Appointment from "../models/Appointment.js";

// ✅ Fetch pending prescriptions
export const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "pending" }).populate("patient", "name age gender");
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", error });
  }
};

// ✅ Approve a prescription refill
export const approvePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "approved";
    prescription.completedDate = new Date();
    await prescription.save();

    res.status(200).json({ message: "Prescription approved successfully", prescription });
  } catch (error) {
    res.status(500).json({ message: "Error approving prescription", error });
  }
};


export const getPharmacistAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "scheduled" }).populate("patient", "name email");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No scheduled appointments found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// ✅ Reject a prescription refill
export const rejectPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "rejected";
    prescription.completedDate = new Date();
    await prescription.save();

    res.status(200).json({ message: "Prescription rejected successfully", prescription });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting prescription", error });
  }
};

// ✅ Fetch pharmacist inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
};
