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
import ProtectedRoute from "./components/ProtectedRoute";

// Layout component to handle conditional rendering of Header & Footer
function Layout({ children }) {
  const location = useLocation();

  // Define paths where Header & Footer should NOT be shown
  const hideHeaderFooter = ["/pharmacists", "/patients"].includes(location.pathname);

  return (
    <>
      <Particles />
      {!hideHeaderFooter && <Header />}
      <ScrollTop />
      {children} {/* Render children inside Layout */}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

// **Fix: Add PropTypes validation for children**
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
      </Layout>
    </BrowserRouter>
  );
}

export default App;
