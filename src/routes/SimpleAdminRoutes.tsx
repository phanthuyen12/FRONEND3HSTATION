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
import NodeverseDevicesAdmin from "../pages/apps/VpsAdmin/NodeverseDevices";
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
import RanksAdminList from "../pages/apps/RanksAdmin/List";
import ConfigAdmin from "../pages/apps/ConfigAdmin";
import AIChatAdmin from "../pages/apps/AIChatAdmin";
import ToolPackagesAdmin from "../pages/apps/ToolsAdmin/Packages";
import ToolKeysAdmin from "../pages/apps/ToolsAdmin/Keys";
import SupportAdminList from "../pages/apps/SupportAdmin/List";
import SupportRefLinksAdmin from "../pages/apps/SupportAdmin/RefLinks";
import FacebookAdmin from '../pages/apps/AdminTools/FacebookAdmin';
import FacebookPages from '../pages/apps/AdminTools/FacebookAdmin/Pages';
import FacebookPosts from '../pages/apps/AdminTools/FacebookAdmin/Posts';
import FacebookCallback from '../pages/apps/AdminTools/FacebookAdmin/Callback';
import LandingPageList from "../pages/apps/LandingPageAdmin/List";
import LandingPageEdit from "../pages/apps/LandingPageAdmin/Edit";
import LandingPageDomains from "../pages/apps/LandingPageAdmin/Domains";
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
      <Route
        path="vps/nodeverse"
        element={
          <VerticalLayout>
            <NodeverseDevicesAdmin />
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

      {/* Ranks */}
      <Route
        path="ranks"
        element={
          <VerticalLayout>
            <RanksAdminList />
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

      {/* Tools/Software Keys */}
      <Route
        path="tools"
        element={
          <VerticalLayout>
            <ToolPackagesAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="tools/keys"
        element={
          <VerticalLayout>
            <ToolKeysAdmin />
          </VerticalLayout>
        }
      />

      {/* Configs */}
      <Route
        path="configs"
        element={
          <VerticalLayout>
            <ConfigAdmin />
          </VerticalLayout>
        }
      />
      <Route
        path="ai-chat"
        element={
          <VerticalLayout>
            <AIChatAdmin />
          </VerticalLayout>
        }
      />

      {/* Support requests */}
      <Route
        path="support-requests"
        element={
          <VerticalLayout>
            <SupportAdminList />
          </VerticalLayout>
        }
      />
      <Route
        path="support-ref-links"
        element={
          <VerticalLayout>
            <SupportRefLinksAdmin />
          </VerticalLayout>
        }
      />
        {/* Facebook Admin */}
        <Route path="facebook" element={<VerticalLayout><FacebookAdmin /></VerticalLayout>} />
        <Route path="facebook/callback" element={<VerticalLayout><FacebookCallback /></VerticalLayout>} />
        <Route path="facebook/pages" element={<VerticalLayout><FacebookPages /></VerticalLayout>} />
        <Route path="facebook/posts" element={<VerticalLayout><FacebookPosts /></VerticalLayout>} />

      {/* Landing Pages */}
      <Route
        path="landing-pages"
        element={
          <VerticalLayout>
            <LandingPageList />
          </VerticalLayout>
        }
      />
      <Route
        path="landing-pages/domains"
        element={
          <VerticalLayout>
            <LandingPageDomains />
          </VerticalLayout>
        }
      />
      <Route
        path="landing-pages/:id"
        element={
          <VerticalLayout>
            <LandingPageEdit />
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
