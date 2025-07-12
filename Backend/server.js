import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Create Express App
const app = express();
const server = http.createServer(app); // ✅ Attach Express to HTTP server

// ✅ Enable CORS and JSON Parsing
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ✅ Initialize Socket.io (BEFORE routes)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ✅ Store io instance in Express app for controllers
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// ✅ Import Routes (AFTER socket.io setup)
import authRoutes from "./routes/auth.js";
import pharmacistRoutes from "./routes/pharmacists.js";
import patientRoutes from "./routes/patients.js";
import prescriptionRoutes from "./routes/prescriptions.js";




app.use("/api/auth", authRoutes);
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.get('/', (req, res) => {
    res.status(200).send('Pharmacy Tech Backend is up and running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
