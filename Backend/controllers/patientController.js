import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";

// ✅ Fetch patient prescriptions
export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", error });
  }
};

// ✅ Mark medication as taken
export const markMedicationTaken = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.taken = true;
    await prescription.save();

    res.status(200).json({ message: "Medication marked as taken", prescription });
  } catch (error) {
    res.status(500).json({ message: "Error updating medication status", error });
  }
};

// ✅ Fetch patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
      status: "scheduled", // ✅ Fetch only scheduled appointments
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// ✅ Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, specialty, date, location } = req.body;

    if (!doctor || !specialty || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAppointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      specialty,
      date,
      location,
      status: "scheduled",
    });

    res.status(201).json({ message: "Appointment booked successfully", newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};
// ✅ Cancel an appointment
export const cancelAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment", error });
  }
};

// ✅ Request a prescription refill
export const requestRefill = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "pending";
    await prescription.save();

    res.status(200).json({ message: "Refill request sent", prescription });
  } catch (error) {
    res.status(500).json({ message: "Error requesting refill", error });
  }
};
