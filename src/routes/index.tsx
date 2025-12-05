/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";
import TicketsApp from "../pages/apps/Tickets";

// lazy load all the views

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const RecoverPassword = React.lazy(() => import("../pages/auth/RecoverPassword"));
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));

// dashboard 
const Dashboard = React.lazy(() => import("../pages/dashboard/"));

// apps 
const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
const FileManagerApp = React.lazy(() => import('../pages/apps/FileManager'));
const KanbanApp = React.lazy(() => import('../pages/apps/Kanban'));
const ProjectCreate = React.lazy(() => import('../pages/apps/Project/Create'));
const ProjectDetail = React.lazy(() => import('../pages/apps/Project/Detail'));
const ProjectList = React.lazy(() => import('../pages/apps/Project/List'));
const CoursesAdminList = React.lazy(() => import("../pages/apps/CoursesAdmin/List"));
const CourseCategoriesAdmin = React.lazy(() => import("../pages/apps/CoursesAdmin/Categories"));
const CourseDetailAdmin = React.lazy(() => import("../pages/apps/CoursesAdmin/Detail"));
const VideosAdmin = React.lazy(() => import("../pages/apps/CoursesAdmin/Videos"));
const UsersAdminList = React.lazy(() => import("../pages/apps/UserAdmin/List"));
const UserAdminDetail = React.lazy(() => import("../pages/apps/UserAdmin/Detail"));
const VpsAdminList = React.lazy(() => import("../pages/apps/VpsAdmin/List"));
const VpsAdminOrders = React.lazy(() => import("../pages/apps/VpsAdmin/VpsOrders"));
const WorkflowsAdminList = React.lazy(() => import("../pages/apps/WorkflowsAdmin/List"));
const WorkflowCategoriesAdmin = React.lazy(() => import("../pages/apps/WorkflowsAdmin/Categories"));
const WorkflowDetailAdmin = React.lazy(() => import("../pages/apps/WorkflowsAdmin/Detail"));
const WorkflowsUsersAdmin = React.lazy(() => import("../pages/apps/WorkflowsAdmin/Users"));
const WorkflowsAdminOrders = React.lazy(() => import("../pages/apps/WorkflowsAdmin/Orders"));
const TopupAdminList = React.lazy(() => import("../pages/apps/TopupAdmin/List"));
const TopupAdminDetail = React.lazy(() => import("../pages/apps/TopupAdmin/Detail"));
const DocumentsAdminList = React.lazy(() => import("../pages/apps/DocumentsAdmin/List"));
const DocumentsAdminDetail = React.lazy(() => import("../pages/apps/DocumentsAdmin/Detail"));
const BankAdminList = React.lazy(() => import("../pages/apps/BankAdmin/List"));

// extra pages 
const Starter = React.lazy(() => import('../pages/extra/Starter'));
const Timeline = React.lazy(() => import('../pages/extra/TimeLine'));
const Invoice = React.lazy(() => import('../pages/extra/Invoice'));
const Gallery = React.lazy(() => import('../pages/extra/Gallery'));
const FAQs = React.lazy(() => import('../pages/extra/FAQs'));
const Pricing = React.lazy(() => import('../pages/extra/Pricing'));

// error pages
const Maintenance = React.lazy(() => import('../pages/error/Maintenance'));
const ComingSoon = React.lazy(() => import('../pages/error/ComingSoon'));
const Error404 = React.lazy(() => import('../pages/error/Error404'));
const Error404Alt = React.lazy(() => import('../pages/error/Error404Alt'));
const Error500 = React.lazy(() => import('../pages/error/Error500'));

