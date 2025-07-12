import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "./pages/Home";
import Pharmacists from "./pages/Pharmacists";
import Patients from "./pages/Patients";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ScrollTop from "./ScrollTop";
import Particles from "./Particles";
import Sidebar from "./Components/Sidebar";
import PatientsSidebar from "./Components/PatientsSidebar";
import PatientsDashboard from "./PatientsPage/Dashboard";
import PatientsSettings from "./PatientsPage/Settings";
import PatientsAppointments from "./PatientsPage/Appointments";
import PatientsHistory from "./PatientsPage/History";
import PatientsInventory from "./PatientsPage/Inventory";
import PatientsMessages from "./PatientsPage/Messages";
import PatientsPharmacy from "./PatientsPage/Pharmacy";
import PatientsPrescription from "./PatientsPage/Prescription";
import PatientsProfile from "./PatientsPage/Profile";
import Dashboard from "./PharmacistsPage/Dashboard";
import Settings from "./PharmacistsPage/Settings";
import Patient from "./PharmacistsPage/Patients";
import Messages from "./PharmacistsPage/Messages";
import Prescription from "./PharmacistsPage/Prescription";
import Profile from "./PharmacistsPage/Profile";
import Appointments from "./PharmacistsPage/Appointments";
import ProtectedRoute from "./Components/ProtectedRoute";

// Layout component for conditional rendering
function Layout({ children }) {
  const location = useLocation();

  // Define paths where Header & Footer should NOT be shown
  const hideHeaderFooter = location.pathname.startsWith("/patients") || location.pathname.startsWith("/pharmacists");
  const showPatientsSidebar = location.pathname.startsWith("/patients");
  const showPharmacistsSidebar = location.pathname.startsWith("/pharmacists");

  return (
    <>
      <Particles />
      {!hideHeaderFooter && <Header />}
      <ScrollTop />
      <div style={{ display: "flex" }}>
        {showPatientsSidebar && <PatientsSidebar />}
        {showPharmacistsSidebar && <Sidebar />}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacists" element={<Pharmacists />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Patients Routes */}
          <Route path="/patients/dashboard" element={<ProtectedRoute><PatientsDashboard /></ProtectedRoute>} />
          <Route path="/patients/settings" element={<ProtectedRoute><PatientsSettings /></ProtectedRoute>} />
          <Route path="/patients/appointments" element={<ProtectedRoute><PatientsAppointments /></ProtectedRoute>} />
          <Route path="/patients/history" element={<ProtectedRoute><PatientsHistory /></ProtectedRoute>} />
          <Route path="/patients/inventory" element={<ProtectedRoute><PatientsInventory /></ProtectedRoute>} />
          <Route path="/patients/messages" element={<ProtectedRoute><PatientsMessages /></ProtectedRoute>} />
          <Route path="/patients/pharmacy" element={<ProtectedRoute><PatientsPharmacy /></ProtectedRoute>} />
          <Route path="/patients/prescription" element={<ProtectedRoute><PatientsPrescription /></ProtectedRoute>} />
          <Route path="/patients/profile" element={<ProtectedRoute><PatientsProfile /></ProtectedRoute>} />
          
          {/* Pharmacists Routes */}
          <Route path="/pharmacists/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pharmacists/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/pharmacists/patients" element={<ProtectedRoute><Patient /></ProtectedRoute>} />
          <Route path="/pharmacists/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/pharmacists/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
          <Route path="/pharmacists/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/pharmacists/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
