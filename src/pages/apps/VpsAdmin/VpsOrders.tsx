import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { adminOrderService, vpsService } from "../../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

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
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Handle search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, pagination.page, debouncedSearch]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getVpsOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: debouncedSearch || undefined
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
      setSelectedIds([]); // Clear selection when data reloads
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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === orders.length && orders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const handleBulkProvision = async () => {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: 'Bulk Provision?',
      text: `Xác nhận khởi tạo ${selectedIds.length} VPS đã chọn trên Nodeverse?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Bắt đầu khởi tạo',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        let successCount = 0;
        let failCount = 0;

        for (const id of selectedIds) {
          try {
            await adminOrderService.autoProvisionOrder(id);
            successCount++;
          } catch (err) {
            console.error(`Failed to provision order ${id}:`, err);
            failCount++;
          }
        }

        Swal.fire('Hoàn tất', `Khởi tạo xong: ${successCount} thành công, ${failCount} thất bại.`, 'info');
        loadOrders();
      } catch (err: any) {
        Swal.fire('Lỗi', err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearAllHistory = async () => {
    const result = await Swal.fire({
      title: 'Xoá TOÀN BỘ lịch sử?',
      text: 'Hành động này sẽ xoá sạch tất cả đơn hàng trong hệ thống. Không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Vẫn xoá sạch',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await adminOrderService.clearAllHistory();
        Swal.fire('Đã xoá', 'Toàn bộ lịch sử đơn hàng đã được dọn sạch.', 'success');
        loadOrders();
      } catch (err: any) {
        Swal.fire('Lỗi', err.message, 'error');
      } finally {
        setLoading(false);
      }
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

  return (
    <>
      <PageBreadcrumb
        name="Quản lý đơn hàng VPS"
        title="Quản lý đơn hàng VPS"
        breadCrumbItems={["Konrix", "Apps", "VPS", "Đơn hàng"]}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <h4 className="card-title mb-0">Danh sách đơn hàng VPS</h4>
            <span className="badge bg-primary text-white rounded-full px-2 py-0.5 text-[10px]">{pagination.total}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <i className="mgc_search_line" />
              </span>
              <input
                type="text"
                className="form-input pl-10 w-64 shadow-sm"
                placeholder="Tìm kiếm user, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="mgc_close_line" />
                </button>
              )}
            </div>
            <select
              className="form-select w-40 shadow-sm"
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
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <button
              className="btn bg-rose-500 text-white shadow-sm flex items-center gap-2"
              onClick={handleClearAllHistory}
              title="Xoá sạch lịch sử đơn hàng"
            >
              <i className="mgc_delete_2_line" />
              <span className="hidden md:inline">Xoá lịch sử</span>
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-primary/5 border-y border-primary/10 px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-primary">
                  Đã chọn {selectedIds.length} đơn hàng
                </span>
                <button 
                  className="btn btn-sm bg-primary text-white flex items-center gap-2"
                  onClick={handleBulkProvision}
                >
                  <i className="mgc_flash_line" />
                  Khởi tạo hàng loạt ({selectedIds.length})
                </button>
             </div>
             <button 
               className="text-slate-500 hover:text-slate-700 text-sm font-medium"
               onClick={() => setSelectedIds([])}
             >
               Hủy chọn
             </button>
          </div>
        )}

        <div className="card-body">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Không có đơn hàng VPS nào.</div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full table-fixed border-separate border-spacing-0">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-center border-b border-slate-100 dark:border-slate-600 w-12">
                          <input 
                            type="checkbox" 
                            className="form-checkbox rounded text-primary" 
                            checked={selectedIds.length === orders.length && orders.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 sticky left-0 bg-slate-50 dark:bg-slate-700 z-10 border-b border-slate-100 dark:border-slate-600 w-16">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 min-w-[200px]">Khách hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 min-w-[250px]">Gói / Cấu hình</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 w-32">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 w-36">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 w-32">Ngày tạo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 w-32">Hết hạn</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 border-b border-slate-100 dark:border-slate-600 sticky right-0 bg-slate-50 dark:bg-slate-700 z-10 w-48">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {orders.map((order) => (
                        <tr key={order.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${selectedIds.includes(order.id) ? 'bg-primary/5' : ''}`}>
                          <td className="px-4 py-3 text-center border-b border-slate-50 dark:border-slate-700">
                             <input 
                               type="checkbox" 
                               className="form-checkbox rounded text-primary" 
                               checked={selectedIds.includes(order.id)}
                               onChange={() => toggleSelect(order.id)}
                             />
                          </td>
                          <td className="px-4 py-3 text-sm sticky left-0 bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">#{order.id}</td>
                          <td className="px-4 py-3 border-b border-slate-50 dark:border-slate-700">
                            <div className="text-sm">
                              <div className="font-medium text-slate-900 dark:text-white">{order.user?.name || 'N/A'}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{order.user?.email || ''}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 dark:border-slate-700">
                            <div className="font-semibold text-slate-900 dark:text-white mb-1 leading-tight">{order.plan?.name || order.item_id}</div>
                            <div className="text-[10px] text-slate-400 space-y-1">
                              <div className="flex items-center gap-1.5">
                                  <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-600">
                                      {order.instance?.cpu || order.instance?.configuration?.cpu || order.plan?.cpu || '-'} vCPU
                                  </span>
                                  <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-600">
                                      {order.instance?.ram || order.instance?.configuration?.ram || order.plan?.ram || order.plan?.total_memory || '-'}GB RAM
                                  </span>
                                  <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-600">
                                      {order.instance?.storage || order.instance?.configuration?.ssd || order.plan?.ssd || order.plan?.disk_space || '-'}GB SSD
                                  </span>
                              </div>
                              
                              {(order.instance?.nodeverse_device_id || order.instance?.configuration?.is_hybrid) && (
                                  <div className="flex flex-wrap items-center gap-1 mt-1">
                                      {order.instance?.nodeverse_device_id && (
                                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold border border-primary/20">
                                              {order.instance.nodeverse_device_id}
                                          </span>
                                      )}
                                      {order.instance?.configuration?.is_hybrid && (
                                          <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-200">
                                              Hybrid
                                          </span>
                                      )}
                                  </div>
                              )}

                              {(order.instance?.device_ip || order.instance?.device_hostname) && (
                                  <div className="flex items-center gap-1 text-primary font-medium mt-1">
                                      <i className="mgc_link_line text-[11px]" />
                                      <span className="truncate max-w-[150px]" title={order.instance.device_ip}>
                                          {order.instance.device_ip || order.instance.device_hostname}
                                      </span>
                                  </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold border-b border-slate-50 dark:border-slate-700">
                            {order.amount ? Number(order.amount).toLocaleString('vi-VN') : 0}đ
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 dark:border-slate-700">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status).replace('bg-', 'border-').replace('text-', 'bg-').split(' ')[0]} ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500 border-b border-slate-50 dark:border-slate-700">
                            {new Date(order.orderCreatedAt || order.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-4 py-3 text-sm border-b border-slate-50 dark:border-slate-700">
                            {order.instance?.expires_at ? (
                              <span className={`inline-block px-1.5 py-0.5 rounded font-medium ${new Date(order.instance.expires_at) < new Date() ? "bg-rose-50 text-rose-600" : "text-slate-600"}`}>
                                {new Date(order.instance.expires_at).toLocaleDateString('vi-VN')}
                              </span>
                            ) : <span className="text-slate-400">-</span>}
                          </td>
                          <td className="px-4 py-3 text-right sticky right-0 bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-slate-700 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 transition-colors"
                                title="Xem chi tiết"
                                onClick={() => handleViewDetail(order)}
                              >
                                <i className="mgc_eye_2_line" />
                              </button>
                              
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                title="Cập nhật"
                                onClick={() => handleEdit(order)}
                              >
                                <i className="mgc_edit_line" />
                              </button>

                              {(order.status === 'paid' || order.status === 'pending' || order.status === 'dang-cho-xu-ly') && (
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm transition-colors"
                                  title="Phê duyệt & Khởi tạo"
                                  onClick={async () => {
                                    const result = await Swal.fire({
                                      title: 'Xác nhận?',
                                      text: 'Hệ thống sẽ chuyển trạng thái sang Hoàn thành và tự động khởi tạo VPS trên Nodeverse.',
                                      icon: 'question',
                                      showCancelButton: true,
                                      confirmButtonText: 'Đồng ý',
                                      cancelButtonText: 'Hủy'
                                    });
                                    if (result.isConfirmed) {
                                      try {
                                        setLoading(true);
                                        await adminOrderService.updateOrderStatus(order.id, 'completed');
                                        Swal.fire('Thành công', 'Đơn hàng đã được duyệt và đang khởi tạo...', 'success');
                                        loadOrders();
                                      } catch (err: any) {
                                        Swal.fire('Lỗi', err.message, 'error');
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                >
                                  <i className="mgc_flash_line" />
                                </button>
                              )}

                              {(order.type === 'nodeverse_vps' || !!order.instance?.nodeverse_device_id) && order.status !== 'completed' && order.status !== 'tao-thanh-cong' && (
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors animate-pulse"
                                  title="Auto Provision (Nodeverse)"
                                  onClick={async () => {
                                    const result = await Swal.fire({
                                      title: 'Khởi tạo Nodeverse?',
                                      text: 'Hệ thống sẽ gọi API Nodeverse để cấp phát VPS và tự động cập nhật thông tin đơn hàng.',
                                      icon: 'info',
                                      showCancelButton: true,
                                      confirmButtonText: 'Xác nhận khởi tạo',
                                      cancelButtonText: 'Hủy'
                                    });
                                    if (result.isConfirmed) {
                                      try {
                                        setLoading(true);
                                        const res = await adminOrderService.autoProvisionOrder(order.id);
                                        Swal.fire({
                                          title: 'Thành công!',
                                          text: `VPS đã được khởi tạo: ${res.provision?.data?.deviceName || ''} (${res.provision?.data?.deviceIp || ''})`,
                                          icon: 'success'
                                        });
                                        loadOrders();
                                      } catch (err: any) {
                                        Swal.fire('Thất bại', err.message, 'error');
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                >
                                  <i className="mgc_rocket_line" />
                                </button>
                              )}
                              
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-colors"
                                title="Thêm link/file"
                                onClick={() => handleAddAttachment(order)}
                              >
                                <i className="mgc_attachment_line" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Enhanced */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between mt-6 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="text-sm text-slate-500 font-medium">
                    Hiển thị <span className="text-slate-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="text-slate-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> của <span className="text-slate-900 dark:text-white">{pagination.total}</span> đơn hàng
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                      disabled={pagination.page <= 1}
                      title="Trang đầu"
                    >
                      <i className="mgc_arrow_left_double_line" />
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm ml-1 mr-2"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page <= 1}
                    >
                      <i className="mgc_left_line" />
                    </button>
                    
                    <div className="flex items-center gap-1 mx-2">
                       {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum = pagination.page - 2 + i;
                          if (pagination.page <= 2) pageNum = i + 1;
                          if (pagination.page >= pagination.totalPages - 1) pageNum = pagination.totalPages - 4 + i;
                          if (pageNum < 1) pageNum = 1;
                          if (pageNum > pagination.totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${pagination.page === pageNum ? 'bg-primary text-white shadow-md shadow-primary/30 rotate-0' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-transparent'}`}
                              onClick={() => setPagination(prev => ({ ...prev, page: pageNum || 1 }))}
                            >
                              {pageNum}
                            </button>
                          );
                       })}
                    </div>

                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm ml-2 mr-1"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      <i className="mgc_right_line" />
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                      disabled={pagination.page >= pagination.totalPages}
                      title="Trang cuối"
                    >
                      <i className="mgc_arrow_right_double_line" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal cập nhật */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">Cập nhật đơn hàng #{selectedOrder?.id}</h3>

            <div className="space-y-4">
              <div>
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
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

              <div>
                <label className="form-label">Ghi chú / Mô tả</label>
                <textarea
                  className="form-input"
                  rows={6}
                  value={formData.notes || formData.description}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value, description: e.target.value })}
                  placeholder="Nhập ghi chú hoặc mô tả về đơn hàng..."
                />
              </div>

              {selectedOrder?.instance && (
                <div className="space-y-3">
                  <label className="form-label">Thông tin VPS Instance</label>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm space-y-2">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">IP</p>
                        <input
                          className="form-input text-sm"
                          value={formData.ipAddress}
                          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                          placeholder="IP Address"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Hostname</p>
                        <input
                          className="form-input text-sm"
                          value={formData.hostname}
                          onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                          placeholder="hostname"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Ngày hết hạn</p>
                        <input
                          type="date"
                          className="form-input text-sm"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Mật khẩu VPS (tuỳ chọn)</p>
                        <input
                          className="form-input text-sm"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="******"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Status hiện tại: <span className="font-semibold text-slate-700">{selectedOrder?.instance.status || '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="btn border-slate-200 text-slate-700"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn bg-primary text-white"
                onClick={handleSave}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetail && detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết đơn hàng #{detailOrder?.id}</h3>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => {
                  setShowDetail(false);
                  setDetailOrder(null);
                }}
              >
                <i className="mgc_close_line text-xl" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('info')}
              >
                Thông tin chung
              </button>
              {(detailOrder?.type === 'vps' || detailOrder?.type === 'nodeverse_vps') && (
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab('history')}
                >
                  Lịch sử gia hạn
                </button>
              )}
            </div>

            {activeTab === 'info' ? (
              <>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Trạng thái đơn</p>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailOrder?.status || 'pending')}`}>
                      {getStatusLabel(detailOrder?.status || 'pending')}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Số tiền</p>
                    <p className="font-semibold text-emerald-600">
                      {detailOrder?.amount ? Number(detailOrder?.amount).toLocaleString('vi-VN') : 0}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Ngày tạo</p>
                    <p>{detailOrder?.created_at ? new Date(detailOrder.created_at).toLocaleString('vi-VN') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Cập nhật</p>
                    <p>{detailOrder?.updated_at ? new Date(detailOrder.updated_at).toLocaleString('vi-VN') : '-'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Khách hàng</p>
                    <p className="font-semibold">{detailOrder?.user?.name || '-'}</p>
                    <p className="text-xs text-slate-500">{detailOrder?.user?.email || ''}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Gói VPS</p>
                    <p className="font-semibold">{detailOrder?.plan?.name || detailOrder?.item_id}</p>
                  </div>
                </div>

                {detailOrder?.instance && (
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">IP</p>
                      <p className="font-semibold">{detailOrder?.instance.ip_address || detailOrder?.instance.device_ip || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Hostname</p>
                      <p className="font-semibold">{detailOrder?.instance.hostname || detailOrder?.instance.device_hostname || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Trạng thái VPS</p>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailOrder?.instance.status || detailOrder?.status || 'pending')}`}>
                        {getStatusLabel(detailOrder?.instance.status || detailOrder?.status || 'pending')}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Ngày hết hạn</p>
                      <p>{detailOrder?.instance.expires_at ? new Date(detailOrder?.instance.expires_at).toLocaleDateString('vi-VN') : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Chu kỳ</p>
                      <p className="font-semibold">
                        {detailOrder?.instance.billing_months ? `${detailOrder?.instance.billing_months} tháng` : '-'}{" "}
                        {detailOrder?.instance.billing_discount_percent != null ? `( -${detailOrder?.instance.billing_discount_percent}% )` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Auto renew</p>
                      <p className="font-semibold">
                        {detailOrder?.instance.billing_auto_renew === 1 || detailOrder?.instance.billing_auto_renew === true ? 'Có' : 'Không'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Số tiền chu kỳ</p>
                      <p className="font-semibold text-emerald-600">
                        {detailOrder?.instance.billing_amount != null
                          ? `${Number(detailOrder?.instance.billing_amount).toLocaleString('vi-VN')}đ`
                          : '-'}
                      </p>
                    </div>
                    {detailOrder?.instance.configuration?.password && (
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Mật khẩu VPS</p>
                        <p className="font-semibold">{detailOrder?.instance.configuration.password}</p>
                      </div>
                    )}
                  </div>
                )}

                {detailOrder?.instance?.notes && (
                  <div className="mb-4">
                    <p className="text-slate-500 text-xs mb-1">Ghi chú</p>
                    <p className="text-sm border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto italic">
                      {detailOrder?.instance.notes}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {isFetchingHistory ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : renewalHistory.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    Chưa có lịch sử gia hạn.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                          <th className="px-3 py-2 text-left">Ngày</th>
                          <th className="px-3 py-2 text-left">Loại</th>
                          <th className="px-3 py-2 text-right">Số tiền</th>
                          <th className="px-3 py-2 text-center">Thanh toán</th>
                          <th className="px-3 py-2 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {renewalHistory.map(h => (
                          <tr key={h.id}>
                            <td className="px-3 py-2">
                              {new Date(h.created_at).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-3 py-2">
                              {h.historyType === 'purchase' ? (
                                <span className="text-primary font-medium">Mua mới</span>
                              ) : (
                                <span className="text-indigo-600 font-medium">Gia hạn</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-emerald-600">
                              {Number(h.amount).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-3 py-2 text-center text-xs uppercase">
                              {h.payment_method}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${getStatusColor(h.status)}`}>
                                {getStatusLabel(h.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="btn border-slate-200 text-slate-700"
                onClick={() => {
                  setShowDetail(false);
                  setDetailOrder(null);
                }}
              >
                Đóng
              </button>
              <button
                className="btn bg-primary text-white"
                onClick={() => {
                  setShowDetail(false);
                  setDetailOrder(null);
                  handleEdit(detailOrder!);
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm attachment */}
      {showAttachmentModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm file/link đính kèm</h3>

            <div className="space-y-4">
              <div>
                <label className="form-label">Loại</label>
                <select
                  className="form-select"
                  value={attachmentData.attachmentType}
                  onChange={(e) => setAttachmentData({ ...attachmentData, attachmentType: e.target.value as 'link' | 'file' })}
                >
                  <option value="link">Link</option>
                  <option value="file">File</option>
                </select>
              </div>

              <div>
                <label className="form-label">URL / Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={attachmentData.attachmentUrl}
                  onChange={(e) => setAttachmentData({ ...attachmentData, attachmentUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="form-label">Tên file/link (tùy chọn)</label>
                <input
                  type="text"
                  className="form-input"
                  value={attachmentData.attachmentName}
                  onChange={(e) => setAttachmentData({ ...attachmentData, attachmentName: e.target.value })}
                  placeholder="Tên mô tả..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="btn border-slate-200 text-slate-700"
                onClick={() => setShowAttachmentModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn bg-primary text-white"
                onClick={handleSaveAttachment}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VpsOrders;


