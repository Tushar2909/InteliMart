import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {

  const { token, role: myRole } = useAuth();

  if (!token) return <Navigate to="/login" />;

  if (role && myRole !== role) {
    if (myRole === "ROLE_ADMIN") return <Navigate to="/admin" />;
    if (myRole === "ROLE_SELLER") return <Navigate to="/seller" />;
    return <Navigate to="/customer" />;
  }

  return children;
}
