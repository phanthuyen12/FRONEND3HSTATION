import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../config";

type Props = {
  children: React.ReactElement;
};

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = authService.getToken();
  const user = authService.getUser();

  if (!token || !user) {
    return (
      <Navigate
        to={`/admin/login?return=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  const roleLower = (user.role || "").toLowerCase();
  if (roleLower !== "admin" && roleLower !== "staff" && roleLower !== "viewer") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;






