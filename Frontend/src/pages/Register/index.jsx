import { useState,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaUserTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import AuthContext from "../../context/AuthContext";
import { registerUser } from "../../services/authServices";
import "./Register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",  // Added role field
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");


  const { username, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // ✅ Clear previous success messages
  
    if (!username || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      setLoading(true);
      const data = await registerUser({ name: username, email, password, role });
  
      if (data?.user) {  // ✅ Check if user was created successfully
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);  // ✅ Show message for 2 seconds, then redirect
      } else {
        setError("User registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <motion.div
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="">
        <motion.div
          className="auth-container"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="auth-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img
              src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg"
              alt="Register"
            />
          </motion.div>

          <motion.div
            className="auth-form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h1>Create Account</h1>
            <p className="auth-subtitle">Sign up for MandyPharmaTech</p>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {error && <div className="alert alert-error">{error}</div>}


            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key="error"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">
                  <FaUser className="form-icon" /> Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="form-icon" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="form-icon" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaCheckCircle className="form-icon" /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role Selection Field */}
              <div className="form-group">
                <label htmlFor="role">
                  <FaUserTag className="form-icon" /> Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-control"
                  value={role}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Role --</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-block ${loading ? "btn-loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
