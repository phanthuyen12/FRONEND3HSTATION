import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { adminOrderService } from "../../../config";
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
  workflow?: any;
}

const WorkflowsOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    description: ''
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
      const data = await adminOrderService.getWorkflowOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined
      });
      setOrders(data.data || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error: any) {
      console.error("Failed to load workflow orders", error);
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
    setFormData({
      status: order.status || '',
      notes: '',
      description: ''
    });
    setShowModal(true);
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
        name="Quản lý đơn hàng Workflows"
        title="Quản lý đơn hàng Workflows"
        breadCrumbItems={["Konrix", "Apps", "Workflows", "Đơn hàng"]}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <h4 className="card-title mb-0">Danh sách đơn hàng Workflows</h4>
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
            <div className="text-center py-10 text-slate-500">Không có đơn hàng workflow nào.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Workflow</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Số tiền</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Ngày tạo</th>
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
                        <td className="px-4 py-3 text-sm">{order.workflow?.name || order.item_id}</td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          {parseFloat(order.amount).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="btn btn-sm bg-primary text-white"
                              onClick={() => handleEdit(order)}
                            >
                              <i className="mgc_edit_line mr-1" />
                              Cập nhật
                            </button>
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

              {selectedOrder.workflow && (
                <div>
                  <label className="form-label">Thông tin Workflow</label>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm">
                    <div>Tên: {selectedOrder.workflow.name || '-'}</div>
                    <div>Mô tả: {selectedOrder.workflow.description || '-'}</div>
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

export default WorkflowsOrders;






