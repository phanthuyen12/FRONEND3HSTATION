// components
import { PageBreadcrumb } from "../../components";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Tạm mock số liệu tổng quan cho admin (có thể nối với API sau)
const useAdminDashboardStats = () => {
  // User
  const totalUsers = 320;
  const usersToday = 8;
  const usersWeek = 42;
  const usersMonth = 180;

  // Orders & doanh thu (demo)
  const totalOrders = 1280;
  const revenueTotal = 98500000;
  const revenueCourses = 62000000;
  const revenueWorkflows = 21000000;
  const revenueVps = 9000000;
  const revenueTopups = 6500000;

  // Dịch vụ
  const totalCourses = 35;
  const totalWorkflows = 18;
  const totalVpsPlans = 6;
  const totalTopups = 456;

  return {
    totalUsers,
    usersToday,
    usersWeek,
    usersMonth,
    totalOrders,
    revenueTotal,
    revenueCourses,
    revenueWorkflows,
    revenueVps,
    revenueTopups,
    totalCourses,
    totalWorkflows,
    totalVpsPlans,
    totalTopups,
  };
};

const Dashboard: React.FC = () => {
  const {
    totalUsers,
    usersToday,
    usersWeek,
    usersMonth,
    totalOrders,
    revenueTotal,
    revenueCourses,
    revenueWorkflows,
    revenueVps,
    revenueTopups,
    totalCourses,
    totalWorkflows,
    totalVpsPlans,
    totalTopups,
  } = useAdminDashboardStats();

  // Biểu đồ tăng trưởng doanh thu theo tháng (demo)
  const revenueTrendOptions: ApexOptions = {
    chart: {
      height: 280,
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    colors: ["#f97316", "#0ea5e9"],
    series: [
      {
        name: "Doanh thu",
        data: [8, 12, 16, 18, 22, 26],
      },
      {
        name: "Nạp tiền",
        data: [3, 4, 5, 6, 7, 8],
      },
    ],
    xaxis: {
      categories: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6"],
    },
    legend: {
      position: "top",
      offsetY: 4,
    },
    grid: {
      borderColor: "#e5e7eb",
      padding: { bottom: 4 },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val} tr`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} triệu`,
      },
    },
  };

  return (
    <>
      <PageBreadcrumb
        title="Dashboard"
        name="Dashboard"
        breadCrumbItems={["Konrix", "Menu", "Dashboard"]}
      />

      {/* Hero chào mừng giống style client */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 text-white mb-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -left-32 bottom-0 w-72 h-72 rounded-full bg-sky-300" />
        </div>
        <div className="relative px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-[11px] font-medium uppercase tracking-wide mb-3">
              <span className="mr-1">👋</span> Chào mừng bạn quay lại trang quản
              trị
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 leading-tight">
              Tổng quan hoạt động{" "}
              <span className="underline decoration-2 decoration-white/70">
                hệ thống 3HStation
              </span>
            </h1>
            <p className="text-sm md:text-base text-sky-50/90 mb-4">
              Theo dõi nhanh số lượng user, đơn hàng, doanh thu và nạp tiền để
              có quyết định quản trị chính xác hơn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[220px] text-xs">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
              <p className="text-sky-100/80 mb-1">Tổng user</p>
              <p className="text-xl font-semibold">
                {totalUsers.toLocaleString("vi-VN")}
              </p>
              <p className="mt-1 text-[11px] text-sky-50/80">
                Bao gồm user đang hoạt động và đã khoá.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
              <p className="text-sky-100/80 mb-1">Tổng đơn hàng</p>
              <p className="text-xl font-semibold">
                {totalOrders.toLocaleString("vi-VN")}
              </p>
              <p className="mt-1 text-[11px] text-sky-50/80">
                Bao gồm khoá học, workflows và các dịch vụ khác.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur col-span-2">
              <p className="text-sky-100/80 mb-1">Doanh thu (demo)</p>
              <p className="text-lg font-semibold">
                {revenueTotal.toLocaleString("vi-VN")}đ
              </p>
              <p className="mt-1 text-[11px] text-sky-50/80">
                Tổng giá trị đã thanh toán, dữ liệu minh hoạ – có thể nối API
                thật sau.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Báo cáo nhanh theo ngày / tuần / tháng & theo dịch vụ */}
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-6 mb-6">
        {/* User growth */}
        <div className="card">
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="card-title mb-0 text-sm md:text-base">
                Báo cáo tăng trưởng user
              </h4>
              <span className="text-[11px] text-slate-400">
                Demo – có thể nối số liệu thực tế
              </span>
            </div>
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  Hôm nay
                </p>
                <p className="text-lg font-semibold">
                  +{usersToday.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  7 ngày qua
                </p>
                <p className="text-lg font-semibold">
                  +{usersWeek.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  30 ngày qua
                </p>
                <p className="text-lg font-semibold">
                  +{usersMonth.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-slate-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  Tổng user
                </p>
                <p className="text-lg font-semibold">
                  {totalUsers.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by service */}
        <div className="card">
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="card-title mb-0 text-sm md:text-base">
                Báo cáo doanh thu theo dịch vụ (demo)
              </h4>
              <span className="text-[11px] text-slate-400">
                Khoảng thời gian: tháng hiện tại
              </span>
            </div>
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  Khoá học
                </p>
                <p className="text-sm font-semibold">
                  {revenueCourses.toLocaleString("vi-VN")}đ
                </p>
                <p className="mt-1 text-[10px] text-amber-600">
                  {totalCourses} khoá
                </p>
              </div>
              <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  Workflows
                </p>
                <p className="text-sm font-semibold">
                  {revenueWorkflows.toLocaleString("vi-VN")}đ
                </p>
                <p className="mt-1 text-[10px] text-sky-600">
                  {totalWorkflows} workflows
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  VPS
                </p>
                <p className="text-sm font-semibold">
                  {revenueVps.toLocaleString("vi-VN")}đ
                </p>
                <p className="mt-1 text-[10px] text-emerald-600">
                  {totalVpsPlans} gói
                </p>
              </div>
              <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-rose-700">
                <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                  Nạp tiền
                </p>
                <p className="text-sm font-semibold">
                  {revenueTopups.toLocaleString("vi-VN")}đ
                </p>
                <p className="mt-1 text-[10px] text-rose-600">
                  {totalTopups} giao dịch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ tăng trưởng doanh thu & nạp tiền */}
      <div className="card mb-6">
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="card-title mb-0 text-sm md:text-base">
              Biểu đồ tăng trưởng doanh thu & nạp tiền (demo)
            </h4>
            <span className="text-[11px] text-slate-400">
              Đơn vị hiển thị: triệu đồng · 6 tháng gần nhất
            </span>
          </div>
          <div dir="ltr">
            <ReactApexChart
              className="apex-charts"
              options={revenueTrendOptions}
              height={280}
              series={revenueTrendOptions.series || []}
              type="bar"
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default Dashboard;