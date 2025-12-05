import img1 from "../../assets/images/small/small-7.jpg";
import img2 from "../../assets/images/small/small-8.jpg";
import img3 from "../../assets/images/small/small-9.jpg";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  tags: string[];
  steps: string[];
}

export const workflows: Workflow[] = [
  {
    id: "onboarding-course",
    name: "Onboarding học viên mới",
    description:
      "Tự động gửi email chào mừng, tài liệu hướng dẫn và gợi ý khóa học phù hợp cho học viên mới.",
    category: "Automation",
    price: "290.000đ",
    image: img1,
    tags: ["Email", "Automation", "CRM"],
    steps: [
      "Trigger: Học viên đăng ký tài khoản hoặc mua khóa học đầu tiên",
      "Gửi email chào mừng + hướng dẫn đăng nhập",
      "Gửi tài liệu PDF kèm roadmap gợi ý",
      "Sau 3 ngày: gửi khảo sát mức độ hài lòng ban đầu",
    ],
  },
  {
    id: "up-sell-course",
    name: "Workflow upsell khóa học nâng cao",
    description:
      "Đề xuất các khoá nâng cao sau khi học viên hoàn thành một khoá cơ bản.",
    category: "Marketing",
    price: "390.000đ",
    image: img2,
    tags: ["Upsell", "Email", "Segment"],
    steps: [
      "Trigger: Học viên hoàn thành 80% khoá cơ bản",
      "Gửi email gợi ý khoá nâng cao liên quan",
      "Tặng coupon giảm giá 15% nếu đăng ký trong 3 ngày",
      "Nhắc lại lần 2 nếu chưa đăng ký sau 5 ngày",
    ],
  },
  {
    id: "payment-reminder",
    name: "Nhắc thanh toán & gia hạn",
    description:
      "Nhắc học viên thanh toán gia hạn gói học định kỳ, tránh hết hạn đột ngột.",
    category: "Thanh toán",
    price: "250.000đ",
    image: img3,
    tags: ["Billing", "Notification"],
    steps: [
      "Trigger: Gói học còn 7 ngày sẽ hết hạn",
      "Gửi email + notification nhắc gia hạn",
      "Hiển thị banner nhắc nạp tiền trên dashboard",
      "Sau 3 ngày: gửi nhắc lần 2 với ưu đãi nhỏ",
    ],
  },
];















