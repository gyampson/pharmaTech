import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
export const pharmacistOnly = (req, res, next) => {
  if (req.user && req.user.role === "pharmacist") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Pharmacists only." });
  }
};

export const patientOnly = (req, res, next) => {
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Patients only." });
  }
};

