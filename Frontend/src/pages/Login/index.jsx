// LoginPage.jsx
import  { useState, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from "../../services/authServices";

import './Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();



  const { email, password } = formData;

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // ✅ Clear previous success messages

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      if (data?.user) {  // ✅ Ensure login was successful
        localStorage.setItem("userData", JSON.stringify(data.user));

        setSuccessMessage("Login successful! Redirecting..."); // ✅ Show success message

        setTimeout(() => {
          navigate(data.user.role === "pharmacist" ? "/pharmacists" : "/patients");
        }, 3000); // ✅ Redirect after 2 seconds
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
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
          className="auth-container "
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
              src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-125.jpg"
              alt="Login"
            />
          </motion.div>

          <motion.div
            className="auth-form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your MandyPharmaTech account</p>
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

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-block ${
                  loading ? 'btn-loading' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    <FaSignInAlt className="btn-icon" /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don&apos;t have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;