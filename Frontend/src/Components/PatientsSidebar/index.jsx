import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Home, Pill, Calendar, LogOut, Menu, Link, User, MessageSquare, Clock, ShoppingBag, PanelTopInactiveIcon,  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PatientsSidebar.css";

const PatientSidebar = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsOpen(window.innerWidth > 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (onSidebarToggle) onSidebarToggle(!isOpen);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <>
      <button className="mobile-sidebar patient" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <div className={`mobile-overlay ${isOpen && isMobile ? "active" : ""}`} onClick={toggleSidebar}></div>
      <div className={`sidebar patient ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
        <div className="logo-container" onClick={toggleSidebar}>
            <Link size={24} />
            {(isOpen || isMobile) && <span className="logo-text2">MandyConnect</span>}
          </div>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <ul className="menu-container">
          <li className="menu-item" onClick={() => handleNavigation("/patients/dashboard")}>
            <Home size={20} />
            {isOpen && <span className="menu-item-text">Dashboard</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/prescriptions")}>
            <Pill size={20} />
            {isOpen && <span className="menu-item-text">Prescriptions</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/appointments")}>
            <Calendar size={20} />
            {isOpen && <span className="menu-item-text">Appointments</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/dashboard")}>
            <ShoppingBag size={20} />
            {isOpen && <span className="menu-item-text">Pharmacy</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/prescriptions")}>
            <Clock size={20} />
            {isOpen && <span className="menu-item-text">History</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/appointments")}>
            <MessageSquare size={20} />
            {isOpen && <span className="menu-item-text">Messages</span>}
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/patients/appointments")}>
            <PanelTopInactiveIcon size={20} />
            {isOpen && <span className="menu-item-text">Inventory</span>}
          </li>
        </ul>
        <div className="footer-contain">
          <div className="footer-item" onClick={() => handleNavigation("/login")}>
            <User size={20} />
            {isOpen && <span className="footer-text">Profile</span>}
          </div>
          <div className="footer-item" onClick={() => handleNavigation("/login")}>
            <LogOut size={20} />
            {isOpen && <span className="footer-text">Logout</span>}
          </div>
        </div>
      </div>
    </>
  );
};

PatientSidebar.propTypes = {
  onSidebarToggle: PropTypes.func,
};

export default PatientSidebar;
