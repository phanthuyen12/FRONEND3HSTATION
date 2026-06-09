export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'menu',
    label: 'Menu',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/admin/dashboard'
  },
  {
    key: 'apps',
    label: 'Apps',
    isTitle: true,
  },
  {
    key: "apps-elearning",
    label: "E-Learning",
    isTitle: false,
    icon: "mgc_book_3_line",
    children: [
      {
        key: "elearning-categories",
        label: "Danh mục khoá học",
        url: "/admin/elearning/categories",
        parentKey: "apps-elearning",
      },
      {
        key: "elearning-courses",
        label: "Khoá học",
        url: "/admin/elearning/courses",
        parentKey: "apps-elearning",
      },
    ],
  },
  {
    key: "apps-ranks",
    label: "Rank",
    isTitle: false,
    icon: "mgc_medal_line",
    children: [
      {
        key: "ranks-list",
        label: "Quản lý Rank",
        url: "/admin/ranks",
        parentKey: "apps-ranks",
      },
    ],
  },
  {
    key: "apps-vps",
    label: "VPS",
    isTitle: false,
    icon: "mgc_cloud_line",
    children: [
      {
        key: "vps-list",
        label: "Quản lý gói VPS",
        url: "/admin/vps",
        parentKey: "apps-vps",
      },
      {
        key: "vps-nodeverse",
        label: "Nodeverse Plans",
        url: "/admin/vps/nodeverse",
        parentKey: "apps-vps",
      },
      {
        key: "vps-orders",
        label: "Đơn hàng VPS",
        url: "/admin/vps/orders",
        parentKey: "apps-vps",
      },
    ],
  },
  {
    key: "apps-workflows",
    label: "Workflows",
    isTitle: false,
    icon: "mgc_chart_pie_line",
    children: [
      {
        key: "workflows-categories",
        label: "Danh mục Workflows",
        url: "/admin/workflows/categories",
        parentKey: "apps-workflows",
      },
      {
        key: "workflows-list",
        label: "Workflows",
        url: "/admin/workflows",
        parentKey: "apps-workflows",
      },
      {
        key: "workflows-users",
        label: "User đăng ký",
        url: "/admin/workflows/users",
        parentKey: "apps-workflows",
      },
      {
        key: "workflows-orders",
        label: "Đơn hàng Workflows",
        url: "/admin/workflows/orders",
        parentKey: "apps-workflows",
      },
    ],
  },
  {
    key: "apps-topups",
    label: "Nạp tiền",
    isTitle: false,
    icon: "mgc_wallet_3_line",
    children: [
      {
        key: "topups-list",
        label: "Quản lý nạp tiền",
        url: "/admin/topups",
        parentKey: "apps-topups",
      },
    ],
  },
  {
    key: "apps-banks",
    label: "Tài khoản ngân hàng",
    isTitle: false,
    icon: "mgc_bank_line",
    children: [
      {
        key: "banks-list",
        label: "Quản lý tài khoản ngân hàng",
        url: "/admin/banks",
        parentKey: "apps-banks",
      },
    ],
  },
  {
    key: "apps-documents",
    label: "Tài liệu",
    isTitle: false,
    icon: "mgc_file_line",
    children: [
      {
        key: "documents-list",
        label: "Quản lý tài liệu",
        url: "/admin/documents",
        parentKey: "apps-documents",
      },
    ],
  },
  {
    key: "apps-users",
    label: "Users",
    isTitle: false,
    icon: "mgc_user_3_line",
    children: [
      {
        key: "users-list",
        label: "Danh sách user",
        url: "/admin/users",
        parentKey: "apps-users",
      },
    ],
  },
  {
    key: "apps-tools",
    label: "Phần mềm & Key",
    isTitle: false,
    icon: "mgc_key_line",
    children: [
      {
        key: "tools-packages",
        label: "Dịch vụ phần mềm",
        url: "/admin/tools",
        parentKey: "apps-tools",
      },
      {
        key: "tools-keys",
        label: "Lịch sử Key",
        url: "/admin/tools/keys",
        parentKey: "apps-tools",
      },
    ],
  },
  {
    key: "apps-configs",
    label: "Cấu hình hệ thống",
    isTitle: false,
    icon: "mgc_settings_3_line",
    url: "/admin/configs",
  },
  {
    key: 'elements',
    label: 'Elements',
    isTitle: true,
  },
  {
    key: 'components',
    label: 'Components',
    isTitle: false,
    icon: 'mgc_classify_2_line',
    children: [
      {
        key: 'ui-accordions',
        label: 'Accordions',
        url: '/admin/ui/accordions',
        parentKey: 'components',
      },
      {
        key: 'ui-alerts',
        label: 'Alerts',
        url: '/admin/ui/alerts',
        parentKey: 'components',
      },
      {
        key: 'ui-avatars',
        label: 'Avatars',
        url: '/admin/ui/avatars',
        parentKey: 'components',
      },
      {
        key: 'ui-buttons',
        label: 'Buttons',
        url: '/admin/ui/buttons',
        parentKey: 'components',
      },
      {
        key: 'ui-badges',
        label: 'Badges',
        url: '/admin/ui/badges',
        parentKey: 'components',
      },
      {
        key: 'ui-breadcrumb',
        label: 'Breadcrumb',
        url: '/admin/ui/breadcrumb',
        parentKey: 'components',
      },
      {
        key: 'ui-cards',
        label: 'Cards',
        url: '/admin/ui/cards',
        parentKey: 'components',
      },
      {
        key: 'ui-collapse',
        label: 'Collapse',
        url: '/admin/ui/collapse',
        parentKey: 'components',
      },
      {
        key: 'ui-dismissible',
        label: 'Dismissible',
        url: '/admin/ui/dismissible',
        parentKey: 'components',
      },
      {
        key: 'ui-dropdowns',
        label: 'Dropdowns',
        url: '/admin/ui/dropdowns',
        parentKey: 'components',
      },
      {
        key: 'ui-progress',
        label: 'Progress',
        url: '/admin/ui/progress',
        parentKey: 'components',
      },
      {
        key: 'ui-skeleton',
        label: 'Skeleton',
        url: '/admin/ui/skeleton',
        parentKey: 'components',
      },
      {
        key: 'ui-spinners',
        label: 'Spinners',
        url: '/admin/ui/spinners',
        parentKey: 'components',
      },
      {
        key: 'ui-list-group',
        label: 'List Group',
        url: '/admin/ui/list-group',
        parentKey: 'components',
      },
      {
        key: 'ui-ratio',
        label: 'Ratio',
        url: '/admin/ui/ratio',
        parentKey: 'components',
      },
      {
        key: 'tab',
        label: 'Tab',
        url: '/admin/ui/tab',
        parentKey: 'components',
      },
      {
        key: 'ui-modals',
        label: 'Modals',
        url: '/admin/ui/modals',
        parentKey: 'components',
      },
      {
        key: 'ui-offcanvas',
        label: 'Offcanvas',
        url: '/admin/ui/offcanvas',
        parentKey: 'components',
      },
      {
        key: 'ui-popovers',
        label: 'Popovers',
        url: '/admin/ui/popovers',
        parentKey: 'components',
      },
      {
        key: 'ui-tooltips',
        label: 'Tooltips',
        url: '/admin/ui/tooltips',
        parentKey: 'components',
      },
      {
        key: 'ui-typography',
        label: 'Typography',
        url: '/admin/ui/typography',
        parentKey: 'components',
      },
    ],
  },
  {
    key: 'extended',
    label: 'Extended UI',
    isTitle: false,
    icon: 'mgc_box_3_line',
    children: [
      {
        key: 'extended-swiper',
        label: 'Swiper',
        url: '/admin/extended/swiper',
        parentKey: 'extended',
      },
      {
        key: 'extended-nestable-list',
        label: 'Nestable List',
        url: '/admin/extended/nestable-list',
        parentKey: 'extended',
      },
      {
        key: 'extended-ratings',
        label: 'Ratings',
        url: '/admin/extended/ratings',
        parentKey: 'extended',
      },
      {
        key: 'extended-animation',
        label: 'Animation',
        url: '/admin/extended/animation',
        parentKey: 'extended',
      },
      {
        key: 'extended-player',
        label: 'Player',
        url: '/admin/extended/player',
        parentKey: 'extended',
      },
      {
        key: 'extended-scrollbar',
        label: 'Scrollbar',
        url: '/admin/extended/scrollbar',
        parentKey: 'extended',
      },
      {
        key: 'extended-sweet-alert',
        label: 'Sweet Alert',
        url: '/admin/extended/sweet-alert',
        parentKey: 'extended',
      },
      {
        key: 'extended-tour',
        label: 'Tour',
        url: '/admin/extended/tour',
        parentKey: 'extended',
      },
      {
        key: 'extended-tooltippy',
        label: 'Tippy Tooltip',
        url: '/admin/extended/tooltippy',
        parentKey: 'extended',
      },
      {
        key: 'extended-lightbox',
        label: 'Lightbox',
        url: '/admin/extended/lightbox',
        parentKey: 'extended',
      },
    ],
  },
  {
    key: 'forms',
    label: 'Forms',
    isTitle: false,
    icon: 'mgc_file_check_line',
    children: [
      {
        key: 'forms-form-elements',
        label: 'Form Elements',
        url: '/admin/ui/forms/form-elements',
        parentKey: 'forms',
      },
      {
        key: 'forms-select',
        label: 'Select',
        url: '/admin/ui/forms/select',
        parentKey: 'forms',
      },
      {
        key: 'forms-range',
        label: 'Range',
        url: '/admin/ui/forms/range',
        parentKey: 'forms',
      },
      {
        key: 'forms-pickers',
        label: 'Pickers',
        url: '/admin/ui/forms/pickers',
        parentKey: 'forms',
      },
      {
        key: 'forms-masks',
        label: 'Masks',
        url: '/admin/ui/forms/masks',
        parentKey: 'forms',
      },
      {
        key: 'forms-editor',
        label: 'Editor',
        url: '/admin/ui/forms/editor',
        parentKey: 'forms',
      },
      {
        key: 'forms-file-upload',
        label: 'File Uploads',
        url: '/admin/ui/forms/file-upload',
        parentKey: 'forms',
      },
      {
        key: 'forms-validation',
        label: 'Validation',
        url: '/admin/ui/forms/validation',
        parentKey: 'forms',
      },
      {
        key: 'forms-form-layout',
        label: 'Form Layout',
        url: '/admin/ui/forms/form-layout',
        parentKey: 'forms',
      },
    ],
  },
  {
    key: 'tables',
    label: 'Tables',
    isTitle: false,
    icon: 'mgc_layout_grid_line',
    children: [
      {
        key: 'tables-basic',
        label: 'Basic Tables',
        url: '/admin/ui/tables/basic-tables',
        parentKey: 'tables',
      },
      {
        key: 'tables-data',
        label: 'Data Tables',
        url: '/admin/ui/tables/data-tables',
        parentKey: 'tables',
      },
    ],
  },
  {
    key: 'icons',
    label: 'Icons',
    isTitle: false,
    icon: 'mgc_dribbble_line',
    children: [
      {
        key: 'icons-mingcute',
        label: 'Mingcute',
        url: '/admin/ui/icons/mingcute',
        parentKey: 'icons',
      },
      {
        key: 'icons-feather',
        label: 'Feather',
        url: '/admin/ui/icons/feather',
        parentKey: 'icons',
      },
      {
        key: 'icons-material',
        label: 'Material Symbols',
        url: '/admin/ui/icons/material',
        parentKey: 'icons',
      },
    ],
  },
  {
    key: 'charts',
    label: 'Chart',
    isTitle: false,
    icon: 'mgc_chart_bar_line',
    url: '/admin/ui/chart',
  },
  {
    key: 'maps',
    label: 'Maps',
    isTitle: false,
    icon: 'mgc_location_line',
    children: [
      {
        key: 'maps-vector-maps',
        label: 'Vector maps',
        url: '/admin/ui/maps/vector-maps',
        parentKey: 'maps',
      },
      {
        key: 'maps-google-maps',
        label: 'Google maps',
        url: '/admin/ui/maps/google-maps',
        parentKey: 'maps',
      },
    ],
  },
];

