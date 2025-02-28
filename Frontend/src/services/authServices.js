import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update this with your backend URL

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("userToken", response.data.token);
  }
  return response.data;
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("userToken");
};
