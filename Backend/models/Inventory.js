import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: true },
    reorderLevel: { type: Number, required: true },
    status: { type: String, enum: ["normal", "low", "critical"], default: "normal" },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