// base ui
const Accordions = React.lazy(() => import('../pages/ui/Accordions'));
const Alerts = React.lazy(() => import('../pages/ui/Alerts'));
const Avatars = React.lazy(() => import('../pages/ui/Avatars'));
const Buttons = React.lazy(() => import('../pages/ui/Buttons'));
const Badges = React.lazy(() => import('../pages/ui/Badges'));
const Breadcrumb = React.lazy(() => import('../pages/ui/Breadcrumb'));
const Cards = React.lazy(() => import('../pages/ui/Cards'));
const Collapse = React.lazy(() => import('../pages/ui/Collapse'));
const Dismissible = React.lazy(() => import('../pages/ui/Dismissible'));
const Dropdowns = React.lazy(() => import('../pages/ui/Dropdowns'));
const Progress = React.lazy(() => import('../pages/ui/Progress'));
const Skeleton = React.lazy(() => import('../pages/ui/Skeleton'));
const Spinners = React.lazy(() => import('../pages/ui/Spinners'));
const ListGroup = React.lazy(() => import('../pages/ui/ListGroup'));
const Ratio = React.lazy(() => import('../pages/ui/Ratio'));
const Tabs = React.lazy(() => import('../pages/ui/Tabs'));
const Modals = React.lazy(() => import('../pages/ui/Modals'));
const Offcanvas = React.lazy(() => import('../pages/ui/Offcanvas'));
const Popovers = React.lazy(() => import('../pages/ui/Popovers'));
const Tooltips = React.lazy(() => import('../pages/ui/Tooltips'));
const Typography = React.lazy(() => import('../pages/ui/Typography'));

// extended ui
const Swiper = React.lazy(() => import('../pages/extended/Swiper'));
const NestableList = React.lazy(() => import('../pages/extended/NestableList'));
const Ratings = React.lazy(() => import('../pages/extended/Ratings'));
const Animation = React.lazy(() => import('../pages/extended/Animation'));
const Player = React.lazy(() => import('../pages/extended/Player'));
const Scrollbar = React.lazy(() => import('../pages/extended/Scrollbar'));
const SweetAlert = React.lazy(() => import('../pages/extended/SweetAlert'));
const TourPage = React.lazy(() => import('../pages/extended/TourPage'));
const TippyTooltip = React.lazy(() => import('../pages/extended/TippyTooltip'));
const Lightbox = React.lazy(() => import('../pages/extended/Lightbox'));

// forms
const FormElements = React.lazy(() => import('../pages/forms/FormElements'));
const FormSelect = React.lazy(() => import('../pages/forms/Select'));
const Range = React.lazy(() => import('../pages/forms/Range'));
const Pickers = React.lazy(() => import('../pages/forms/Pickers'));
const Masks = React.lazy(() => import('../pages/forms/Masks'));
const Editor = React.lazy(() => import('../pages/forms/Editor'));
const FileUploads = React.lazy(() => import('../pages/forms/FileUploads'));
const Validation = React.lazy(() => import('../pages/forms/Validation'));
const FormLayout = React.lazy(() => import('../pages/forms/FormLayout'));

// tables
const BasicTables = React.lazy(() => import('../pages/tables/BasicTables'));
const DataTables = React.lazy(() => import('../pages/tables/DataTables'));

// icons
const MingCuteIcons = React.lazy(() => import('../pages/ui/icons/MingCuteIcons'));
const FeatherIcons = React.lazy(() => import('../pages/ui/icons/FeatherIcons'));
const MaterialSymbolIcons = React.lazy(() => import('../pages/ui/icons/MaterialSymbolIcons'));

// chart
const Chart = React.lazy(() => import('../pages/ui/Chart'));

// maps
const VectorMaps = React.lazy(() => import('../pages/ui/maps/VectorMaps'));
const GoogleMaps = React.lazy(() => import('../pages/ui/maps/GoogleMaps'));

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

// dashboards (admin)
const dashboardRoutes: RoutesProps = {
  path: "/admin/home",
  name: "Dashboards",
  icon: "home",
  header: "Navigation",
  children: [
    {
      path: "/admin",
      name: "Root",
      element: <Navigate to='/admin/dashboard' />,
      route: PrivateRoute,
    },
    {
      path: '/admin/dashboard',
      name: "Dashboard",
      element: <Dashboard />,
      route: PrivateRoute,
    },
  ],
};

// Apps (admin)
const calendarAppRoutes: RoutesProps = {
  path: "/admin/apps/calendar",
  name: "Calendar",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "calendar",
  element: <CalendarApp />,
  header: "Apps",
};

