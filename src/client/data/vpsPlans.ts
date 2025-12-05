export interface VpsPlan {
  id: string;
  name: string;
  price: string;
  unit: string;
  discountLabel?: string;
  cpu: string;
  ram: string;
  ssd: string;
  bandwidth: string;
  popular?: boolean;
}

export const vpsPlans: VpsPlan[] = [
  {
    id: "kvm-1",
    name: "KVM 1",
    price: "120.900",
    unit: "VNĐ/tháng",
    discountLabel: "GIẢM GIÁ 60%",
    cpu: "1 nhân vCPU",
    ram: "4 GB RAM",
    ssd: "50 GB NVMe SSD",
    bandwidth: "4 TB băng thông",
  },
  {
    id: "kvm-2",
    name: "KVM 2",
    price: "150.900",
    unit: "VNĐ/tháng",
    discountLabel: "GIẢM GIÁ 69%",
    cpu: "2 nhân vCPU",
    ram: "8 GB RAM",
    ssd: "100 GB NVMe SSD",
    bandwidth: "8 TB băng thông",
    popular: true,
  },
  {
    id: "kvm-4",
    name: "KVM 4",
    price: "226.900",
    unit: "VNĐ/tháng",
    discountLabel: "GIẢM GIÁ 71%",
    cpu: "4 nhân vCPU",
    ram: "16 GB RAM",
    ssd: "200 GB NVMe SSD",
    bandwidth: "16 TB băng thông",
  },
  {
    id: "kvm-8",
    name: "KVM 8",
    price: "453.900",
    unit: "VNĐ/tháng",
    discountLabel: "GIẢM GIÁ 70%",
    cpu: "8 nhân vCPU",
    ram: "32 GB RAM",
    ssd: "400 GB NVMe SSD",
    bandwidth: "32 TB băng thông",
  },
  {
    id: "kvm-16",
    name: "KVM 16",
    price: "799.000",
    unit: "VNĐ/tháng",
    discountLabel: "GIẢM GIÁ 72%",
    cpu: "16 nhân vCPU",
    ram: "64 GB RAM",
    ssd: "800 GB NVMe SSD",
    bandwidth: "Không giới hạn",
  },
];















