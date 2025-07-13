import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body; // Use 'let' to reassign

    // Trim whitespace and convert email to lowercase for consistency
    name = name ? name.trim() : name;
    email = email ? email.trim().toLowerCase() : email;
    password = password ? password.trim() : password;
    role = role ? role.trim() : role;

    console.log('Registering user with:', { name, email, password: '[HIDDEN]', role }); // Debug log

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists with email:', email); // Debug log
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword); // Debug log

    const user = await User.create({ name, email, password: hashedPassword, role });

    if (user) {
      console.log('User registered successfully:', user.email); // Debug log
      res.status(201).json({ message: "Registration successful! Redirecting to login...", user });
    } else {
      console.log('Registration failed: Invalid user data for email:', email); // Debug log
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Server Error during registration:", error); // Debug log
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    let { email, password } = req.body; // Use 'let' to reassign

    // Trim whitespace and convert email to lowercase for consistency
    email = email ? email.trim().toLowerCase() : email;
    password = password ? password.trim() : password;

    console.log('Login attempt for email (processed):', email); // Debug log
    console.log('Password received (processed - plain text):', password); // Debug log

    const user = await User.findOne({ email }); // Find user by processed email

    console.log('User found from DB (if any):', user ? user.email : 'No user found'); // Debug log
    if (user) {
        console.log('User password from DB (hashed):', user.password); // Debug log
    }

    if (!user) {
      console.log('Login failed: User not found for email:', email); // Debug log
      return res.status(400).json({ message: "Invalid credentials" }); // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare processed password
    console.log('bcrypt.compare result (isMatch):', isMatch); // Debug log

    if (!isMatch) {
      console.log('Login failed: Password mismatch for user:', email); // Debug log
      return res.status(400).json({ message: "Invalid credentials" }); // Password mismatch
    }

    // If both checks pass, generate token and send response
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log('Login successful for user:', user.email); // Debug log

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Server Error during login:", error); // Debug log
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};