const ticketsAppRoutes: RoutesProps = {
  path: "/admin/apps/tickets",
  name: "Tickets",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "tickets",
  element: <TicketsApp />,
  header: "Apps",
};

const fileAppRoutes: RoutesProps = {
  path: "/admin/apps/file-manager",
  name: "File Manager",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "filemanager",
  element: <FileManagerApp />,
  header: "Apps",
};

const kanbanAppRoutes: RoutesProps = {
  path: "/admin/apps/kanban",
  name: "Kanban Board",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "kanban",
  element: <KanbanApp />,
  header: "Apps",
};

const projectAppRoutes: RoutesProps = {
  path: "/admin/apps/project",
  name: "Project",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "project",
  children: [
    {
      path: '/admin/apps/project/list',
      name: 'ProjectList',
      element: <ProjectList />,
      route: PrivateRoute,
    },
    {
      path: '/admin/apps/project/detail',
      name: 'ProjectDetail',
      element: <ProjectDetail />,
      route: PrivateRoute,
    },
    {
      path: '/admin/apps/project/create',
      name: 'ProjectCreate',
      element: <ProjectCreate />,
      route: PrivateRoute,
    },
  ]
};

const coursesAppRoutes: RoutesProps = {
  path: "/admin/elearning",
  name: "E-Learning",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "book",
  children: [
    {
      path: "/admin/elearning/categories",
      name: "CourseCategories",
      element: <CourseCategoriesAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/elearning/courses",
      name: "CoursesAdminList",
      element: <CoursesAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/elearning/courses/:id",
      name: "CourseDetailAdmin",
      element: <CourseDetailAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/elearning/videos",
      name: "VideosAdmin",
      element: <VideosAdmin />,
      route: PrivateRoute,
    },
  ],
};

const usersAppRoutes: RoutesProps = {
  path: "/admin/users-root",
  name: "Users",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "users",
  children: [
    {
      path: "/admin/users",
      name: "UsersAdminList",
      element: <UsersAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/users/new",
      name: "UserAdminDetailNew",
      element: <UserAdminDetail />,
      route: PrivateRoute,
    },
    {
      path: "/admin/users/:id",
      name: "UserAdminDetail",
      element: <UserAdminDetail />,
      route: PrivateRoute,
    },
  ],
};

const vpsAdminRoutes: RoutesProps = {
  path: "/admin/vps-root",
  name: "VPS",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "cloud",
  children: [
    {
      path: "/admin/vps",
      name: "VpsAdminList",
      element: <VpsAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/vps/orders",
      name: "VpsAdminOrders",
      element: <VpsAdminOrders />,
      route: PrivateRoute,
    },
  ],
};

const workflowsAdminRoutes: RoutesProps = {
  path: "/admin/workflows-root",
  name: "WorkflowsAdmin",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "workflow",
  children: [
    {
      path: "/admin/workflows/categories",
      name: "WorkflowCategoriesAdmin",
      element: <WorkflowCategoriesAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows",
      name: "WorkflowsAdminList",
      element: <WorkflowsAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows/categories",
      name: "WorkflowCategoriesAdmin",
      element: <WorkflowCategoriesAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows/new",
      name: "WorkflowDetailAdminNew",
      element: <WorkflowDetailAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows/users",
      name: "WorkflowsUsersAdmin",
      element: <WorkflowsUsersAdmin />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows/orders",
      name: "WorkflowsAdminOrders",
      element: <WorkflowsAdminOrders />,
      route: PrivateRoute,
    },
    {
      path: "/admin/workflows/:id",
      name: "WorkflowDetailAdmin",
      element: <WorkflowDetailAdmin />,
      route: PrivateRoute,
    },
  ],
};

const topupAdminRoutes: RoutesProps = {
  path: "/admin/topups-root",
  name: "TopupsAdmin",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "credit-card",
  children: [
    {
      path: "/admin/topups",
      name: "TopupAdminList",
      element: <TopupAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/topups/:code",
      name: "TopupAdminDetail",
      element: <TopupAdminDetail />,
      route: PrivateRoute,
    },
  ],
};

