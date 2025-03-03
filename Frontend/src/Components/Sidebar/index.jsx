import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Pill,
  Calendar,
  Users,
 
  Settings,
  User,
  LogOut,
  Menu,
  MessagesSquare,
} from "lucide-react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const PharmacistSidebar = ({ onSidebarToggle }) => {
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
      <button className="mobile-sidebar pharmacist" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <div
        className={`mobile-overlay ${isOpen && isMobile ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>
      <div className={`sidebar pharmacist ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo-container" onClick={toggleSidebar}>
            <Pill size={24} />
            {(isOpen || isMobile) && (
              <span className="logo-text2">MandyTrack</span>
            )}
          </div>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <ul className="menu-container">
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/dashboard")}
          >
            <Home size={20} />
            {isOpen && <span className="menu-item-text">Dashboard</span>}
          </li>
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/prescriptions")}
          >
            <Pill size={20} />
            {isOpen && <span className="menu-item-text">Prescriptions</span>}
          </li>
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/appointments")}
          >
            <Calendar size={20} />
            {isOpen && <span className="menu-item-text">Appointments</span>}
          </li>
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/patients")}
          >
            <Users size={20} />
            {isOpen && <span className="menu-item-text">Patients</span>}
          </li>
          
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/appointments")}
          >
            <MessagesSquare size={20} />
            {isOpen && <span className="menu-item-text">Messages</span>}
          </li>
          <li
            className="menu-item"
            onClick={() => handleNavigation("/pharmacists/settings")}
          >
            <Settings size={20} />
            {isOpen && <span className="menu-item-text">Settings</span>}
          </li>
        </ul>
        <div className="footer-contain">
          <div className="footer-item">
            <User size={20} />
            {isOpen && <span className="footer-text">Profile</span>}
          </div>
          <div className="footer-item">
            <LogOut size={20} />
            {isOpen && <span className="footer-text">Logout</span>}
          </div>
        </div>
      </div>
    </>
  );
};

PharmacistSidebar.propTypes = {
  onSidebarToggle: PropTypes.func,
};

export default PharmacistSidebar;
