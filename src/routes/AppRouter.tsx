import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Preloader from "../components/Preloader";
import AllRoutes from "./Routes";
import ClientRoutes from "../client/routes";
import SimpleAdminRoutes from "./SimpleAdminRoutes";
import ChariusRoutes from "../client/charius/routes";
import Landing from "../client/pages/Landing";
import TechxenLanding from "../client/techxen/TechxenLanding";
import {
  TechxenHomePage,
  TechxenServicesPage,
  TechxenServiceIntroPage,
} from "../client/techxen/TechxenPages";
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

        {/* Landing page (TechXen components) */}
        <Route path="/landing" element={<TechxenLanding />} />
        <Route path="/techxen/home" element={<TechxenHomePage />} />
        <Route path="/techxen/services" element={<TechxenServicesPage />} />
        <Route path="/techxen/service-intro" element={<TechxenServiceIntroPage />} />

        {/* Client chính */}
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