const documentsAdminRoutes: RoutesProps = {
  path: "/admin/documents-root",
  name: "DocumentsAdmin",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "file",
  children: [
    {
      path: "/admin/documents",
      name: "DocumentsAdminList",
      element: <DocumentsAdminList />,
      route: PrivateRoute,
    },
    {
      path: "/admin/documents/new",
      name: "DocumentsAdminDetailNew",
      element: <DocumentsAdminDetail />,
      route: PrivateRoute,
    },
    {
      path: "/admin/documents/:id",
      name: "DocumentsAdminDetail",
      element: <DocumentsAdminDetail />,
      route: PrivateRoute,
    },
  ],
};

const bankAdminRoutes: RoutesProps = {
  path: "/admin/banks-root",
  name: "BanksAdmin",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "bank",
  children: [
    {
      path: "/admin/banks",
      name: "BankAdminList",
      element: <BankAdminList />,
      route: PrivateRoute,
    },
  ],
};

const appRoutes = [
  calendarAppRoutes,
  ticketsAppRoutes,
  projectAppRoutes,
  kanbanAppRoutes,
  fileAppRoutes,
  coursesAppRoutes,
  usersAppRoutes,
  vpsAdminRoutes,
  workflowsAdminRoutes,
  topupAdminRoutes,
  documentsAdminRoutes,
  bankAdminRoutes,
];

// pages (admin)
const customPagesRoutes = {
  path: "/admin/pages",
  name: "Pages",
  icon: "pages",
  header: "Custom",
  children: [
    {
      path: "/admin/pages/starter",
      name: "Starter",
      element: <Starter />,
      route: PrivateRoute,
    },
    {
      path: "/admin/pages/timeline",
      name: "Timeline",
      element: <Timeline />,
      route: PrivateRoute,
    },
    {
      path: "/admin/pages/invoice",
      name: "Invoice",
      element: <Invoice />,
      route: PrivateRoute,
    },
    {
      path: "/admin/pages/gallery",
      name: "Gallery",
      element: <Gallery />,
      route: PrivateRoute,
    },
    {
      path: "/admin/pages/faqs",
      name: "FAQs",
      element: <FAQs />,
      route: PrivateRoute,
    },
    {
      path: "/admin/pages/pricing",
      name: "Pricing",
      element: <Pricing />,
      route: PrivateRoute,
    },
    {
      path: "/admin/error-404-alt",
      name: "Error - 404-alt",
      element: <Error404Alt />,
      route: PrivateRoute,
    },
  ],
};

// tables (admin)
const tableRoutes = {
  path: "/admin/tables",
  name: "Tables",
  icon: "table",
  header: "Elements",
  children: [
    {
      path: "/admin/ui/tables/basic-tables",
      name: "Basic Tables",
      element: <BasicTables />,
      route: PrivateRoute,
    },
    {
      path: "/admin/ui/tables/data-tables",
      name: "Data Tables",
      element: <DataTables />,
      route: PrivateRoute,
    },
  ]
}

