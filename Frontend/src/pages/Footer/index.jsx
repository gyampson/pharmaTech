
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    
    <footer className="footer glass-card">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-title">MandyPharmaTech</h3>
            <p>
              Connecting pharmacists with patients through innovative digital solutions.
              Our platform streamlines prescription management and enhances patient care.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
            </div>
          </div>
          
          <div className="footer-section links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="footer-section contact">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <p><FaMapMarkerAlt className="icon" /> 123 Pharmacy Street, Medical District</p>
              <p><FaPhone className="icon" /> +1 (555) 123-4567</p>
              <p><FaEnvelope className="icon" /> info@mandypharmatech.com</p>
            </div>
          </div>
          
          <div className="footer-section newsletter">
            <h3 className="footer-title">Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates and health tips.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} MandyPharmaTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;