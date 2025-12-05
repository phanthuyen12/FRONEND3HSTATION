import { Navigate } from "react-router-dom";
import { authService } from "../../config";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = "/" }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // Redirect to home if already logged in
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