// ui (admin)
const uiRoutes: RoutesProps = {
  path: "/admin/ui",
  name: "Components",
  icon: "pocket",
  header: "Elements",
  children: [
    {
      path: "/admin/ui/components",
      name: "Components",
      children: [
        {
          path: "/admin/ui/accordions",
          name: "Accordions",
          element: <Accordions />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/alerts",
          name: "Alerts",
          element: <Alerts />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/avatars",
          name: "Avatars",
          element: <Avatars />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/buttons",
          name: "Buttons",
          element: <Buttons />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/badges",
          name: "Badges",
          element: <Badges />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/breadcrumb",
          name: "Breadcrumb",
          element: <Breadcrumb />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/cards",
          name: "Cards",
          element: <Cards />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/collapse",
          name: "Collapse",
          element: <Collapse />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/dismissible",
          name: "Dismissible",
          element: <Dismissible />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/dropdowns",
          name: "Dropdowns",
          element: <Dropdowns />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/progress",
          name: "Progress",
          element: <Progress />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/skeleton",
          name: "Skeleton",
          element: <Skeleton />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/spinners",
          name: "Spinners",
          element: <Spinners />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/list-group",
          name: "List Group",
          element: <ListGroup />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/ratio",
          name: "Ratio",
          element: <Ratio />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/tab",
          name: "Tab",
          element: <Tabs />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/modals",
          name: "Modals",
          element: <Modals />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/offcanvas",
          name: "Offcanvas",
          element: <Offcanvas />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/popovers",
          name: "Popovers",
          element: <Popovers />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/tooltips",
          name: "Tooltips",
          element: <Tooltips />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/typography",
          name: "Typography",
          element: <Typography />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/admin/extended',
      name: 'Extended',
      children: [
        {
          path: "/admin/extended/swiper",
          name: "Swiper",
          element: <Swiper />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/nestable-list",
          name: "Nestable List",
          element: <NestableList />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/ratings",
          name: "Ratings",
          element: <Ratings />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/animation",
          name: "Animation",
          element: <Animation />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/player",
          name: "Player",
          element: <Player />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/scrollbar",
          name: "Scrollbar",
          element: <Scrollbar />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/sweet-alert",
          name: "Sweet Alert",
          element: <SweetAlert />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/tour",
          name: "Tourpage",
          element: <TourPage />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/tooltippy",
          name: "Tippy Tooltip",
          element: <TippyTooltip />,
          route: PrivateRoute,
        },
        {
          path: "/admin/extended/lightbox",
          name: "Lightbox",
          element: <Lightbox />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/admin/ui/forms',
      name: 'Forms',
      children: [
        {
          path: "/admin/ui/forms/form-elements",
          name: "Form Elements",
          element: <FormElements />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/select",
          name: "Select",
          element: <FormSelect />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/range",
          name: "Range",
          element: <Range />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/pickers",
          name: "Pickers",
          element: <Pickers />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/masks",
          name: "Masks",
          element: <Masks />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/editor",
          name: "Editor",
          element: <Editor />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/file-upload",
          name: "File Uploads",
          element: <FileUploads />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/validation",
          name: "Validation",
          element: <Validation />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/forms/form-layout",
          name: "Form Layout",
          element: <FormLayout />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/admin/ui/icons',
      name: 'Icons',
      children: [
        {
          path: "/admin/ui/icons/mingcute",
          name: "Mingcute",
          element: <MingCuteIcons />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/icons/feather",
          name: "Feather",
          element: <FeatherIcons />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/icons/material",
          name: "Material Symbols",
          element: <MaterialSymbolIcons />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/admin/ui/maps',
      name: 'Maps',
      children: [
        {
          path: "/admin/ui/maps/vector-maps",
          name: "Vector Maps",
          element: <VectorMaps />,
          route: PrivateRoute,
        },
        {
          path: "/admin/ui/maps/google-maps",
          name: "Google Maps",
          element: <GoogleMaps />,
          route: PrivateRoute,
        },
      ],
    },
  ],
};

const chartRoutes: RoutesProps = {
  path: "/admin/ui/chart",
  name: "Chart",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "Chart",
  element: <Chart />,
  header: "Elements",
};

// auth (admin)
const authRoutes: RoutesProps[] = [
  {
    path: "/admin/auth/login",
    name: "Login",
    element: <Login />,
    route: Route,
  },
  {
    path: "/admin/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },
  {
    path: "/admin/auth/recover-password",
    name: "Recover Password",
    element: <RecoverPassword />,
    route: Route,
  },
  {
    path: "/admin/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
];

// public routes (admin)
const otherPublicRoutes = [
  {
    path: "/admin/*",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/admin/maintenance",
    name: "Maintenance",
    element: <Maintenance />,
    route: Route,
  },
  {
    path: "/admin/coming-soon",
    name: "Coming Soon",
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: "/admin/error-404",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/admin/error-500",
    name: "Error - 500",
    element: <Error500 />,
    route: Route,
  },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);
    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes,
  ...appRoutes,
  customPagesRoutes,
  tableRoutes,
  uiRoutes,
  chartRoutes,
];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
