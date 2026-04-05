import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../redux/store";
import * as layoutConstants from "../constants/layout";
import { changeSideBarTheme } from "../redux/actions";
import ClientVerticalLayout from "./layouts/ClientVerticalLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Landing1 from "./landing/page/index";
import ProductMMOPage from "./landing/page/product";
import ProductMMODetailPage from "./landing/page/product-detail";
import LandingCoursesPage from "./landing/page/courses";
import LandingToolsPage from "./landing/page/tools";
import LandingWorkflowsPage from "./landing/page/workflows";
import LandingCourseDetailPage from "./landing/page/course-detail";
import LandingWorkflowDetailPage from "./landing/page/workflow-detail";
import LandingCartPage from "./landing/page/cart";
import LandingProfilePage from "./landing/page/profile";
import LandingDepositPage from "./landing/page/deposit";
import LandingToolDetailPage from "./landing/page/tool-detail";
import LandingVpsPage from "./landing/page/vps";
import LandingHostingPage from "./landing/page/hosting";
import LandingVpsManagementPage from "./landing/page/vps-management";
import LandingVpsDetailPage from "./landing/page/vps-detail";
import LandingLoginPage from "./landing/page/login";
import LandingRegisterPage from "./landing/page/register";
import LandingForgotPasswordPage from "./landing/page/forgot-password";
import LandingResetPasswordPage from "./landing/page/reset-password";
import LandingSoftwareManagementPage from "./landing/page/software-management";
import MyCoursesLandingPage from "./landing/page/my-courses";
import LandingWorkflowManagementPage from "./landing/page/workflow-management";
import LandingTopupDetailPage from './landing/page/topup-detail';
import HostingLayout from './landing/layouts/HostingLayout';
import RechargePage from "./landing/page/recharge";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import Workflows from "./pages/Workflows";
import WorkflowDetail from "./pages/WorkflowDetail";
import MyWorkflows from "./pages/MyWorkflows";
import ToolFacebook from "./pages/ToolFacebook";
import ToolTiktok from "./pages/ToolTiktok";
import ToolInstagram from "./pages/ToolInstagram";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import ResetPassword from "./pages/ResetPassword";
import LockScreen from "./pages/LockScreen";
import TopUp from "./pages/TopUp";
import TopUpBank from "./pages/TopUpBank";
import TopupDetail from "./pages/TopupDetail";
import Vps from "./pages/Vps";
import NodeverseVps from "./pages/NodeverseVps";
import MyVps from "./pages/MyVps";
import MyVpsDetail from "./pages/MyVpsDetail";
import SoftwareKeys from "./pages/SoftwareKeys";
import MySoftwareKeys from "./pages/MySoftwareKeys";
const Dashboard = React.lazy(() => import("../pages/dashboard/"));
import Orders from "./pages/Orders";
const ClientRoutes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { Layout } = useSelector((state: RootState) => ({
    Layout: state.Layout,
  }));

  // Client: luôn dùng sidebar màu dark
  useEffect(() => {
    dispatch(
      changeSideBarTheme(layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DARK)
    );
  }, [dispatch]);

  return (
    <React.Fragment>
      <Routes>
        <Route
          path="/admin1"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Dashboard />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Landing1 />}
        />
        <Route
          path="/landing"
          element={
            <PublicRoute>
              <ClientVerticalLayout>
                <Landing />
              </ClientVerticalLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/landing1"
          element={<Landing1 />}
        />
        <Route
          path="/product-mmo"
          element={<ProductMMOPage />}
        />
        <Route
          path="/product-mmo/:id"
          element={<ProductMMODetailPage />}
        />
        <Route
          path="/landing-courses"
          element={<LandingCoursesPage />}
        />
        <Route
          path="/landing-tools"
          element={<LandingToolsPage />}
        />
        <Route
          path="/landing-tool-detail/:id"
          element={<LandingToolDetailPage />}
        />
        <Route
          path="/landing-workflows"
          element={<LandingWorkflowsPage />}
        />
        <Route
          path="/landing-courses/:id"
          element={<LandingCourseDetailPage />}
        />
        <Route
          path="/landing-workflows/:id"
          element={<LandingWorkflowDetailPage />}
        />
        <Route
          path="/cart"
          element={<LandingCartPage />}
        />
        <Route
          path="/landing-profile"
          element={<LandingProfilePage />}
        />
        <Route
          path="/landing-vps"
          element={<LandingVpsPage />}
        />
        <Route
          path="/landing-vps-management"
          element={<LandingVpsManagementPage />}
        />
        <Route
          path="/landing-vps-detail/:id"
          element={<LandingVpsDetailPage />}
        />
        <Route
          path="/landing-hosting"
          element={<LandingHostingPage />}
        />
        <Route
          path="/landing-deposit"
          element={<LandingDepositPage />}
        />
        <Route
          path="/landing-software-management"
          element={<LandingSoftwareManagementPage />}
        />
        <Route
          path="/landing-my-courses"
          element={<MyCoursesLandingPage />}
        />
        <Route
          path="/landing-my-workflows"
          element={<LandingWorkflowManagementPage />}
        />
        <Route path="/landing-recharge" element={<RechargePage />} />
        <Route path="/landing-recharge-crypto" element={<RechargePage />} />
        <Route path="/landing-topup/:code" element={<LandingTopupDetailPage />} />
        <Route
          path="/landing-login"
          element={
            <PublicRoute>
              <LandingLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/landing-register"
          element={
            <PublicRoute>
              <LandingRegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/landing-forgot-password"
          element={
            <PublicRoute>
              <LandingForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/landing-reset-password"
          element={
            <PublicRoute>
              <LandingResetPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Courses />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <MyCourses />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Documents />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <DocumentDetail />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <CourseDetail />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflows"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Workflows />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-workflows"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <MyWorkflows />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflows/:id"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <WorkflowDetail />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/recover-password"
          element={
            <PublicRoute>
              <RecoverPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <RecoverPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/lock-screen"
          element={
            <ProtectedRoute>
              <LockScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Profile />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <TopUp />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup/bank"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <TopUpBank />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup/:code"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <TopupDetail />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vps"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Vps />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vps/nodeverse"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <NodeverseVps />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-vps"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <MyVps />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-vps/:id"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <MyVpsDetail />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Orders />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/software-keys"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <SoftwareKeys />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-software-keys"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <MySoftwareKeys />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/facebook"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <ToolFacebook />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/tiktok"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <ToolTiktok />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/instagram"
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <ToolInstagram />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </React.Fragment>
  );
};

export default ClientRoutes;



