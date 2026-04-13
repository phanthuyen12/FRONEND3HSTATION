import React, { useState, useEffect, useCallback } from "react";
import { PageBreadcrumb, CustomFlatpickr } from "../../components";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { APICore } from "../../helpers/api/apiCore";
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Server, 
  BookOpen, 
  Workflow, 
  TrendingUp,
  Calendar,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Cpu
} from "lucide-react";

const api = new APICore();

interface DashboardStats {
  totals: {
    users: number;
    vps: number;
    vpsOrders: number;
    coursesSold: number;
    activeStudents: number;
    workflowOrders: number;
    toolOrders: number;
    topupAmount: number;
  };
  inRange: {
    users: number;
    vps: number;
    vpsOrders: number;
    coursesSold: number;
    activeStudents: number;
    workflowOrders: number;
    toolOrders: number;
    topupAmount: number;
  };
  recentOrders: {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  };
  revenueByType: any[];
  charts: {
    dailyRevenue: any[];
    dailyTopups: any[];
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllTime, setIsAllTime] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        ordersPage: ordersPage,
        ordersLimit: 5
      };
      
      if (!isAllTime && dateRange.length === 2) {
        params.startDate = dateRange[0].toISOString().split('T')[0];
        params.endDate = dateRange[1].toISOString().split('T')[0];
      }
      
      const response = await api.get("/api/admin/dashboard/stats", params);
      if (response && response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, isAllTime, ordersPage]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (stats?.recentOrders.pagination.totalPages || 1)) {
      setOrdersPage(newPage);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const revenueTrendOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#3b82f6", "#10b981"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      type: "datetime",
      categories: stats?.charts?.dailyRevenue?.map((d: any) => d.date) || [],
      labels: {
        style: { colors: "#64748b" }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `${(val / 1000000).toFixed(1)}M`,
        style: { colors: "#64748b" }
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    }
  };

  const chartSeries = [
    {
      name: "Doanh thu đơn hàng",
      data: stats?.charts?.dailyRevenue?.map((d: any) => d.total) || [],
    },
    {
      name: "Nạp tiền hệ thống",
      data: stats?.charts?.dailyTopups?.map((d: any) => d.total) || [],
    },
  ];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getSuccessOrdersValue = (data: any) => {
    if (!data) return 0;
    return (data.coursesSold || 0) + 
           (data.workflowOrders || 0) + 
           (data.vpsOrders || 0) + 
           (data.toolOrders || 0);
  };

  return (
    <>
      <PageBreadcrumb
        title="Báo Cáo Hệ Thống"
        name="Dashboard"
        breadCrumbItems={["3HStation", "Quản Trị", "Dashboard"]}
      />

      {/* Date Range & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan hoạt động</h1>
          <p className="text-slate-500 text-sm">
            {isAllTime ? "Thống kê toàn thời gian" : `Thống kê từ ${dateRange[0]?.toLocaleDateString('vi-VN')} đến ${dateRange[1]?.toLocaleDateString('vi-VN')}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAllTime(!isAllTime);
              setOrdersPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isAllTime 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Toàn thời gian
          </button>
          
          {!isAllTime && (
            <div className="relative flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400 ml-2" />
              <CustomFlatpickr
                value={dateRange}
                options={{
                  mode: "range",
                  dateFormat: "Y-m-d",
                }}
                className="border-none focus:ring-0 text-sm px-2 py-1 w-52 bg-transparent text-slate-700"
                onChange={(date: Date[]) => {
                  setDateRange(date);
                  setOrdersPage(1);
                }}
              />
            </div>
          )}
          
          <button 
            onClick={fetchStats}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Nạp tiền hệ thống" 
          value={formatCurrency(isAllTime ? stats?.totals.topupAmount || 0 : stats?.inRange.topupAmount || 0)}
          totalValue={formatCurrency(stats?.totals.topupAmount || 0)}
          icon={<CreditCard className="w-6 h-6" />}
          color="amber"
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard 
          title="Người dùng" 
          value={isAllTime ? stats?.totals.users || 0 : stats?.inRange.users || 0}
          totalValue={stats?.totals.users || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard 
          title="VPS kích hoạt" 
          value={isAllTime ? stats?.totals.vpsOrders || 0 : stats?.inRange.vpsOrders || 0}
          totalValue={stats?.totals.vpsOrders || 0}
          icon={<Server className="w-6 h-6" />}
          color="indigo"
          trend={`${stats?.totals.vps || 0} Instances`}
          trendUp={true}
        />
        <StatCard 
          title="Đơn hàng thành công" 
          value={isAllTime ? getSuccessOrdersValue(stats?.totals) : getSuccessOrdersValue(stats?.inRange)}
          totalValue={getSuccessOrdersValue(stats?.totals)}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="emerald"
          trend="Real-time"
          trendUp={true}
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              Đào Tạo
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <DetailItem label="Khoá học" value={isAllTime ? stats?.totals.coursesSold || 0 : stats?.inRange.coursesSold || 0} total={stats?.totals.coursesSold || 0} unit="đơn" />
            <DetailItem label="Học viên" value={isAllTime ? stats?.totals.activeStudents || 0 : stats?.inRange.activeStudents || 0} total={stats?.totals.activeStudents || 0} unit="user" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              Máy Chủ VPS
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <DetailItem label="Đơn hàng" value={isAllTime ? stats?.totals.vpsOrders || 0 : stats?.inRange.vpsOrders || 0} total={stats?.totals.vpsOrders || 0} unit="đơn" />
            <DetailItem label="Instance" value={stats?.totals.vps || 0} total={stats?.totals.vps || 0} unit="vps" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-500" />
              Workflow AI
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <DetailItem label="Đơn hàng" value={isAllTime ? stats?.totals.workflowOrders || 0 : stats?.inRange.workflowOrders || 0} total={stats?.totals.workflowOrders || 0} unit="đơn" />
             <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 mt-2">
               <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Xu hướng</p>
               <p className="text-xs text-slate-700 font-medium">Tự động hoá Marketing tăng 20%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Phần Mềm
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <DetailItem label="Đơn hàng" value={isAllTime ? stats?.totals.toolOrders || 0 : stats?.inRange.toolOrders || 0} total={stats?.totals.toolOrders || 0} unit="đơn" />
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 mt-2">
               <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Trạng thái</p>
               <p className="text-xs text-slate-700 font-medium">Hoạt động ổn định (99.9%)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Biến động doanh thu & nạp tiền</h3>
          <div dir="ltr">
            <ReactApexChart options={revenueTrendOptions} series={chartSeries} type="area" height={350} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Thông báo & Sự kiện</h3>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
             {stats?.recentOrders?.data?.slice(0, 5).map((order, i) => (
                <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors">
                   <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                   <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 leading-tight">{order.user_name} mua {order.type}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{new Date(order.created_at).toLocaleTimeString('vi-VN')} · {formatCurrency(order.amount)}</p>
                   </div>
                </div>
             ))}
             {!stats?.recentOrders?.data?.length && <p className="text-xs text-slate-400 text-center py-4 italic">Chưa có hoạt động mới</p>}
          </div>
        </div>
      </div>

      {/* Paginated Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Đơn hàng mới nhất</h3>
          <div className="flex items-center gap-2">
             <button 
                disabled={ordersPage === 1}
                onClick={() => handlePageChange(ordersPage - 1)}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
             >
                <ChevronLeft className="w-4 h-4" />
             </button>
             <span className="text-xs font-bold text-slate-600 px-2">
                Trang {stats?.recentOrders?.pagination?.page || 1} / {stats?.recentOrders?.pagination?.totalPages || 1}
             </span>
             <button 
                disabled={ordersPage === stats?.recentOrders?.pagination?.totalPages}
                onClick={() => handlePageChange(ordersPage + 1)}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
             >
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentOrders?.data?.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {order.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{order.user_name}</p>
                        <p className="text-xs text-slate-400">{order.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.type === 'course' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                      order.type === 'workflow' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      order.type.includes('vps') ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(order.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      ['completed', 'paid', 'tao-thanh-cong', 'da-thanh-cong', 'da-duyet'].includes(order.status) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${['completed', 'paid', 'tao-thanh-cong', 'da-thanh-cong', 'da-duyet'].includes(order.status) ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {['completed', 'paid', 'tao-thanh-cong', 'da-thanh-cong', 'da-duyet'].includes(order.status) ? 'Thành công' : 'Đang xử lý'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
              {(!stats?.recentOrders?.data || stats.recentOrders.data.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">Chưa có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, totalValue, icon, color, trend, trendUp }: any) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-end gap-2 mb-2">
        <h4 className="text-2xl font-bold text-slate-800 leading-none">{value || 0}</h4>
        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <ArrowUpRight className="w-2.5 h-2.5" />
          {trend}
        </div>
      </div>
      <p className="text-xs text-slate-400">Tổng cộng: <span className="font-semibold text-slate-600">{totalValue || 0}</span></p>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${colorMap[color].split(' ')[0]}`}></div>
    </div>
  );
};

const DetailItem = ({ label, value, total, unit }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <div className="text-right">
      <p className="text-sm font-extrabold text-slate-700">{value} <span className="text-[10px] font-normal text-slate-400">{unit}</span></p>
      <p className="text-[10px] text-slate-300 font-medium">Tổng: {total}</p>
    </div>
  </div>
);

export default Dashboard;