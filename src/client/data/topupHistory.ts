export type TopupStatus = "chua-thanh-toan" | "het-han" | "da-thanh-cong";

export interface TopupRecord {
  code: string;
  status: TopupStatus;
  bank: string;
  amount: number;
  received: number;
  createdAt: string;
  updatedAt: string;
  statusLabel?: string;
  statusColor?: string;
}

export interface TopupSummary {
  paid: number;
  unpaid: number;
}

export const topupHistory: (TopupRecord & {
  statusLabel: string;
  statusColor: string;
})[] = [
  {
    code: "987543216",
    status: "da-thanh-cong",
    statusLabel: "Chưa thanh toán",
    statusColor: "bg-amber-100 text-amber-700",
    bank: "Vietcombank",
    amount: 60000,
    received: 60000,
    createdAt: "02/12/2025 20:15:46",
    updatedAt: "02/12/2025 20:15:46",
  },
  {
    code: "563827491",
    status: "da-thanh-cong",
    statusLabel: "Chưa thanh toán",
    statusColor: "bg-amber-100 text-amber-700",
    bank: "Vietcombank",
    amount: 1000,
    received: 1000,
    createdAt: "02/12/2025 12:27:48",
    updatedAt: "02/12/2025 12:27:48",
  },
  {
    code: "631759284",
    status: "da-thanh-cong",
    statusLabel: "Chưa thanh toán",
    statusColor: "bg-amber-100 text-amber-700",
    bank: "Vietcombank",
    amount: 10000,
    received: 10000,
    createdAt: "29/11/2025 00:55:37",
    updatedAt: "29/11/2025 00:55:37",
  },
  {
    code: "367281549",
    status: "da-thanh-cong",
    statusLabel: "Chưa thanh toán",
    statusColor: "bg-amber-100 text-amber-700",
    bank: "Vietcombank",
    amount: 10000,
    received: 10000,
    createdAt: "26/11/2025 03:04:22",
    updatedAt: "26/11/2025 03:04:22",
  },
  {
    code: "624571839",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 10000,
    received: 10000,
    createdAt: "21/11/2025 19:05:42",
    updatedAt: "25/11/2025 18:41:32",
  },
  {
    code: "692845713",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 10000000,
    received: 10000000,
    createdAt: "21/11/2025 09:57:29",
    updatedAt: "25/11/2025 18:41:32",
  },
  {
    code: "924831756",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 30000,
    received: 30000,
    createdAt: "19/11/2025 12:22:10",
    updatedAt: "25/11/2025 18:41:32",
  },
  {
    code: "691382754",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 20000,
    received: 20000,
    createdAt: "16/11/2025 15:13:21",
    updatedAt: "25/11/2025 18:41:32",
  },
  {
    code: "418693572",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 100000,
    received: 100000,
    createdAt: "16/11/2025 11:49:30",
    updatedAt: "25/11/2025 18:41:32",
  },
  {
    code: "597364281",
    status: "het-han",
    statusLabel: "Hết hạn",
    statusColor: "bg-rose-100 text-rose-700",
    bank: "Vietcombank",
    amount: 100000,
    received: 100000,
    createdAt: "16/11/2025 11:38:27",
    updatedAt: "25/11/2025 18:41:32",
  },
  // thêm nhiều record mẫu cho đủ dữ liệu test
  ...Array.from({ length: 20 }).map((_, index) => {
    const status: TopupStatus =
      index % 3 === 0 ? "da-thanh-cong" : index % 3 === 1 ? "chua-thanh-toan" : "het-han";

    const statusLabel =
      status === "da-thanh-cong"
        ? "Đã thanh toán"
        : status === "chua-thanh-toan"
        ? "Chưa thanh toán"
        : "Hết hạn";

    const statusColor =
      status === "da-thanh-cong"
        ? "bg-emerald-100 text-emerald-700"
        : status === "chua-thanh-toan"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

    return {
      code: `9${800000000 + index}`,
      status,
      statusLabel,
      statusColor,
      bank: "Vietcombank",
      amount: 10000 + index * 1000,
      received: 10000 + index * 1000,
      createdAt: "15/11/2025 10:00:0" + (index % 10),
      updatedAt: "16/11/2025 10:30:0" + (index % 10),
    };
  }),
];

export const getTopupSummary = (items: TopupRecord[]): TopupSummary => {
  return items.reduce<TopupSummary>(
    (acc, item) => {
      if (item.status === "da-thanh-cong") {
        acc.paid += item.amount;
      } else {
        acc.unpaid += item.amount;
      }
      return acc;
    },
    { paid: 0, unpaid: 0 }
  );
};


