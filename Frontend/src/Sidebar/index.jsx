import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Pill,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X,
  Activity,
} from "lucide-react";
import "./Sidebar.css";
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mock user data - in a real app, this would come from context/state
  const userRole = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")).role
    : "pharmacist";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarClass = `sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
    mobileOpen ? "open" : ""
  }`;

  return (
    <>
      <button
        className="icon-button mobile-menu-button"
        onClick={toggleMobile}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 100,
          display: "none",
          "@media (max-width: 768px)": {
            display: "flex",
          },
        }}
      >
        <Menu size={24} />
      </button>

      <div className={sidebarClass}>
        <div className="logo-container">
          <div className="logo">
            <Activity size={24} />
            {!collapsed && <span>MediTrack</span>}
          </div>
          <button
            className="icon-button"
            onClick={toggleSidebar}
            style={{ marginLeft: "auto", display: collapsed ? "none" : "flex" }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list">
          <ul>
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Home size={20} />
                {!collapsed && <span className="nav-link-text">Dashboard</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/prescriptions"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Pill size={20} />
                {!collapsed && (
                  <span className="nav-link-text">Prescriptions</span>
                )}
              </NavLink>
            </li>

            {userRole === "pharmacist" && (
              <li className="nav-item">
                <NavLink
                  to="/patients"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Users size={20} />
                  {!collapsed && (
                    <span className="nav-link-text">Patients</span>
                  )}
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink
                to="/appointments"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Calendar size={20} />
                {!collapsed && (
                  <span className="nav-link-text">Appointments</span>
                )}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FileText size={20} />
                {!collapsed && <span className="nav-link-text">Reports</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <nav className="nav-list">
            <ul>
              <li className="nav-item">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Settings size={20} />
                  {!collapsed && (
                    <span className="nav-link-text">Settings</span>
                  )}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/help"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <HelpCircle size={20} />
                  {!collapsed && <span className="nav-link-text">Help</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
