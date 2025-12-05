export type OrderStatus = "hoan-thanh" | "dang-cho" | "da-huy" | "dang-chay";

export interface ClientOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  orderTime: string;
  link: string;
  comment: string;
  status: OrderStatus;
  paymentStatus: "da-thanh-toan" | "chua-thanh-toan";
  amount: number; // thanh toán
  quantity: number; // số lượng cần tăng
  startCount: number; // ban đầu
  remain: number; // còn lại
  updatedAt: string;
}

export interface OrderSummary {
  completed: number;
  pending: number;
  canceled: number;
  running: number;
  totalAmount: number;
}

export const clientOrders: ClientOrder[] = [
  {
    id: "1749480719268",
    serviceId: "ID: 8547",
    serviceName: "S2 Like clone nhanh(CARE)",
    orderTime: "2025-06-09 21:52:03",
    link: "https://www.facebook.com/rqtanetwork/posts/pfbid0gtwqz5FNw7s7blWDWcmuJBueEmtjhQnn9Xs2NH4ZJtwMidL8WEY7rXypo6Y3PRrdCl",
    comment: "Không có",
    status: "hoan-thanh",
    paymentStatus: "da-thanh-toan",
    amount: 696000,
    quantity: 50,
    startCount: 0,
    remain: 0,
    updatedAt: "2025-06-15 17:16:53",
  },
  {
    id: "1749480699602",
    serviceId: "ID: 8754",
    serviceName: "S3 Like clone xịn like",
    orderTime: "2025-06-09 21:51:45",
    link: "https://www.facebook.com/some-post-1",
    comment: "Không có",
    status: "hoan-thanh",
    paymentStatus: "da-thanh-toan",
    amount: 3479000,
    quantity: 50,
    startCount: 0,
    remain: 0,
    updatedAt: "2025-06-15 17:16:53",
  },
  {
    id: "1749479113382",
    serviceId: "ID: 8547",
    serviceName: "S2 Like clone nhanh(ANGRY)",
    orderTime: "2025-06-09 21:25:17",
    link: "https://www.facebook.com/some-post-2",
    comment: "Không có",
    status: "hoan-thanh",
    paymentStatus: "da-thanh-toan",
    amount: 696000,
    quantity: 50,
    startCount: 0,
    remain: 0,
    updatedAt: "2025-06-15 17:16:53",
  },
  {
    id: "1749479089406",
    serviceId: "ID: 8746",
    serviceName: "S3 Like clone xịn like",
    orderTime: "2025-06-09 21:24:53",
    link: "https://www.facebook.com/some-post-3",
    comment: "Không có",
    status: "hoan-thanh",
    paymentStatus: "da-thanh-toan",
    amount: 3479000,
    quantity: 50,
    startCount: 0,
    remain: 0,
    updatedAt: "2025-06-15 17:16:53",
  },
  {
    id: "1749404484154",
    serviceId: "ID: 8757",
    serviceName: "S1 Like bám tay wow",
    orderTime: "2025-06-09 00:41:28",
    link: "https://www.facebook.com/some-post-4",
    comment: "Không có",
    status: "hoan-thanh",
    paymentStatus: "da-thanh-toan",
    amount: 1948000,
    quantity: 50,
    startCount: 0,
    remain: 0,
    updatedAt: "2025-06-09 19:53:07",
  },
  {
    id: "1749396959182",
    serviceId: "ID: 8338",
    serviceName: "Follow clone sale",
    orderTime: "2025-06-08 22:36:39",
    link: "https://www.facebook.com/some-post-5",
    comment: "Không có",
    status: "dang-cho",
    paymentStatus: "da-thanh-toan",
    amount: 1559000,
    quantity: 100,
    startCount: 0,
    remain: 50,
    updatedAt: "2025-06-08 22:36:39",
  },
  // thêm nhiều dữ liệu mẫu để test giao diện
  ...Array.from({ length: 20 }).map((_, index) => ({
    id: `ORD-2025-${1000 + index}`,
    serviceId: `ID: ${8000 + index}`,
    serviceName: index % 3 === 0 ? "S1 Like bám tay wow" : index % 3 === 1 ? "S2 Like clone nhanh(CARE)" : "S3 Like clone xịn like",
    orderTime: "2025-06-0" + ((index % 9) + 1) + " 12:3" + (index % 10) + ":0" + (index % 6),
    link: "https://www.facebook.com/demo-link-" + index,
    comment: index % 4 === 0 ? "Ghi chú: chạy từ từ, ưu tiên bài mới" : "Không có",
    status: (["hoan-thanh", "dang-cho", "da-huy", "dang-chay"] as OrderStatus[])[index % 4],
    paymentStatus: (index % 5 === 0 ? "chua-thanh-toan" : "da-thanh-toan") as "da-thanh-toan" | "chua-thanh-toan",
    amount: 500000 + index * 12345,
    quantity: 50 + (index % 5) * 50,
    startCount: 0,
    remain: index % 3 === 0 ? 0 : 10 + (index % 5) * 5,
    updatedAt: "2025-06-1" + (index % 9) + " 10:2" + (index % 10) + ":3" + (index % 6),
  })),
];

export const getOrderSummary = (orders: ClientOrder[]): OrderSummary => {
  return orders.reduce<OrderSummary>(
    (acc, order) => {
      if (order.status === "hoan-thanh") acc.completed += 1;
      if (order.status === "dang-cho") acc.pending += 1;
      if (order.status === "da-huy") acc.canceled += 1;
      if (order.status === "dang-chay") acc.running += 1;
      acc.totalAmount += order.amount;
      return acc;
    },
    { completed: 0, pending: 0, canceled: 0, running: 0, totalAmount: 0 }
  );
};


