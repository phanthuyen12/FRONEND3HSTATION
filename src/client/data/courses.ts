import img1 from "../../assets/images/small/small-1.jpg";
import img2 from "../../assets/images/small/small-2.jpg";
import img3 from "../../assets/images/small/small-3.jpg";
import img4 from "../../assets/images/small/small-4.jpg";
import img5 from "../../assets/images/small/small-5.jpg";
import img6 from "../../assets/images/small/small-6.jpg";

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  source: "youtube" | "vimeo";
  videoId: string;
  description?: string;
  isPreview?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  isNew?: boolean;
  popular?: boolean;
  thumbnail: string;
  video: {
    source: "youtube" | "vimeo";
    id: string;
  };
  sections: CourseSection[];
}

export const courses: Course[] = [
  {
    id: "english-communication",
    title: "Tiếng Anh giao tiếp",
    shortDescription: "Học nhanh, nhớ lâu, luyện tập thực tế.",
    description:
      "Khoá học tiếng Anh giao tiếp giúp bạn tự tin nói chuyện trong các tình huống hằng ngày, luyện phát âm, từ vựng và phản xạ.",
    category: "Ngôn ngữ",
    level: "Cơ bản",
    price: "500.000đ",
    duration: "24 giờ",
    lessons: 32,
    students: 1200,
    rating: 4.8,
    isNew: true,
    thumbnail: img1,
    video: {
      source: "youtube",
      id: "PrUxWZiQfy4",
    },
    sections: [
      {
        id: "intro",
        title: "Làm quen với khoá học",
        lessons: [
          {
            id: "intro-1",
            title: "Giới thiệu khoá học & lộ trình",
            duration: "06:35",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
            isPreview: true,
          },
          {
            id: "intro-2",
            title: "Cách học hiệu quả & ghi chú",
            duration: "08:10",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
      {
        id: "basic",
        title: "Từ vựng & mẫu câu cơ bản",
        lessons: [
          {
            id: "basic-1",
            title: "Từ vựng giao tiếp hằng ngày",
            duration: "12:45",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
          {
            id: "basic-2",
            title: "Mẫu câu hỏi – đáp nhanh",
            duration: "14:20",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
    ],
  },
  {
    id: "photoshop-design",
    title: "Thiết kế đồ họa Photoshop",
    shortDescription: "Từ cơ bản đến nâng cao, tạo ấn phẩm chuyên nghiệp.",
    description:
      "Khoá học Photoshop giúp bạn nắm vững các công cụ chỉnh sửa ảnh, thiết kế banner, poster và ấn phẩm truyền thông.",
    category: "Thiết kế",
    level: "Trung cấp",
    price: "750.000đ",
    duration: "30 giờ",
    lessons: 40,
    students: 950,
    rating: 4.7,
    popular: true,
    thumbnail: img2,
    video: {
      source: "youtube",
      id: "PrUxWZiQfy4",
    },
    sections: [
      {
        id: "ps-intro",
        title: "Bắt đầu với Photoshop",
        lessons: [
          {
            id: "ps-intro-1",
            title: "Làm quen giao diện & workspace",
            duration: "09:12",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
            isPreview: true,
          },
          {
            id: "ps-intro-2",
            title: "Các phím tắt quan trọng",
            duration: "07:28",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
      {
        id: "ps-tools",
        title: "Công cụ chỉnh sửa cơ bản",
        lessons: [
          {
            id: "ps-tools-1",
            title: "Làm việc với Layer & Mask",
            duration: "15:40",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
          {
            id: "ps-tools-2",
            title: "Chỉnh màu & Retouch đơn giản",
            duration: "18:05",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
    ],
  },
  {
    id: "web-development",
    title: "Lập trình Web",
    shortDescription: "HTML, CSS, JS thực chiến, làm dự án ngay.",
    description:
      "Khoá học lập trình Web cung cấp kiến thức từ HTML, CSS, JavaScript đến xây dựng một trang web hoàn chỉnh.",
    category: "Lập trình",
    level: "Cơ bản → Nâng cao",
    price: "1.200.000đ",
    duration: "45 giờ",
    lessons: 60,
    students: 2100,
    rating: 4.9,
    popular: true,
    thumbnail: img3,
    video: {
      source: "vimeo",
      id: "693155895",
    },
    sections: [
      {
        id: "web-basic",
        title: "HTML & CSS cơ bản",
        lessons: [
          {
            id: "web-basic-1",
            title: "Giới thiệu HTML, cấu trúc trang",
            duration: "10:20",
            source: "vimeo",
            videoId: "693155895",
            isPreview: true,
          },
          {
            id: "web-basic-2",
            title: "CSS cơ bản & layout",
            duration: "16:45",
            source: "vimeo",
            videoId: "693155895",
          },
        ],
      },
      {
        id: "web-js",
        title: "JavaScript & tương tác",
        lessons: [
          {
            id: "web-js-1",
            title: "Biến, hàm, điều kiện trong JS",
            duration: "14:30",
            source: "vimeo",
            videoId: "693155895",
          },
          {
            id: "web-js-2",
            title: "DOM & xử lý sự kiện",
            duration: "17:55",
            source: "vimeo",
            videoId: "693155895",
          },
        ],
      },
    ],
  },
  {
    id: "business-thinking",
    title: "Kinh doanh & Tư duy",
    shortDescription: "Nâng cao kỹ năng mềm, tư duy chiến lược.",
    description:
      "Khoá học giúp bạn xây dựng tư duy kinh doanh, kỹ năng phân tích, ra quyết định và quản lý đội nhóm.",
    category: "Kinh doanh",
    level: "Trung cấp",
    price: "890.000đ",
    duration: "28 giờ",
    lessons: 36,
    students: 780,
    rating: 4.6,
    thumbnail: img4,
    video: {
      source: "youtube",
      id: "PrUxWZiQfy4",
    },
    sections: [
      {
        id: "biz-mindset",
        title: "Tư duy & nền tảng kinh doanh",
        lessons: [
          {
            id: "biz-mindset-1",
            title: "Tư duy sản phẩm & giá trị",
            duration: "11:05",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
            isPreview: true,
          },
          {
            id: "biz-mindset-2",
            title: "Hiểu khách hàng & insight",
            duration: "13:18",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
      {
        id: "biz-execution",
        title: "Chiến lược & thực thi",
        lessons: [
          {
            id: "biz-execution-1",
            title: "Lập kế hoạch kinh doanh",
            duration: "19:40",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
          {
            id: "biz-execution-2",
            title: "Quản lý đội nhóm hiệu quả",
            duration: "21:10",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Tổng hợp",
    shortDescription: "Facebook, Google Ads, Content, đo lường hiệu quả.",
    description:
      "Khoá học Digital Marketing giúp bạn hiểu toàn bộ funnel marketing online, từ xây dựng nội dung đến chạy quảng cáo và tối ưu chuyển đổi.",
    category: "Marketing",
    level: "Cơ bản → Trung cấp",
    price: "990.000đ",
    duration: "32 giờ",
    lessons: 38,
    students: 1500,
    rating: 4.7,
    thumbnail: img5,
    video: {
      source: "youtube",
      id: "PrUxWZiQfy4",
    },
    sections: [
      {
        id: "mkt-foundation",
        title: "Nền tảng Marketing",
        lessons: [
          {
            id: "mkt-foundation-1",
            title: "Marketing funnel & chân dung khách hàng",
            duration: "12:50",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
            isPreview: true,
          },
          {
            id: "mkt-foundation-2",
            title: "Chiến lược nội dung đa kênh",
            duration: "16:22",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
      {
        id: "mkt-ads",
        title: "Quảng cáo Facebook & Google",
        lessons: [
          {
            id: "mkt-ads-1",
            title: "Thiết lập chiến dịch Facebook Ads",
            duration: "20:15",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
          {
            id: "mkt-ads-2",
            title: "Google Ads & đo lường chuyển đổi",
            duration: "18:40",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
    ],
  },
  {
    id: "data-analytics",
    title: "Phân tích dữ liệu với Excel & Power BI",
    shortDescription: "Nắm vững cách khai thác dữ liệu và xây dashboard.",
    description:
      "Khoá học giúp bạn xử lý dữ liệu với Excel, trực quan hoá và xây dựng dashboard phân tích bằng Power BI.",
    category: "Data",
    level: "Trung cấp",
    price: "1.300.000đ",
    duration: "40 giờ",
    lessons: 42,
    students: 860,
    rating: 4.8,
    thumbnail: img6,
    video: {
      source: "youtube",
      id: "PrUxWZiQfy4",
    },
    sections: [
      {
        id: "data-excel",
        title: "Xử lý dữ liệu với Excel",
        lessons: [
          {
            id: "data-excel-1",
            title: "Làm sạch & chuẩn hoá dữ liệu",
            duration: "14:05",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
            isPreview: true,
          },
          {
            id: "data-excel-2",
            title: "PivotTable & báo cáo nhanh",
            duration: "17:33",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
      {
        id: "data-powerbi",
        title: "Dashboard với Power BI",
        lessons: [
          {
            id: "data-powerbi-1",
            title: "Kết nối & mô hình hoá dữ liệu",
            duration: "19:25",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
          {
            id: "data-powerbi-2",
            title: "Thiết kế dashboard trực quan",
            duration: "22:10",
            source: "youtube",
            videoId: "PrUxWZiQfy4",
          },
        ],
      },
    ],
  },
];

