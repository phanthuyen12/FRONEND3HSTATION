import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { adminOrderService } from "../../../config";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface OrderStats {
  total: number;
  totalRevenue: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  revenueByType: Record<string, number>;
  dailyStats: Array<{ date: string; count: number; revenue: number }>;
  monthlyStats: Array<{ month: string; count: number; revenue: number }>;
}

interface Order {
  id: string;
  user_id: string;
  type: string;
  item_id: string;
  amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const OrdersReport: React.FC = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API để lấy stats và orders
      // Tạm thời mock data
      const mockStats: OrderStats = {
        total: 1248,
        totalRevenue: 98500000,
        byStatus: {
          'pending': 45,
          'paid': 320,
          'processing': 180,
          'completed': 650,
          'cancelled': 53
        },
        byType: {
          'course': 680,
          'workflow': 320,
          'vps': 180,
          'topup': 68
        },
        revenueByType: {
          'course': 62000000,
          'workflow': 21000000,
          'vps': 9000000,
          'topup': 6500000
        },
        dailyStats: [
          { date: '2024-01-01', count: 12, revenue: 1200000 },
          { date: '2024-01-02', count: 18, revenue: 1800000 },
          { date: '2024-01-03', count: 15, revenue: 1500000 },
          { date: '2024-01-04', count: 22, revenue: 2200000 },
          { date: '2024-01-05', count: 25, revenue: 2500000 },
          { date: '2024-01-06', count: 20, revenue: 2000000 },
          { date: '2024-01-07', count: 28, revenue: 2800000 },
        ],
        monthlyStats: [
          { month: 'Th1', count: 180, revenue: 18000000 },
          { month: 'Th2', count: 220, revenue: 22000000 },
          { month: 'Th3', count: 250, revenue: 25000000 },
          { month: 'Th4', count: 280, revenue: 28000000 },
          { month: 'Th5', count: 310, revenue: 31000000 },
        ]
      };
      setStats(mockStats);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tải dữ liệu báo cáo',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-amber-500',
      'paid': 'bg-blue-500',
      'processing': 'bg-purple-500',
      'completed': 'bg-emerald-500',
      'cancelled': 'bg-rose-500'
    };
    return colors[status] || 'bg-slate-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'course': 'bg-amber-500',
      'workflow': 'bg-purple-500',
      'vps': 'bg-blue-500',
      'topup': 'bg-emerald-500'
    };
    return colors[type] || 'bg-slate-500';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'course': 'Khóa học',
      'workflow': 'Workflow',
      'vps': 'VPS',
      'topup': 'Nạp tiền'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Đang chờ',
      'paid': 'Đã thanh toán',
      'processing': 'Đang xử lý',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  // Chart options
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    colors: ['#f97316', '#0ea5e9'],
    series: stats ? [
      {
        name: 'Doanh thu',
        data: stats.monthlyStats.map(s => s.revenue / 1000000)
      },
      {
        name: 'Số đơn',
        data: stats.monthlyStats.map(s => s.count)
      }
    ] : [],
    xaxis: {
      categories: stats?.monthlyStats.map(s => s.month) || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: [
      {
        title: { text: 'Doanh thu (triệu VNĐ)', style: { color: '#f97316' } },
        labels: { style: { colors: '#f97316' } }
      },
      {
        opposite: true,
        title: { text: 'Số đơn', style: { color: '#0ea5e9' } },
        labels: { style: { colors: '#0ea5e9' } }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  const statusChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: stats ? Object.keys(stats.byStatus).map(s => getStatusLabel(s)) : [],
    colors: ['#f59e0b', '#3b82f6', '#a855f7', '#10b981', '#ef4444'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Tổng đơn',
              formatter: () => stats?.total.toString() || '0'
            }
          }
        }
      }
    }
  };

  const typeChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 6
      }
    },
    dataLabels: { enabled: false },
    colors: ['#f97316', '#a855f7', '#3b82f6', '#10b981'],
    series: stats ? [
      {
        name: 'Số đơn',
        data: Object.keys(stats.byType).map(key => stats.byType[key])
      }
    ] : [],
    xaxis: {
      categories: stats ? Object.keys(stats.byType).map(key => getTypeLabel(key)) : [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: { style: { colors: '#64748b' } }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Báo cáo đơn hàng"
          title="Báo cáo đơn hàng"
          breadCrumbItems={["Admin", "Báo cáo", "Đơn hàng"]}
        />
        <div className="card">
          <div className="p-10 text-center text-slate-500">
            Đang tải dữ liệu...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        name="Báo cáo đơn hàng"
        title="Báo cáo đơn hàng"
        breadCrumbItems={["Admin", "Báo cáo", "Đơn hàng"]}
      />

      {/* Header với filter */}
      <div className="card mb-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Báo cáo đơn hàng
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Tổng quan về đơn hàng và doanh thu hệ thống
            </p>
          </div>
          <div className="flex gap-3">
            <select
              className="form-select w-40"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 grid-cols-2 gap-5 mb-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-2 border-blue-200 dark:border-blue-800/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i className="mgc_shopping_cart_line text-2xl text-white"></i>
              </div>
            </div>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
              Tổng đơn hàng
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {stats?.total.toLocaleString('vi-VN') || 0}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tất cả các đơn hàng
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-2 border-emerald-200 dark:border-emerald-800/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <i className="mgc_wallet_line text-2xl text-white"></i>
              </div>
            </div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Tổng doanh thu
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
              {(stats?.totalRevenue || 0).toLocaleString('vi-VN')}₫
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tổng doanh thu hệ thống
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-2 border-purple-200 dark:border-purple-800/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <i className="mgc_check_circle_line text-2xl text-white"></i>
              </div>
            </div>
            <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">
              Đơn hoàn thành
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {stats?.byStatus.completed || 0}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {stats ? ((stats.byStatus.completed / stats.total) * 100).toFixed(1) : 0}% tổng đơn
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-2 border-amber-200 dark:border-amber-800/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <i className="mgc_time_line text-2xl text-white"></i>
              </div>
            </div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Đơn đang chờ
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {stats?.byStatus.pending || 0}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cần xử lý
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Xu hướng doanh thu</h4>
          </div>
          <div className="card-body">
            {stats && (
              <ReactApexChart
                options={revenueChartOptions}
                series={revenueChartOptions.series as any}
                type="area"
                height={350}
              />
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Phân bổ theo trạng thái</h4>
          </div>
          <div className="card-body">
            {stats && (
              <ReactApexChart
                options={statusChartOptions}
                series={Object.values(stats.byStatus)}
                type="donut"
                height={300}
              />
            )}
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Phân bổ theo loại dịch vụ</h4>
          </div>
          <div className="card-body">
            {stats && (
              <ReactApexChart
                options={typeChartOptions}
                series={typeChartOptions.series as any}
                type="bar"
                height={300}
              />
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Doanh thu theo loại dịch vụ</h4>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {stats && Object.entries(stats.revenueByType).map(([type, revenue]) => {
                const percentage = (revenue / stats.totalRevenue) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`}></div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {getTypeLabel(type)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {revenue.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getTypeColor(type)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{stats.byType[type]} đơn hàng</span>
                      <span>{percentage.toFixed(1)}% tổng doanh thu</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">Chi tiết theo trạng thái</h4>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-5 gap-4">
            {stats && Object.entries(stats.byStatus).map(([status, count]) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div
                  key={status}
                  className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg ${getStatusColor(status)} flex items-center justify-center mb-3`}>
                    <i className="mgc_circle_line text-white text-xl"></i>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    {getStatusLabel(status)}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {count}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {percentage.toFixed(1)}% tổng đơn
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersReport;




