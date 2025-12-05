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
import LockScreen from "./pages/LockScreen";
import TopUp from "./pages/TopUp";
import TopUpBank from "./pages/TopUpBank";
import TopupDetail from "./pages/TopupDetail";
import Vps from "./pages/Vps";
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
          element={
            <ProtectedRoute>
              <ClientVerticalLayout>
                <Home />
              </ClientVerticalLayout>
            </ProtectedRoute>
          }
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



