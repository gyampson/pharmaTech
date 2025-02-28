import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
     <Particles />
      {/* <Header /> */}
      <ScrollTop />
      {/* Add particles effect */}
      <Routes>    
        {/* Define your routes */}
        <Route path="/" element={<Home />} /> {/* Route for Home page */}
        <Route path="/pharmacists" element={<Pharmacists />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pharmacist"]}>
              <Pharmacists />
            </ProtectedRoute>
          }
        />
         <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Patients />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
