import Prescription from "../models/Prescription.js";


// 📌 Get all prescriptions (For Pharmacists)
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate("patient", "name email");
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get a patient's prescriptions
export const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "pending" }).populate("patient", "name email");
    res.json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id });

    if (!prescriptions.length) {
      return res.status(404).json({ message: "No prescriptions found" });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// 📌 Approve a prescription
export const approvePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "approved";
    await prescription.save();

    // Notify the patient in real-time
    const io = req.app.get("socketio");
    io.emit(`prescriptionUpdate-${prescription.patient}`, {
      message: `✅ Your prescription for ${prescription.medication} has been approved!`,
    });

    res.json({ message: "Prescription approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


export const createPrescription = async (req, res) => {
  try {
    const { patient, doctor, medication, dosage, frequency } = req.body;

    if (!patient || !doctor || !medication || !dosage || !frequency) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPrescription = await Prescription.create({
      patient,
      doctor,
      medication,
      dosage,
      frequency,
      status: "pending",
      createdAt: new Date(),
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Handle patient prescription requests
export const requestPrescription = async (req, res) => {
  try {
    const { doctor, medication, dosage, frequency } = req.body;
    const patientId = req.user.id; // Extract patient ID from token

    const newPrescription = new Prescription({
      doctor,
      medication,
      dosage,
      frequency,
      patient: patientId,
      status: "pending",
    });

    await newPrescription.save();

    // Emit real-time notification to the patient
    const io = req.app.get("socketio");
    io.emit(`prescriptionUpdate-${patientId}`, {
      message: "✅ Your prescription request has been sent successfully!",
    });

    res.status(201).json({ message: "Prescription request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};



// 📌 Reject a prescription
export const rejectPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // ✅ Get reason from request body

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "rejected";
    prescription.rejectReason = reason || "No reason provided"; // ✅ Store reason

    await prescription.save();

    // ✅ Emit socket event to notify patient
    const io = req.app.get("socketio");
    io.emit(`prescriptionUpdate-${prescription.patient}`, {
      id: prescription._id,
      status: "rejected",
      rejectReason: prescription.rejectReason, // ✅ Send reason
      message: `Your prescription for ${prescription.medication} was rejected.`,
    });

    res.json({ message: "Prescription rejected", prescription });
  } catch (error) {
    console.error("❌ Error rejecting prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};
