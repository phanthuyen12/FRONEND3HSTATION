import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../components";
import { userService } from "../../config";

interface Order {
  id: number;
  user_id: number;
  type: 'course' | 'workflow' | 'vps';
  item_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'processing' | 'completed' | 'dang-cho-xu-ly' | 'dang-tao' | 'tao-thanh-cong';
  created_at: string;
  updated_at: string;
}

const statusLabel: Record<string, string> = {
  "paid": "Hoàn thành",
  "pending": "Đơn hàng đang chờ",
  "cancelled": "Đơn hàng đã huỷ",
  "failed": "Thất bại",
  "processing": "Đang xử lý",
  "completed": "Hoàn thành",
  "dang-cho-xu-ly": "Đang chờ xử lý",
  "dang-tao": "Đang tạo",
  "tao-thanh-cong": "Tạo thành công",
};

const statusColor: Record<string, string> = {
  "paid": "bg-emerald-100 text-emerald-700",
  "pending": "bg-amber-100 text-amber-700",
  "cancelled": "bg-rose-100 text-rose-700",
  "failed": "bg-sky-100 text-sky-700",
  "processing": "bg-purple-100 text-purple-700",
  "completed": "bg-emerald-100 text-emerald-700",
  "dang-cho-xu-ly": "bg-amber-100 text-amber-700",
  "dang-tao": "bg-blue-100 text-blue-700",
  "tao-thanh-cong": "bg-emerald-100 text-emerald-700",
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("tat-ca");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await userService.getMyOrders({
          status: statusFilter !== "tat-ca" ? statusFilter : undefined,
          page,
          limit: pageSize,
        });
        setOrders(data.data || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (error) {
        console.error("Không thể tải đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [statusFilter, page, pageSize]);

  const summary = useMemo(() => {
    // Count from current page orders
    const paid = orders.filter((o) => o.status === "paid" || o.status === "completed" || o.status === "tao-thanh-cong").length;
    const pending = orders.filter((o) => o.status === "pending" || o.status === "dang-cho-xu-ly").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const processing = orders.filter((o) => o.status === "processing" || o.status === "dang-tao").length;
    const totalAmount = orders
      .filter((o) => o.status === "paid" || o.status === "completed" || o.status === "tao-thanh-cong")
      .reduce((sum, o) => sum + parseFloat(String(o.amount || 0)), 0);

    return {
      completed: paid,
      pending,
      canceled: cancelled,
      running: processing,
      totalAmount,
      // Note: These are counts from current page only
      // For total counts, you would need to fetch summary from API
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).toLowerCase().includes(keyword) ||
          o.item_id.toLowerCase().includes(keyword) ||
          o.type.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [orders, search]);

  const handlePageChange = (next: number) => {
    if (next < 1 || next > pagination.totalPages) return;
    setPage(next);
  };

  const handleViewDetail = async (order: Order) => {
    try {
      setLoadingDetail(true);
      const detail = await userService.getOrderById(String(order.id));
      setSelectedOrder(detail);
      setShowDetailModal(true);
    } catch (error: any) {
      console.error('Failed to load order details', error);
      alert(error.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Đơn hàng đã mua"
        title="Đơn hàng đã mua"
        breadCrumbItems={["Client", "Đơn hàng đã mua"]}
      />

      {/* Thống kê nhanh giống header trong hình minh họa */}
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mb-6">
        <div className="card">
          <div className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i className="mgc_check_circle_line text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Đơn hàng hoàn tất</p>
              <p className="text-xl font-semibold">{summary.completed}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <i className="mgc_time_line text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Đơn hàng đang chờ</p>
              <p className="text-xl font-semibold">{summary.pending}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <i className="mgc_close_circle_line text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Đơn hàng đã huỷ</p>
              <p className="text-xl font-semibold">{summary.canceled}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <i className="mgc_play_circle_line text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Đơn hàng đang chạy</p>
              <p className="text-xl font-semibold">{summary.running}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc giống thanh search/filter trong hình */}
      <div className="card mb-4">
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                <i className="mgc_search_3_line" />
              </span>
              <input
                type="text"
                className="form-input pl-9 pr-3 py-2 text-xs w-56"
                placeholder="Mã đơn hàng / Tên dịch vụ"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="form-select text-xs w-40"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="tat-ca">-- Trạng thái --</option>
              <option value="paid">Hoàn thành</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Đang chờ</option>
              <option value="dang-cho-xu-ly">Đang chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="dang-tao">Đang tạo</option>
              <option value="tao-thanh-cong">Tạo thành công</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã huỷ</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm bg-primary text-white text-xs">
              Tìm kiếm
            </button>
            <button className="btn btn-sm border text-xs">
              Bỏ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h4 className="card-title text-sm">Đơn hàng đã mua</h4>
          <div className="flex items-center gap-2 text-xs">
            <span>Hiển thị:</span>
            <select
              className="form-select form-select-sm w-18"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  # Mã đơn hàng
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Thời gian đặt hàng
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Dịch vụ
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Liên kết
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thanh toán
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Cập nhật
                </th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Đang tải đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Không tìm thấy đơn hàng nào theo điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 dark:border-slate-700/60"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          #{order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {order.type}
                          </span>
                        </span>
                        <span className="text-slate-800 text-xs">
                          ID: {order.item_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 max-w-[200px]">
                      <span className="text-slate-600 text-xs">
                        {order.type === 'course' ? 'Khóa học' : order.type === 'workflow' ? 'Workflow' : 'VPS'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          statusColor[order.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {parseFloat(String(order.amount || 0)).toLocaleString("vi-VN")}đ
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">-</td>
                    <td className="px-3 py-2 text-center">-</td>
                    <td className="px-3 py-2 text-center">-</td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                      {new Date(order.updated_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button 
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                        onClick={() => handleViewDetail(order)}
                      >
                        <i className="mgc_eye_2_line text-sm" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: tổng tiền & phân trang */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700/60 px-4 py-3 text-xs">
          <div className="text-slate-600">
            Tổng số tiền đã thanh toán:{" "}
            <span className="font-semibold text-rose-500">
              {summary.totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded border text-xs disabled:opacity-50"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Trước
            </button>
            <span>
              Trang{" "}
              <span className="font-semibold">
                {pagination.page}/{pagination.totalPages || 1}
              </span>
            </span>
            <button
              className="px-2 py-1 rounded border text-xs disabled:opacity-50"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết đơn hàng #{selectedOrder?.id}</h3>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
              >
                <i className="mgc_close_line text-xl" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="text-center py-10 text-slate-500">Đang tải...</div>
            ) : selectedOrder ? (
              <div className="space-y-4">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Mã đơn hàng</label>
                    <p className="font-semibold">#{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Trạng thái</label>
                    <p>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColor[selectedOrder.status] || "bg-slate-100 text-slate-700"
                      }`}>
                        {statusLabel[selectedOrder.status] || selectedOrder.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Loại dịch vụ</label>
                    <p className="font-semibold capitalize">{selectedOrder.type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Số tiền</label>
                    <p className="font-semibold text-emerald-600">
                      {parseFloat(String(selectedOrder.amount || 0)).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Phương thức thanh toán</label>
                    <p className="font-semibold">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Ngày tạo</label>
                    <p>{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {/* Thông tin VPS Instance */}
                {selectedOrder.type === 'vps' && selectedOrder.instance && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Thông tin VPS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500">Trạng thái VPS</label>
                        <p className="font-semibold">{selectedOrder.instance.status || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">IP Address</label>
                        <p className="font-semibold">{selectedOrder.instance.ip_address || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Hostname</label>
                        <p className="font-semibold">{selectedOrder.instance.hostname || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Ngày hết hạn</label>
                        <p>{selectedOrder.instance.expires_at ? new Date(selectedOrder.instance.expires_at).toLocaleDateString('vi-VN') : '-'}</p>
                      </div>
              {(() => {
                const billing = selectedOrder.instance.configuration?.billing || {};
                const months = selectedOrder.instance.billing_months || billing.months;
                const discount = selectedOrder.instance.billing_discount_percent ?? billing.discountPercent;
                const autoRenew = selectedOrder.instance.billing_auto_renew === 1 || selectedOrder.instance.billing_auto_renew === true || billing.autoRenew;
                const amount = selectedOrder.instance.billing_amount ?? billing.finalAmount;
                return (
                  <>
                    <div>
                      <label className="text-xs text-slate-500">Chu kỳ</label>
                      <p className="font-semibold">
                        {months ? `${months} tháng` : '-'} {discount != null ? `( -${discount}% )` : ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Tự động gia hạn</label>
                      <p className="font-semibold">{autoRenew ? 'Có' : 'Không'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Số tiền chu kỳ</label>
                      <p className="font-semibold text-emerald-600">
                        {amount != null ? `${Number(amount).toLocaleString('vi-VN')}đ` : '-'}
                      </p>
                    </div>
                  </>
                );
              })()}
                      {selectedOrder.instance.notes && (
                        <div className="col-span-2">
                          <label className="text-xs text-slate-500">Ghi chú</label>
                          <p className="text-sm whitespace-pre-wrap">{selectedOrder.instance.notes}</p>
                        </div>
                      )}
                    </div>
                    {selectedOrder.plan && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded">
                        <h5 className="font-semibold text-sm mb-2">Thông tin gói VPS</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Tên: {selectedOrder.plan.name}</div>
                          <div>CPU: {selectedOrder.plan.cpu}</div>
                          <div>RAM: {selectedOrder.plan.ram}</div>
                          <div>SSD: {selectedOrder.plan.ssd}</div>
                          <div>Bandwidth: {selectedOrder.plan.bandwidth}</div>
                          <div>Giá: {parseFloat(selectedOrder.plan.price || 0).toLocaleString('vi-VN')}đ/{selectedOrder.plan.unit}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Thông tin Workflow */}
                {selectedOrder.type === 'workflow' && selectedOrder.item && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Thông tin Workflow</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-slate-500">Tên Workflow</label>
                        <p className="font-semibold">{selectedOrder.item.name || '-'}</p>
                      </div>
                      {selectedOrder.item.description && (
                        <div>
                          <label className="text-xs text-slate-500">Mô tả</label>
                          <p className="text-sm">{selectedOrder.item.description}</p>
                        </div>
                      )}
                      {selectedOrder.item.price && (
                        <div>
                          <label className="text-xs text-slate-500">Giá</label>
                          <p className="font-semibold">{parseFloat(selectedOrder.item.price || 0).toLocaleString('vi-VN')}đ</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Thông tin Course */}
                {selectedOrder.type === 'course' && selectedOrder.item && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Thông tin Khóa học</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-slate-500">Tên khóa học</label>
                        <p className="font-semibold">{selectedOrder.item.title || '-'}</p>
                      </div>
                      {selectedOrder.item.description && (
                        <div>
                          <label className="text-xs text-slate-500">Mô tả</label>
                          <p className="text-sm">{selectedOrder.item.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">Không tìm thấy thông tin đơn hàng</div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="btn border-slate-200 text-slate-700"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;















