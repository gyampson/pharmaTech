import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    completedDate: { type: Date },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
