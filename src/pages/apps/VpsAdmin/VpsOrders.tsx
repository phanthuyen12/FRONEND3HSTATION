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

  useEffect(() => {
    loadOrders();
  }, [statusFilter, pagination.page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getVpsOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined
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

  return (
    <>
      <PageBreadcrumb
        name="Quản lý đơn hàng VPS"
        title="Quản lý đơn hàng VPS"
        breadCrumbItems={["Konrix", "Apps", "VPS", "Đơn hàng"]}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <h4 className="card-title mb-0">Danh sách đơn hàng VPS</h4>
          <select
            className="form-select w-40"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            <option value="all">Tất cả</option>
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

        <div className="card-body">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Không có đơn hàng VPS nào.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Device / Config</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Số tiền</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Ngày tạo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Ngày hết hạn</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm">#{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium">{order.user?.name || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{order.user?.email || ''}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white mb-0.5">{order.plan?.name || order.item_id}</div>
                          <div className="text-[10px] text-slate-400 space-y-1">
                            {/* Cấu hình ảo / Cấp phát */}
                            <div className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                    {order.instance?.cpu || order.instance?.configuration?.cpu || order.plan?.cpu || '-'} CPU
                                </span>
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                    {order.instance?.ram || order.instance?.configuration?.ram || order.plan?.ram || order.plan?.total_memory || '-'}GB RAM
                                </span>
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                    {order.instance?.storage || order.instance?.configuration?.ssd || order.plan?.ssd || order.plan?.disk_space || '-'}GB Disk
                                </span>
                            </div>
                            
                            {/* Thông tin Host (Chip vật lý) */}
                            {(order.plan?.cpu_info || order.instance?.configuration?.cpu_info) && (
                                <div className="text-[9px] text-slate-400 italic">
                                    Host: {order.plan?.cpu_info || order.instance?.configuration?.cpu_info}
                                </div>
                            )}

                            {/* Device & Hybrid Info */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {order.instance?.nodeverse_device_id && (
                                    <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        Driver: {order.instance.nodeverse_device_id}
                                    </span>
                                )}
                                {order.instance?.configuration?.is_hybrid && (
                                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        Hybrid
                                    </span>
                                )}
                                {order.instance?.configuration?.legacy_user_mongo_id && (
                                    <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        Ref: {order.instance.configuration.legacy_user_mongo_id}
                                    </span>
                                )}
                            </div>


                            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700 mt-1.5 space-y-1">
                                {(order.instance?.device_ip || order.instance?.device_hostname) && (
                                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                                        <i className="mgc_link_line text-[11px]" />
                                        <span className="text-primary truncate max-w-[200px]" title={order.instance.device_ip}>
                                            {order.instance.device_ip || order.instance.device_hostname}
                                        </span>
                                    </div>
                                )}
                                {(order.instance?.operating_system || order.plan?.operating_system) && (
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <i className="mgc_computer_line text-[11px]" />
                                        <span>{order.instance?.operating_system || order.plan?.operating_system}</span>
                                    </div>
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          {parseFloat(order.amount).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(order.orderCreatedAt || order.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.instance?.expires_at ? (
                            <span className={new Date(order.instance.expires_at) < new Date() ? "text-red-500 font-bold" : "text-slate-600"}>
                              {new Date(order.instance.expires_at).toLocaleDateString('vi-VN')}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="btn btn-sm bg-info text-white"
                              onClick={() => handleViewDetail(order)}
                            >
                              <i className="mgc_eye_2_line mr-1" />
                              Xem chi tiết
                            </button>
                            <button
                              className="btn btn-sm bg-primary text-white"
                              onClick={() => handleEdit(order)}
                            >
                              <i className="mgc_edit_line mr-1" />
                              Cập nhật
                            </button>
                            {(order.status === 'paid' || order.status === 'pending') && (
                              <button
                                className="btn btn-sm bg-indigo-500 text-white"
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
                                <i className="mgc_flash_line mr-1" />
                                Phê duyệt & Khởi tạo
                              </button>
                            )}
                            <button
                              className="btn btn-sm bg-emerald-500 text-white"
                              onClick={() => handleAddAttachment(order)}
                            >
                              <i className="mgc_attachment_line mr-1" />
                              Thêm link/file
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-slate-600">
                    Trang {pagination.page} / {pagination.totalPages} (Tổng: {pagination.total})
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm border-slate-200"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page <= 1}
                    >
                      Trước
                    </button>
                    <button
                      className="btn btn-sm border-slate-200"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Sau
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
            <h3 className="text-lg font-semibold mb-4">Cập nhật đơn hàng #{selectedOrder.id}</h3>

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

              {selectedOrder.instance && (
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
                      Status hiện tại: <span className="font-semibold text-slate-700">{selectedOrder.instance.status || '-'}</span>
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
              <h3 className="text-lg font-semibold">Chi tiết đơn hàng #{detailOrder.id}</h3>
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
              {(detailOrder.type === 'vps' || detailOrder.type === 'nodeverse_vps') && (
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
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailOrder.status)}`}>
                      {getStatusLabel(detailOrder.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Số tiền</p>
                    <p className="font-semibold text-emerald-600">
                      {detailOrder.amount ? Number(detailOrder.amount).toLocaleString('vi-VN') : 0}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Ngày tạo</p>
                    <p>{detailOrder.created_at ? new Date(detailOrder.created_at).toLocaleString('vi-VN') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Cập nhật</p>
                    <p>{detailOrder.updated_at ? new Date(detailOrder.updated_at).toLocaleString('vi-VN') : '-'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Khách hàng</p>
                    <p className="font-semibold">{detailOrder.user?.name || '-'}</p>
                    <p className="text-xs text-slate-500">{detailOrder.user?.email || ''}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Gói VPS</p>
                    <p className="font-semibold">{detailOrder.plan?.name || detailOrder.item_id}</p>
                  </div>
                </div>

                {detailOrder.instance && (
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">IP</p>
                      <p className="font-semibold">{detailOrder.instance.ip_address || detailOrder.instance.device_ip || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Hostname</p>
                      <p className="font-semibold">{detailOrder.instance.hostname || detailOrder.instance.device_hostname || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Trạng thái VPS</p>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailOrder.instance.status || detailOrder.status)}`}>
                        {getStatusLabel(detailOrder.instance.status || detailOrder.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Ngày hết hạn</p>
                      <p>{detailOrder.instance.expires_at ? new Date(detailOrder.instance.expires_at).toLocaleDateString('vi-VN') : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Chu kỳ</p>
                      <p className="font-semibold">
                        {detailOrder.instance.billing_months ? `${detailOrder.instance.billing_months} tháng` : '-'}{" "}
                        {detailOrder.instance.billing_discount_percent != null ? `( -${detailOrder.instance.billing_discount_percent}% )` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Auto renew</p>
                      <p className="font-semibold">
                        {detailOrder.instance.billing_auto_renew === 1 || detailOrder.instance.billing_auto_renew === true ? 'Có' : 'Không'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Số tiền chu kỳ</p>
                      <p className="font-semibold text-emerald-600">
                        {detailOrder.instance.billing_amount != null
                          ? `${Number(detailOrder.instance.billing_amount).toLocaleString('vi-VN')}đ`
                          : '-'}
                      </p>
                    </div>
                    {detailOrder.instance.configuration?.password && (
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Mật khẩu VPS</p>
                        <p className="font-semibold">{detailOrder.instance.configuration.password}</p>
                      </div>
                    )}
                  </div>
                )}

                {detailOrder.instance?.notes && (
                  <div className="mb-4">
                    <p className="text-slate-500 text-xs mb-1">Ghi chú</p>
                    <p className="text-sm border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto italic">
                      {detailOrder.instance.notes}
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
                  handleEdit(detailOrder);
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


