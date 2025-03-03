import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userData") || "{}");
  });

  useEffect(() => {
    console.log("🔵 Checking protected route user:", user);
  }, [user]);

  if (!user?.token) {
    console.error("❌ No token found. Redirecting to login...");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error(
      `❌ Unauthorized role (${user.role}). Redirecting to login...`
    );
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
