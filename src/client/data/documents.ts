export interface DocumentCategory {
  id: string;
  name: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  type: "pdf" | "ppt" | "doc" | "sheet";
  size: string;
  updatedAt: string;
}

export const documentCategories: DocumentCategory[] = [
  { id: "dev", name: "Lập trình & Công nghệ" },
  { id: "design", name: "Thiết kế" },
  { id: "business", name: "Kinh doanh" },
  { id: "language", name: "Ngôn ngữ" },
];

export const documents: DocumentItem[] = [
  {
    id: "react-cheatsheet",
    title: "React Cheatsheet 2025",
    description: "Tổng hợp các hooks và pattern quan trọng trong React.",
    categoryId: "dev",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "Hôm qua",
  },
  {
    id: "typescript-style-guide",
    title: "TypeScript Style Guide",
    description: "Quy tắc viết code TypeScript sạch, dễ bảo trì.",
    categoryId: "dev",
    type: "doc",
    size: "1.1 MB",
    updatedAt: "3 ngày trước",
  },
  {
    id: "ui-design-kit",
    title: "UI Design System Kit",
    description: "Bộ UI components chuẩn hoá cho các dự án thiết kế.",
    categoryId: "design",
    type: "ppt",
    size: "18 MB",
    updatedAt: "1 tuần trước",
  },
  {
    id: "business-model-canvas",
    title: "Business Model Canvas Template",
    description: "Mẫu canvas cho việc thiết kế mô hình kinh doanh.",
    categoryId: "business",
    type: "sheet",
    size: "500 KB",
    updatedAt: "2 tuần trước",
  },
  {
    id: "english-phrases",
    title: "1000 câu giao tiếp tiếng Anh thông dụng",
    description: "Tài liệu PDF luyện câu giao tiếp mỗi ngày.",
    categoryId: "language",
    type: "pdf",
    size: "3.2 MB",
    updatedAt: "5 ngày trước",
  },
];