const CLIENT_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "client-menu",
    label: "Client",
    isTitle: true,
  },
  {
    key: "client-home",
    label: "Trang chủ",
    icon: "mgc_home_3_line",
    url: "/",
  },
  {
    key: "client-courses",
    label: "Khóa học",
    icon: "mgc_book_3_line",
    url: "/courses",
  },
  {
    key: "client-my-courses",
    label: "Khóa học của tôi",
    icon: "mgc_book_4_line",
    url: "/my-courses",
  },
  {
    key: "client-documents",
    label: "Chia sẻ tài liệu",
    icon: "mgc_file_line",
    url: "/documents",
  },
  {
    key: "client-workflows",
    label: "Workflows",
    icon: "mgc_chart_pie_line",
    url: "/workflows",
  },
  {
    key: "client-profile",
    label: "Hồ sơ cá nhân",
    icon: "mgc_user_3_line",
    url: "/profile",
  },
  {
    key: "client-billing",
    label: "Nạp tiền",
    icon: "mgc_wallet_3_line",
    url: "/topup",
  },
  {
    key: "client-vps",
    label: "VPS",
    icon: "mgc_cloud_line",
    isTitle: false,
    children: [
      // {
      //   key: "client-vps-list",
      //   label: "Gói VPS",
      //   url: "/vps",
      //   parentKey: "client-vps",
      // },
      {
        key: "client-vps-nodeverse",
        label: "Đăng Ký VPS",
        url: "/vps/nodeverse",
        parentKey: "client-vps",
      },
      {
        key: "client-vps-manage",
        label: "Quản lý VPS",
        url: "/my-vps",
        parentKey: "client-vps",
      },
    ],
  },
  {
    key: "client-orders",
    label: "Đơn hàng đã mua",
    icon: "mgc_shopping_bag_3_line",
    url: "/orders",
  },
  {
    key: "client-tools-title",
    label: "Tool",
    isTitle: true,
  },
  {
    key: "client-software-keys",
    label: "Mua Key phần mềm",
    icon: "mgc_key_line",
    url: "/software-keys",
  },
  {
    key: "client-my-software-keys",
    label: "Key của tôi",
    icon: "mgc_safe_line",
    url: "/my-software-keys",
  },
  {
    key: "client-my-workflows",
    label: "Workflows của tôi",
    icon: "mgc_tool_line",
    url: "/my-workflows",
  },
  {
    key: "client-tool-facebook",
    label: "Tool Facebook",
    icon: "mgc_facebook_line",
    url: "/tools/facebook",
  },
  {
    key: "client-tool-tiktok",
    label: "Tool Tiktok",
    icon: "mgc_tiktok_line",
    url: "/tools/tiktok",
  },
  {
    key: "client-tool-instagram",
    label: "Tool Instagram",
    icon: "mgc_camera_2_line",
    url: "/tools/instagram",
  },
];

export { MENU_ITEMS, CLIENT_MENU_ITEMS };
