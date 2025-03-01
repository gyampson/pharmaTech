import { useState } from "react";
import { Link,  } from "react-router-dom";
import {  FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 
 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

 

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <span className="logo-icon">💊</span>
              <span className=" logo-text">MandyPharmaTech</span>
            </Link>
          </div>

          <div className="mobile-toggle " onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
            
          <nav className={`nav ${isMenuOpen ? "active" : ""}`} >
            <ul className="nav-links  ">
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={() => setIsMenuOpen(false)}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;