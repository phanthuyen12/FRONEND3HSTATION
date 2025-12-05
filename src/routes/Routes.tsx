import React, { ReactNode, Suspense, useEffect } from "react";
import {
  Navigate,
  Route,
  RouteObject,
  RouteProps,
  Routes,
  useLocation,
} from "react-router-dom";

// redux
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import * as layoutConstants from "../constants/layout";
import { changeSideBarTheme } from "../redux/actions";
import Preloader from "../components/Preloader";

// Layouts
import DefaultLayout from "../layouts/Default";
import VerticalLayout from "../layouts/Vertical";

import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from ".";
import { APICore } from "../helpers/api/apiCore";

// Logger helper
const logAdminAccess = (routePath: string, isAuth: boolean) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Admin route access attempt:`);
  console.log(`Route: ${routePath}`);
  console.log(`Authenticated: ${isAuth}`);
};

const RouteLogger: React.FC<{ routePath?: string; isAuth: boolean; children: ReactNode }> = ({
  routePath,
  isAuth,
  children,
}) => {
  useEffect(() => {
    console.log(
      `[RouteRenderer] Mounting route: ${routePath ?? "unknown"} | auth=${isAuth}`
    );
    return () => {
      console.log(
        `[RouteRenderer] Unmounting route: ${routePath ?? "unknown"} | auth=${isAuth}`
      );
    };
  }, [routePath, isAuth]);

  return <>{children}</>;
};

const AllRoutes: React.FC<RouteProps> = (props) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { Layout } = useSelector((state: RootState) => ({
    Layout: state.Layout,
  }));

  const api = new APICore();
  const bypassAuth = true; // Bỏ qua bước đăng nhập để vào thẳng giao diện admin

  // Admin: sidebar màu dark
  useEffect(() => {
    dispatch(
      changeSideBarTheme(layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DARK)
    );
  }, [dispatch]);

  // Log khi component render
  useEffect(() => {
    const isAuth = bypassAuth ? true : api.isUserAuthenticated();
    console.log("AllRoutes rendered. User authenticated:", isAuth, "| bypass:", bypassAuth);
  }, []);

  useEffect(() => {
    console.log(`[AllRoutes] Location changed -> ${location.pathname}${location.search}`);
  }, [location]);

  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        {/* Public routes */}
        {(publicProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => (
          <Route
            path={route.path}
            element={
              <RouteLogger routePath={route.path} isAuth={false}>
              <DefaultLayout {...props} layout={Layout}>
                  {route.element ?? (
                    <div className="p-6 text-sm text-red-500">
                      ⚠️ Không có component cho route {route.path}
                    </div>
                  )}
              </DefaultLayout>
              </RouteLogger>
            }
            key={idx}
          />
        ))}

        {/* Auth-protected routes */}
        {(authProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => {
          const isAuth = bypassAuth ? true : api.isUserAuthenticated();

          // Log admin access
          logAdminAccess(route.path ?? "unknown", isAuth);

          return (
            <Route
              path={route.path}
              element={
                <RouteLogger routePath={route.path} isAuth={isAuth}>
                  {!isAuth ? (
                  <Navigate
                    to={{
                      pathname: "/admin/auth/login",
                      search: "next=" + route.path,
                    }}
                  />
                ) : (
                    <VerticalLayout {...props}>
                      {route.element ?? (
                        <div className="p-6 text-sm text-red-500">
                          ⚠️ Không có component cho route {route.path}
                        </div>
                      )}
                    </VerticalLayout>
                  )}
                </RouteLogger>
              }
              key={idx}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
