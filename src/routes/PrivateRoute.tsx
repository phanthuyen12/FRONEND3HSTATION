import { Route, Navigate, RouteProps } from "react-router-dom";

// helpers
import { APICore } from "../helpers/api/apiCore";
import { MENU_ITEMS } from "../constants/menu";
import { getFirstAllowedUrl } from "../helpers/menu";
import { authService } from "../config";

const getPathKeysHierarchy = (items: any[], path: string, parents: string[] = []): string[] | null => {
  for (const item of items) {
    const currentParents = [...parents, item.key];
    if (item.url && (path === item.url || path.startsWith(item.url + '/') || path.startsWith(item.url + '?'))) {
      return currentParents;
    }
    if (item.children) {
      const found = getPathKeysHierarchy(item.children, path, currentParents);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {
  const api = new APICore();

  return (
    <Route
      {...rest}
      render={(props: RouteProps) => {
        if (api.isUserAuthenticated() === false) {
          // not logged in so redirect to landing page
          return (
            <Navigate
              to={{
                pathname: "/landing1",
              }}
            />
          );
        }

        const loggedInUser = authService.getUser();

        // check if route is restricted by role (case-insensitive)
        if (roles) {
          const hasRole = roles.some(
            (r: string) => r.toLowerCase() === (loggedInUser?.role || "").toLowerCase()
          );
          if (!hasRole) {
            return <Navigate to={{ pathname: "/" }} />;
          }
        }

        // check page permission for admin / staff / viewer
        if (loggedInUser && (loggedInUser.role === 'staff' || loggedInUser.role === 'viewer' || loggedInUser.role === 'admin')) {
          const permissions = loggedInUser.permissions || [];
          const shouldFilter = permissions.length > 0 || loggedInUser.role === 'staff' || loggedInUser.role === 'viewer';

          if (shouldFilter) {
            const currentPath = window.location.pathname;
            // Only check admin paths
            if (currentPath.startsWith('/admin')) {
              const keys = getPathKeysHierarchy(MENU_ITEMS, currentPath) || [];
              if (keys.length > 0) {
                const isAllowed = keys.some(key => permissions.includes(key));
                if (!isAllowed) {
                  // Deny access! Redirect to first allowed page
                  const dest = getFirstAllowedUrl(permissions, loggedInUser.role);
                  return <Navigate to={{ pathname: dest }} />;
                }
              }
            }
          }
        }

        // authorised so return component
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
