import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaTablets,
  FaUserFriends,
  FaChartLine,
  FaUserPlus,
  FaLink,
  FaPrescriptionBottleAlt,
  FaHeartbeat,
} from "react-icons/fa";
import "./Home.css";

// import Testimonials from "../../Testimonials";
const HomePage = () => {
  return (
    <div className="">
      {/* Hero Section */}

      <section className="section-header">
        <div className="glass-card">
          <div className="hero-content ">
            <div className="hero-text shine">
              <h6 className="shine" >Revolutionizing Pharmacy Management</h6>
              <p className="slide-in shine">
                MandyPharmaTech connects pharmacists with patients through a
                seamless digital platform. Manage prescriptions, track
                medications, and provide better care.
              </p>
              <div className="hero-buttons ">
                 
                <Link to="/register" className="btn btn-primary ">
                  Get Started
                </Link>
                
               
              <Link to="/" className="btn btn-secondary">
                  Learn More
                </Link>
               
              </div>
            </div>
            <div className="hero-image fade-in">
              <img
                src="https://img.freepik.com/free-vector/pharmacy-concept-illustration_114360-2290.jpg"
                alt="Pharmacy Illustration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" glass-card ">
        <div className="">
          <div className="section-header ">
            <h2 >Our Features</h2>
            <p>
              Discover how MandyPharmaTech can transform your pharmacy practice
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card ">
              <div className="feature-icon">
                <FaUserMd />
              </div>
              <h3>Pharmacist Dashboard</h3>
              <p>
                Comprehensive dashboard for pharmacists to manage prescriptions,
                patient records, and medication inventory.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaTablets />
              </div>
              <h3>Digital Prescriptions</h3>
              <p>
                Create, manage, and track digital prescriptions with ease.
                Reduce errors and improve patient safety.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUserFriends />
              </div>
              <h3>Patient Portal</h3>
              <p>
                User-friendly portal for patients to view prescriptions, request
                refills, and communicate with pharmacists.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Analytics & Insights</h3>
              <p>
                Gain valuable insights into prescription patterns, patient
                adherence, and business performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className=" glass-card">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get started with MandyPharmaTech</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">
              <FaUserPlus />
              </div>

              <h3>Create an Account</h3>
              <p>
                Register as a pharmacist or patient and complete your profile.
              </p>
            </div>

            <div className="step">
              <div className="step-number">  <FaLink /></div>
              <h3>Connect</h3>
              <p>
                Pharmacists and patients can connect through our secure
                platform.
              </p>
            </div>

            <div className="step">
              <div className="step-number"> <FaPrescriptionBottleAlt /></div>
              <h3>Manage Prescriptions</h3>
              <p>Create, view, and manage prescriptions digitally.</p>
            </div>

            <div className="step">
              <div className="step-number">
              
                <FaHeartbeat />
              </div>
              <h3>Improve Care</h3>
              <p>
                Enhance patient outcomes through better medication management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="glass-card">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Hear from pharmacists and patients using MandyPharmaTech</p>
          </div>

          <div className="testimonial-slider">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  &quot;MandyPharmaTech has transformed how I manage
                  prescriptions. The digital platform saves time and reduces
                  errors.&quot;
                </p>
              </div>
              <div className="testimonial-author">
                <img
                  src="https://randomuser.me/api/portraits/women/43.jpg"
                  alt="Dr. Sarah Johnson"
                />
                <div>
                  <h4>Dr. Sarah Johnson</h4>
                  <p>Pharmacist, MediCare Pharmacy</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  &quot;As a patient with multiple medications, this platform
                  helps me stay organized and connected with my
                  pharmacist.&quot;
                </p>
              </div>
              <div className="testimonial-author">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Robert Chen"
                />
                <div>
                  <h4>Robert Chen</h4>
                  <p>Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-card">
        <div className="glass-card">
          <div className="glass-card">
            <h2>Ready to Transform Your Pharmacy Practice?</h2>
            <p>
              Join thousands of pharmacists and patients already using
              MandyPharmaTech.
            </p>
            <Link to="/register" className="btn btn-primary">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
