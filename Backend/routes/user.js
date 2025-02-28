import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";  // Import User model to get role

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {
    // Fetch user from DB to check role
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "pharmacist") {
      return res.json({ message: "Welcome Pharmacist, this is your dashboard.", dashboard: "pharmacist" });
    } else {
      return res.json({ message: "Welcome Patient, this is your dashboard.", dashboard: "patient" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;

