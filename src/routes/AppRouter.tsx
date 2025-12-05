import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Preloader from "../components/Preloader";
import AllRoutes from "./Routes";
import ClientRoutes from "../client/routes";
import SimpleAdminRoutes from "./SimpleAdminRoutes";
import ChariusRoutes from "../client/charius/routes";
import DexonRoutes from "../landingpage/DexonRoutes";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLogin from "../pages/auth/AdminLogin";

/**
 * Router tổng hợp cho toàn bộ ứng dụng
 * - /admin/*     : khu vực admin
 * - /charius/*   : trang demo Charius
 * - /dexon/*     : landing page Dexon (copy từ project dexon-react)
 * - /*           : client chính
 */
const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin: yêu cầu role admin */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <SimpleAdminRoutes />
            </AdminProtectedRoute>
          }
        />

        {/* Demo Charius */}
        <Route path="/charius/*" element={<ChariusRoutes />} />

        {/* Landing Dexon (project dexon-react) */}
        <Route path="/landing/*" element={<DexonRoutes />} />

        {/* Client chính */}
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

