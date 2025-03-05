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

// ✅ CONFIRM APPOINTMENT
export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔵 Confirming appointment ID:", id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "confirmed";
    await appointment.save();

    const io = req.app.get("socketio");
    io.emit(`appointmentUpdate-${appointment.patient}`, {
      id: appointment._id,
      status: "confirmed",
      message: `Your appointment with ${appointment.doctor} has been confirmed.`,
    });

    res.status(200).json({ message: "Appointment confirmed", appointment });
  } catch (error) {
    console.error("❌ Error confirming appointment:", error);
    res.status(500).json({ message: "Error confirming appointment", error });
  }
};

// ✅ REJECT APPOINTMENT
export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔴 Rejecting appointment ID:", id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "rejected";
    await appointment.save();

    const io = req.app.get("socketio");
    io.emit(`appointmentUpdate-${appointment.patient}`, {
      id: appointment._id,
      status: "rejected",
      message: `Your appointment with ${appointment.doctor} has been rejected.`,
    });

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error("❌ Error rejecting appointment:", error);
    res.status(500).json({ message: "Error rejecting appointment", error });
  }
};

// ✅ RESCHEDULE APPOINTMENT
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate } = req.body;

    console.log("🔄 Rescheduling appointment ID:", id, "New Date:", newDate);

    if (!newDate) {
      return res.status(400).json({ message: "New date is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.date = newDate;
    appointment.status = "rescheduled";
    await appointment.save();

    // ✅ Send real-time notification ONLY to the patient of THIS appointment
    const io = req.app.get("socketio");
    io.emit(`appointmentUpdate-${appointment.patient}`, {
      id: appointment._id, // ✅ Ensure only one appointment updates
      status: "rescheduled",
      message: `🔄 Your appointment with ${appointment.doctor} has been rescheduled to ${new Date(newDate).toLocaleString()}.`,
    });

    res.status(200).json({ message: "Appointment rescheduled", appointment });
  } catch (error) {
    console.error("❌ Error rescheduling appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ CANCEL APPOINTMENT
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🛑 Cancelling appointment ID:", id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const io = req.app.get("socketio");
    io.emit(`appointmentUpdate-${appointment.patient}`, {
      id: appointment._id,
      status: "cancelled",
      message: `Your appointment with ${appointment.doctor} has been cancelled.`,
    });

    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    res.status(500).json({ message: "Error cancelling appointment", error });
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
