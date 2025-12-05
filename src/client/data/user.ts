export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  balance: number;
  joinedAt: string;
  bio?: string;
  status?: "active" | "locked";
  role?: "user" | "admin";
}

export const mockUser: UserProfile = {
  id: "u-001",
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901 234 567",
  balance: 350000,
  joinedAt: "01/09/2024",
  bio: "Yêu thích lập trình web, thiết kế sản phẩm số và chia sẻ kiến thức.",
  status: "active",
  role: "user",
};

export const mockUsers: UserProfile[] = [
  mockUser,
  {
    id: "u-002",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0902 888 999",
    balance: 1200000,
    joinedAt: "15/10/2024",
    status: "active",
    role: "user",
  },
  {
    id: "u-003",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0903 111 222",
    balance: 0,
    joinedAt: "03/11/2024",
    status: "locked",
    role: "user",
  },
];


