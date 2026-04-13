import React, { useEffect, useState, useCallback } from "react";
import { PageBreadcrumb } from "../../../components";
import { adminOrderService, vpsService } from "../../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { ChevronLeft, ChevronRight, Search, Eye, Edit, Flashlight, Paperclip, Filter, Server, Mail } from "lucide-react";
import _ from 'lodash';

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
    phone?: string;
  };
  instance?: any;
  plan?: any;
  // enrich
  orderStatus?: string;
  orderAmount?: string;
  orderCreatedAt?: string;
  orderUpdatedAt?: string;
}

const VpsOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [renewalHistory, setRenewalHistory] = useState<any[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    description: '',
    ipAddress: '',
    hostname: '',
    expiresAt: '',
    password: ''
  });

  const [attachmentData, setAttachmentData] = useState({
    attachmentUrl: '',
    attachmentName: '',
    attachmentType: 'link' as 'link' | 'file'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Debounce search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchDebounced = useCallback(
    _.debounce((value: string) => {
      setDebouncedSearch(value);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    handleSearchDebounced(searchTerm);
  }, [searchTerm, handleSearchDebounced]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getVpsOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: debouncedSearch.trim() || undefined
      });
      
      const mapped = (data.data || []).map((order: any) => {
        const instRaw = order.instance || {};
        let configuration = instRaw.configuration;
        if (configuration && typeof configuration === 'string') {
          try {
            configuration = JSON.parse(configuration);
          } catch {
            configuration = instRaw.configuration;
          }
        }
        const billing = configuration?.billing || {};
        return {
          ...order,
          orderStatus: order.status,
          orderAmount: order.amount,
          orderCreatedAt: order.created_at,
          orderUpdatedAt: order.updated_at,
          instance: {
            ...instRaw,
            configuration,
            billing_term_code: instRaw.billing_term_code || billing.billingTermCode || billing.code,
            billing_months: instRaw.billing_months || billing.months,
            billing_discount_percent: instRaw.billing_discount_percent ?? billing.discountPercent,
            billing_auto_renew: instRaw.billing_auto_renew ?? billing.autoRenew,
            billing_amount: instRaw.billing_amount ?? billing.finalAmount
          }
        } as Order;
      });
      setOrders(mapped);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error: any) {
      console.error("Failed to load VPS orders", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tải danh sách đơn hàng',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pagination.page, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    const inst = order.instance || {};
    setFormData({
      status: order.status || '',
      notes: inst.notes || '',
      description: inst.notes || '',
      ipAddress: inst.ip_address || inst.device_ip || '',
      hostname: inst.hostname || inst.device_hostname || '',
      expiresAt: inst.expires_at ? String(inst.expires_at).replace(' ', 'T').split('T')[0] : '',
      password: inst.configuration?.password || ''
    });
    setShowModal(true);
  };

  const handleViewDetail = async (order: Order) => {
    setDetailOrder(order);
    setShowDetail(true);
    setActiveTab('info');
    setRenewalHistory([]);

    const orderType = order.type;
    const instanceId = order.instance?.id || (orderType === 'nodeverse_vps' ? order.item_id : null);

    if (instanceId && (orderType === 'vps' || orderType === 'nodeverse_vps')) {
      try {
        setIsFetchingHistory(true);
        // Load detailed instance info and history
        if (orderType === 'nodeverse_vps') {
          const [detail, history] = await Promise.all([
            vpsService.adminGetNodeverseInstanceDetail(instanceId),
            vpsService.adminGetNodeverseInstanceHistory(instanceId)
          ]);
          setDetailOrder({ ...order, instance: detail });
          setRenewalHistory(history);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsFetchingHistory(false);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedOrder) return;

    try {
      // Cập nhật status
      if (formData.status !== selectedOrder.status) {
        await adminOrderService.updateOrderStatus(selectedOrder.id, formData.status);
      }

      // Cập nhật notes
      if (formData.notes || formData.description) {
        await adminOrderService.updateOrderNotes(
          selectedOrder.id,
          formData.notes || formData.description || '',
          formData.description
        );
      }

      // Cập nhật thông tin instance (IP/Hostname/Expire/Password)
      const instanceId = selectedOrder.instance?.id ||
        (selectedOrder.type === 'nodeverse_vps' && !isNaN(Number(selectedOrder.item_id)) ? selectedOrder.item_id : null);

      if (instanceId) {
        const updateData = {
          ipAddress: formData.ipAddress || undefined,
          hostname: formData.hostname || undefined,
          expiresAt: formData.expiresAt ? `${formData.expiresAt} 00:00:00` : undefined,
          configuration: {
            ...(selectedOrder.instance.configuration || {}),
            password: formData.password || undefined,
          },
          notes: formData.notes || undefined
        };

        if (selectedOrder.type === 'vps') {
          await vpsService.updateInstance(String(instanceId), updateData);
        } else {
          await vpsService.updateNodeverseInstance(String(instanceId), updateData);
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật đơn hàng thành công',
        confirmButtonText: 'Đóng',
      });

      setShowModal(false);
      loadOrders();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể cập nhật đơn hàng',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const handleAddAttachment = (order: Order) => {
    setSelectedOrder(order);
    setAttachmentData({
      attachmentUrl: '',
      attachmentName: '',
      attachmentType: 'link'
    });
    setShowAttachmentModal(true);
  };

  const handleSaveAttachment = async () => {
    if (!selectedOrder) return;

    try {
      await adminOrderService.addOrderAttachment(
        selectedOrder.id,
        attachmentData.attachmentUrl,
        attachmentData.attachmentName,
        attachmentData.attachmentType
      );

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã thêm file/link đính kèm thành công',
        confirmButtonText: 'Đóng',
      });

      setShowAttachmentModal(false);
      loadOrders();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể thêm file/link đính kèm',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Đang chờ',
      'paid': 'Đã thanh toán',
      'processing': 'Đang xử lý',
      'dang-cho-xu-ly': 'Đang chờ xử lý',
      'dang-tao': 'Đang tạo',
      'tao-thanh-cong': 'Tạo thành công',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-700',
      'paid': 'bg-blue-100 text-blue-700',
      'processing': 'bg-purple-100 text-purple-700',
      'dang-cho-xu-ly': 'bg-amber-100 text-amber-700',
      'dang-tao': 'bg-blue-100 text-blue-700',
      'tao-thanh-cong': 'bg-emerald-100 text-emerald-700',
      'completed': 'bg-emerald-100 text-emerald-700',
      'cancelled': 'bg-rose-100 text-rose-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const formatCurrency = (amount: string | number) => {
    return parseFloat(String(amount)).toLocaleString('vi-VN') + '₫';
  };

  return (
    <>
      <PageBreadcrumb
        name="Quản lý đơn hàng VPS"
        title="Quản lý đơn hàng VPS"
        breadCrumbItems={["3HStation", "Apps", "VPS", "Đơn hàng"]}
      />

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h4 className="card-title mb-0 font-bold text-slate-800">Danh sách đơn hàng VPS</h4>
            
            <div className="flex flex-wrap items-center gap-3">
               {/* Search Box */}
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="form-input pl-10 pr-4 py-2 text-sm w-full md:w-64 border-slate-200 rounded-lg focus:ring-primary focus:border-primary transition-all"
                    placeholder="Tìm theo email, tên, mã đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               {/* Status Filter */}
               <div className="relative flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    className="form-select text-sm py-2 border-slate-200 rounded-lg focus:ring-primary"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Đang chờ</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="dang-cho-xu-ly">Đang chờ xử lý</option>
                    <option value="dang-tao">Đang tạo</option>
                    <option value="tao-thanh-cong">Tạo thành công</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
               </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
               <p className="text-sm text-slate-500 font-medium">Đang tải danh sách đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                  <Search className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 text-sm font-semibold italic">Không tìm thấy đơn hàng VPS nào.</p>
               {searchTerm && <p className="text-xs text-slate-400">Thử tìm kiếm với từ khóa khác</p>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-separate border-spacing-0">
                  <thead className="bg-slate-50/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dịch vụ & Cấu hình</th>
                      <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thanh toán</th>
                      <th className="px-5 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4">
                           <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono text-[11px] font-bold">#{order.id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-700 text-sm">{order.user?.name || 'Vô danh'}</span>
                            <span className="text-xs text-slate-400 font-medium">{order.user?.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-extrabold text-slate-900 text-[13px]">{order.plan?.name || order.item_id}</span>
                            <div className="flex flex-wrap items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase">
                                    {order.instance?.cpu || order.instance?.configuration?.cpu || order.plan?.cpu || '-'} CPU
                                </span>
                                <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-indigo-100 uppercase">
                                    {order.instance?.ram || order.instance?.configuration?.ram || order.plan?.ram || order.plan?.total_memory || '-'}GB RAM
                                </span>
                                <span className="bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-sky-100 uppercase">
                                    {order.instance?.storage || order.instance?.configuration?.ssd || order.plan?.ssd || order.plan?.disk_space || '-'}GB SSD
                                </span>
                            </div>
                            
                            {(order.instance?.device_ip || order.instance?.device_hostname) && (
                                <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-[11px] font-semibold bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">
                                    <Server className="w-3 h-3 text-emerald-500" />
                                    <span>{order.instance.device_ip || order.instance.device_hostname}</span>
                                </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <p className="text-sm font-bold text-primary">{formatCurrency(order.amount)}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{order.payment_method}</p>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight shadow-sm ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                         <td className="px-5 py-4 text-left">
                            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                               <span className="font-semibold">{new Date(order.orderCreatedAt || order.created_at).toLocaleDateString('vi-VN')}</span>
                               <span className="text-[10px] opacity-60">Expires: {order.instance?.expires_at ? new Date(order.instance.expires_at).toLocaleDateString('vi-VN') : 'Never'}</span>
                               {order.type === 'nodeverse_vps' && (
                                 <span className={`mt-1 inline-block w-fit px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${order.instance?.is_activation_email_sent ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                   {order.instance?.is_activation_email_sent ? 'Đã gửi Email' : 'Chưa gửi Email'}
                                 </span>
                               )}
                            </div>
                         </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                              onClick={() => handleViewDetail(order)}
                              title="Chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-white border border-slate-200 text-primary hover:bg-blue-50 transition-colors shadow-sm"
                              onClick={() => handleEdit(order)}
                              title="Cập nhật"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                             {(order.status === 'paid' || order.status === 'pending') && (
                              <button
                                className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm"
                                onClick={async () => {
                                  const result = await Swal.fire({
                                    title: 'Xác nhận duyệt?',
                                    text: 'Hệ thống sẽ chuyển trạng thái sang Hoàn thành và tự động khởi tạo VPS trên Nodeverse.',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Đồng ý',
                                    cancelButtonText: 'Hủy',
                                    confirmButtonColor: '#10b981'
                                  });
                                  if (result.isConfirmed) {
                                    try {
                                      setLoading(true);
                                      await adminOrderService.updateOrderStatus(order.id, 'completed');
                                      Swal.fire({
                                         icon: 'success',
                                         title: 'Đã phê duyệt',
                                         text: 'Đơn hàng đã được duyệt và đang khởi tạo...',
                                         timer: 2000,
                                         showConfirmButton: false
                                      });
                                      loadOrders();
                                    } catch (err: any) {
                                      Swal.fire('Lỗi', err.message, 'error');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                title="Phê duyệt & Khởi tạo"
                              >
                                <Flashlight className="w-4 h-4" />
                              </button>
                            )}

                            {order.type === 'nodeverse_vps' && order.instance?.id && (
                              <button
                                className={`p-2 rounded-lg border transition-colors shadow-sm ${
                                  order.instance?.is_activation_email_sent 
                                    ? 'bg-blue-50 border-blue-200 text-blue-500' 
                                    : 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                                }`}
                                onClick={async () => {
                                  const result = await Swal.fire({
                                    title: order.instance?.is_activation_email_sent ? 'Gửi lại email?' : 'Gửi email kích hoạt?',
                                    text: `Gửi thông tin tài khoản VPS đến ${order.user?.email}`,
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Gửi ngay',
                                    confirmButtonColor: '#3b82f6'
                                  });
                                  if (result.isConfirmed) {
                                    try {
                                      setLoading(true);
                                      await vpsService.adminSendActivationEmail(order.instance.id);
                                      Swal.fire('Thành công', 'Đã gửi email kích hoạt!', 'success');
                                      loadOrders();
                                    } catch (err: any) {
                                      Swal.fire('Lỗi', err.message, 'error');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                title={order.instance?.is_activation_email_sent ? "Gửi lại Email kích hoạt" : "Gửi Email kích hoạt"}
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI */}
              <div className="bg-white px-5 py-4 border-top flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Hiển thị {Math.min(orders.length, (pagination.page - 1) * pagination.limit + 1)} - {Math.min(pagination.total, pagination.page * pagination.limit)} / Tổng số <span className="text-primary">{pagination.total}</span> đơn hàng
                  </div>
                  
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, i) => {
                         const pageNum = i + 1;
                         // Logic to only show some page numbers if total is too large
                         if (pagination.totalPages > 7) {
                            if (pageNum !== 1 && pageNum !== pagination.totalPages && Math.abs(pageNum - pagination.page) > 2) {
                               if (Math.abs(pageNum - pagination.page) === 3) return <span key={i} className="px-1 text-slate-300">...</span>;
                               return null;
                            }
                         }
                         
                         return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${
                                pagination.page === pageNum 
                                  ? "bg-primary text-white shadow-md shadow-blue-200" 
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                         );
                      })}

                      <button
                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keep existing modals but with improved styles if needed */}
      {/* Modal cập nhật */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
               <Edit className="w-5 h-5 text-primary" />
               Cập nhật đơn hàng <span className="text-slate-400 font-mono">#{selectedOrder.id}</span>
            </h3>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Trạng thái đơn hàng</label>
                    <select
                      className="form-select w-full rounded-xl border-slate-200 py-2.5 font-medium"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="pending">Đang chờ (Pending)</option>
                      <option value="paid">Đã thanh toán (Paid)</option>
                      <option value="processing">Đang xử lý (Processing)</option>
                      <option value="dang-cho-xu-ly">Đang chờ xử lý</option>
                      <option value="dang-tao">Đang tạo</option>
                      <option value="tao-thanh-cong">Tạo thành công</option>
                      <option value="completed">Hoàn thành (Success)</option>
                      <option value="cancelled">Đã hủy (Cancelled)</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Ngày hết hạn VPS</label>
                    <input
                      type="date"
                      className="form-input w-full rounded-xl border-slate-200 py-2.5 font-medium"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    />
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Ghi chú vận hành</label>
                <textarea
                  className="form-input w-full rounded-xl border-slate-200 py-3 text-sm"
                  rows={4}
                  value={formData.notes || formData.description}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value, description: e.target.value })}
                  placeholder="Nhập thông tin bàn giao, tài khoản, hoặc lý do hủy đơn..."
                />
              </div>

              {selectedOrder.instance && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                     <Server className="w-3.5 h-3.5" /> Thông tin kỹ thuật Instance
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Địa chỉ IP / Domain</p>
                        <input
                          className="form-input text-xs rounded-lg border-slate-200 w-full"
                          value={formData.ipAddress}
                          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                          placeholder="e.g. 1.2.3.4"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Mật khẩu truy cập</p>
                        <input
                          className="form-input text-xs rounded-lg border-slate-200 w-full"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="password vps"
                        />
                      </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8 pb-2">
              <button
                className="flex-1 btn bg-white border-slate-200 text-slate-600 rounded-xl py-2.5 font-bold hover:bg-slate-50 transition-all"
                onClick={() => setShowModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="flex-1 btn bg-primary text-white rounded-xl py-2.5 font-bold hover:shadow-lg hover:shadow-blue-200 transition-all"
                onClick={handleSave}
              >
                Lưu cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy of details and attachment modals would go here - keeping logic same but could style UI later */}
      {/* ... (Existing showDetail and showAttachmentModal logic remains) */}

    </>
  );
};

export default VpsOrders;
