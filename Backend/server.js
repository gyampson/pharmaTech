import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import pharmacistRoutes from "./routes/pharmacists.js";
import patientRoutes from "./routes/patients.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/patient", patientRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
