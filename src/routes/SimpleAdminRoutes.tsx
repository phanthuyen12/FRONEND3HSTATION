import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../redux/store";
import * as layoutConstants from "../constants/layout";
import { changeSideBarTheme } from "../redux/actions";
import VerticalLayout from "../layouts/Vertical";
import Dashboard from "../pages/dashboard";
import CourseCategoriesAdmin from "../pages/apps/CoursesAdmin/Categories";
import CoursesAdminList from "../pages/apps/CoursesAdmin/List";
import CourseDetailAdmin from "../pages/apps/CoursesAdmin/Detail";
import VpsAdminList from "../pages/apps/VpsAdmin/List";
import VpsAdminOrders from "../pages/apps/VpsAdmin/VpsOrders";
import WorkflowsAdminList from "../pages/apps/WorkflowsAdmin/List";
import WorkflowCategoriesAdmin from "../pages/apps/WorkflowsAdmin/Categories";
import WorkflowDetailAdmin from "../pages/apps/WorkflowsAdmin/Detail";
import WorkflowsUsersAdmin from "../pages/apps/WorkflowsAdmin/Users";
import WorkflowsAdminOrders from "../pages/apps/WorkflowsAdmin/Orders";
import TopupAdminList from "../pages/apps/TopupAdmin/List";
import UsersAdminList from "../pages/apps/UserAdmin/List";
import UserAdminDetail from "../pages/apps/UserAdmin/Detail";
import DocumentsAdminList from "../pages/apps/DocumentsAdmin/List";
import DocumentsAdminDetail from "../pages/apps/DocumentsAdmin/Detail";
import BankAdminList from "../pages/apps/BankAdmin/List";

/**
 * Admin router đơn giản, bỏ hết auth / PrivateRoute
 * - /admin/dashboard                  -> Dashboard
 * - /admin/elearning/categories       -> CourseCategoriesAdmin
 * - /admin/elearning/courses          -> CoursesAdminList
 * - /admin/elearning/courses/:id      -> CourseDetailAdmin (bao gồm /new)
 * - /admin/vps                        -> VpsAdminList
 * - /admin/workflows/categories       -> WorkflowCategoriesAdmin
 * - /admin/workflows                  -> WorkflowsAdminList
 * - /admin/workflows/new              -> WorkflowDetailAdmin (tạo mới)
 * - /admin/workflows/:id              -> WorkflowDetailAdmin (cập nhật)
 * - /admin/workflows/users            -> WorkflowsUsersAdmin
 * - /admin/topups                     -> TopupAdminList
 * - /admin/users                      -> UsersAdminList
 * - /admin, /admin/* (khác)           -> Dashboard (fallback)
 */
const SimpleAdminRoutes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Admin: sidebar cứ để dark cho dễ nhìn
  useEffect(() => {
    dispatch(
      changeSideBarTheme(layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DARK)
    );
  }, [dispatch]);

  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path=""
        element={
          <VerticalLayout>
            <Dashboard />
          </VerticalLayout>
        }
      />
      <Route
        path="dashboard"
        element={
          <VerticalLayout>
            <Dashboard />
          </VerticalLayout>
        }
      />

      {/* E-learning */}
      <Route
        path="elearning/categories"
        element={
          <VerticalLayout>
            <CourseCategoriesAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="elearning/courses/:id"
        element={
          <VerticalLayout>
            <CourseDetailAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="elearning/courses"
        element={
          <VerticalLayout>
            <CoursesAdminList />
          </VerticalLayout>
        }
      />

      {/* VPS */}
      <Route
        path="vps/orders"
        element={
          <VerticalLayout>
            <VpsAdminOrders />
          </VerticalLayout>
        }
      />
      <Route
        path="vps"
        element={
          <VerticalLayout>
            <VpsAdminList />
          </VerticalLayout>
        }
      />

      {/* Workflows */}
      <Route
        path="workflows/categories"
        element={
          <VerticalLayout>
            <WorkflowCategoriesAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="workflows/new"
        element={
          <VerticalLayout>
            <WorkflowDetailAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="workflows/users"
        element={
          <VerticalLayout>
            <WorkflowsUsersAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="workflows/orders"
        element={
          <VerticalLayout>
            <WorkflowsAdminOrders />
          </VerticalLayout>
        }
      />
      <Route
        path="workflows/:id"
        element={
          <VerticalLayout>
            <WorkflowDetailAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="workflows"
        element={
          <VerticalLayout>
            <WorkflowsAdminList />
          </VerticalLayout>
        }
      />

      {/* Topups */}
      <Route
        path="topups"
        element={
          <VerticalLayout>
            <TopupAdminList />
          </VerticalLayout>
        }
      />

      {/* Users */}
      <Route
        path="users/new"
        element={
          <VerticalLayout>
            <UserAdminDetail />
          </VerticalLayout>
        }
      />
      <Route
        path="users/:id"
        element={
          <VerticalLayout>
            <UserAdminDetail />
          </VerticalLayout>
        }
      />
      <Route
        path="users"
        element={
          <VerticalLayout>
            <UsersAdminList />
          </VerticalLayout>
        }
      />

      {/* Documents */}
      <Route
        path="documents/new"
        element={
          <VerticalLayout>
            <DocumentsAdminDetail />
          </VerticalLayout>
        }
      />
      <Route
        path="documents/:id"
        element={
          <VerticalLayout>
            <DocumentsAdminDetail />
          </VerticalLayout>
        }
      />
      <Route
        path="documents"
        element={
          <VerticalLayout>
            <DocumentsAdminList />
          </VerticalLayout>
        }
      />

      {/* Banks */}
      <Route
        path="banks"
        element={
          <VerticalLayout>
            <BankAdminList />
          </VerticalLayout>
        }
      />

      {/* Fallback: mọi route khác trong /admin -> Dashboard */}
      <Route
        path="*"
        element={
          <VerticalLayout>
            <Dashboard />
          </VerticalLayout>
        }
      />
    </Routes>
  );
};

export default SimpleAdminRoutes;


