

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not logged in → /login, remember where they were trying to go
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — wrong role → 404 (not a redirect hint like /login)
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;