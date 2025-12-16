import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { vpsService } from "../../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface VpsInstance {
  id: string;
  userId: string;
  orderId: string;
  planId: string;
  status: string;
  ipAddress?: string;
  hostname?: string;
  expiresAt?: string;
  configuration?: any;
  notes?: string;
  planName?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
  billingTermCode?: string;
  billingMonths?: number;
  billingDiscountPercent?: number;
  billingAutoRenew?: boolean;
  billingAmount?: number;
  orderStatus?: string;
  orderAmount?: number | string;
  orderCreatedAt?: string;
  orderUpdatedAt?: string;
}

const VpsAdminOrders: React.FC = () => {
  const [instances, setInstances] = useState<VpsInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInstance, setSelectedInstance] = useState<VpsInstance | null>(null);
  const [detailInstance, setDetailInstance] = useState<VpsInstance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    ipAddress: '',
    hostname: '',
    expiresAt: '',
    notes: '',
    password: ''
  });

  useEffect(() => {
    loadInstances();
  }, [statusFilter]);

  const loadInstances = async () => {
    try {
      setLoading(true);
      const data = await vpsService.getAdminVpsOrders({
        status: statusFilter !== "all" ? statusFilter : undefined
      });
      const mapped = (data.data || []).map((order: any) => {
        const inst = order.instance || {};
        const cfg = inst.configuration ? (typeof inst.configuration === 'string' ? JSON.parse(inst.configuration) : inst.configuration) : {};
        const billing = cfg.billing || {};
        return {
          id: String(inst.id || order.id),
          userId: String(order.user?.id || inst.user_id),
          orderId: String(order.id),
          planId: inst.plan_id,
          status: inst.status || order.status,
          ipAddress: inst.ip_address,
          hostname: inst.hostname,
          expiresAt: inst.expires_at,
          configuration: cfg,
          notes: inst.notes || order.notes,
          planName: order.plan?.name || inst.plan_name || inst.plan_id,
          userName: order.user?.name || inst.user_name,
          userEmail: order.user?.email || inst.user_email,
          createdAt: inst.created_at || order.created_at,
          updatedAt: inst.updated_at || order.updated_at,
          billingTermCode: inst.billing_term_code || billing.billingTermCode || billing.code,
          billingMonths: inst.billing_months || billing.months,
          billingDiscountPercent: inst.billing_discount_percent ?? billing.discountPercent,
          billingAutoRenew: inst.billing_auto_renew === 1 || inst.billing_auto_renew === true || billing.autoRenew,
          billingAmount: inst.billing_amount ?? billing.finalAmount,
          orderStatus: order.status,
          orderAmount: order.amount,
          orderCreatedAt: order.created_at,
          orderUpdatedAt: order.updated_at
        } as VpsInstance;
      });
      setInstances(mapped);
    } catch (error) {
      console.error("Failed to load VPS instances", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instance: VpsInstance) => {
    setSelectedInstance(instance);
    setFormData({
      status: instance.status || '',
      ipAddress: instance.ipAddress || '',
      hostname: instance.hostname || '',
      expiresAt: instance.expiresAt ? instance.expiresAt.split('T')[0] : '',
      notes: instance.notes || '',
      password: instance.configuration?.password || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedInstance) return;

    try {
      await vpsService.updateInstance(selectedInstance.id, {
        status: formData.status,
        ipAddress: formData.ipAddress,
        hostname: formData.hostname,
        expiresAt: formData.expiresAt ? `${formData.expiresAt}T00:00:00` : null,
        notes: formData.notes,
        configuration: {
          ...(selectedInstance.configuration || {}),
          password: formData.password || undefined,
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật VPS instance thành công',
        confirmButtonText: 'Đóng',
      });
      
      setShowModal(false);
      loadInstances();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể cập nhật VPS instance',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'dang-cho-xu-ly': 'Đang chờ xử lý',
      'dang-tao': 'Đang tạo',
      'tao-thanh-cong': 'Tạo thành công',
      'pending': 'Đang chờ',
      'active': 'Hoạt động',
      'suspended': 'Tạm dừng',
      'expired': 'Hết hạn',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'dang-cho-xu-ly': 'bg-amber-100 text-amber-700',
      'dang-tao': 'bg-blue-100 text-blue-700',
      'tao-thanh-cong': 'bg-emerald-100 text-emerald-700',
      'pending': 'bg-amber-100 text-amber-700',
      'active': 'bg-emerald-100 text-emerald-700',
      'suspended': 'bg-slate-100 text-slate-700',
      'expired': 'bg-rose-100 text-rose-700',
      'cancelled': 'bg-rose-100 text-rose-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const formatExpire = (instance: VpsInstance) => {
    const explicit = instance.expiresAt || (instance as any).expires_at;
    if (explicit) {
      return new Date(explicit).toLocaleDateString('vi-VN');
    }
    const months = instance.billingMonths || (instance as any).billing_months;
    const created = instance.createdAt || (instance as any).created_at || (instance as any).orderCreatedAt;
    if (months && created) {
      const d = new Date(created);
      d.setMonth(d.getMonth() + Number(months));
      return d.toLocaleDateString('vi-VN');
    }
    return '-';
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
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="dang-cho-xu-ly">Đang chờ xử lý</option>
            <option value="dang-tao">Đang tạo</option>
            <option value="tao-thanh-cong">Tạo thành công</option>
            <option value="active">Hoạt động</option>
            <option value="suspended">Tạm dừng</option>
            <option value="expired">Hết hạn</option>
          </select>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải...</div>
          ) : instances.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Không có đơn hàng VPS nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Gói VPS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Chu kỳ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">IP/Hostname</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Hết hạn</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {instances.map((instance) => (
                    <tr key={instance.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm">#{instance.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">{instance.userName || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{instance.userEmail || ''}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{instance.planName || instance.planId}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <div>{instance.billingMonths ? `${instance.billingMonths} tháng` : '-'}</div>
                        <div className="text-[11px] text-emerald-600">
                          {instance.billingDiscountPercent != null ? `- ${instance.billingDiscountPercent}%` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Auto renew: {instance.billingAutoRenew ? 'Có' : 'Không'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
                          {getStatusLabel(instance.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{instance.ipAddress || '-'}</div>
                        <div className="text-xs text-slate-500">{instance.hostname || '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatExpire(instance)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          className="btn btn-sm bg-white border text-slate-700"
                          onClick={() => {
                            setDetailInstance(instance);
                            setShowDetail(true);
                          }}
                        >
                          <i className="mgc_eye_2_line mr-1" />
                          Xem chi tiết
                        </button>
                        <button
                          className="btn btn-sm bg-primary text-white"
                          onClick={() => handleEdit(instance)}
                        >
                          <i className="mgc_edit_line mr-1" />
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal cập nhật */}
      {showModal && selectedInstance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Cập nhật VPS Instance</h3>
            
            <div className="space-y-4">
              {/* Thông tin hiện tại */}
              <div className="grid md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded">
                <div>
                  <p className="text-slate-500 mb-1">Trạng thái hiện tại</p>
                  <p className="font-semibold">{getStatusLabel(selectedInstance.status)}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Ngày hết hạn</p>
                  <p>{selectedInstance.expiresAt ? new Date(selectedInstance.expiresAt).toLocaleDateString('vi-VN') : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">IP</p>
                  <p className="font-semibold">{selectedInstance.ipAddress || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Hostname</p>
                  <p className="font-semibold">{selectedInstance.hostname || '-'}</p>
                </div>
                {selectedInstance.configuration?.password && (
                  <div>
                    <p className="text-slate-500 mb-1">Mật khẩu VPS</p>
                    <p className="font-semibold">{selectedInstance.configuration.password}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 mb-1">Chu kỳ</p>
                  <p className="font-semibold">
                    {selectedInstance.billingMonths ? `${selectedInstance.billingMonths} tháng` : '-'}{" "}
                    {selectedInstance.billingDiscountPercent != null ? `( -${selectedInstance.billingDiscountPercent}% )` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Auto renew</p>
                  <p className="font-semibold">{selectedInstance.billingAutoRenew ? 'Có' : 'Không'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Số tiền chu kỳ</p>
                  <p className="font-semibold text-emerald-600">
                    {selectedInstance.billingAmount != null
                      ? `${Number(selectedInstance.billingAmount).toLocaleString('vi-VN')}đ`
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 mb-1">Chu kỳ</p>
                  <p className="font-semibold">
                    {selectedInstance.billingMonths ? `${selectedInstance.billingMonths} tháng` : '-'}{" "}
                    {selectedInstance.billingDiscountPercent != null ? `( -${selectedInstance.billingDiscountPercent}% )` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Auto renew</p>
                  <p className="font-semibold">{selectedInstance.billingAutoRenew ? 'Có' : 'Không'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Số tiền chu kỳ</p>
                  <p className="font-semibold text-emerald-600">
                    {selectedInstance.billingAmount != null
                      ? `${Number(selectedInstance.billingAmount).toLocaleString('vi-VN')}đ`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Ngày hết hạn</p>
                  <p>{selectedInstance.expiresAt ? new Date(selectedInstance.expiresAt).toLocaleDateString('vi-VN') : '-'}</p>
                </div>
              </div>

              <div>
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="dang-cho-xu-ly">Đang chờ xử lý</option>
                  <option value="dang-tao">Đang tạo</option>
                  <option value="tao-thanh-cong">Tạo thành công</option>
                  <option value="active">Hoạt động</option>
                  <option value="suspended">Tạm dừng</option>
                  <option value="expired">Hết hạn</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="form-label">IP Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="192.168.1.1"
                />
              </div>

              <div>
                <label className="form-label">Hostname</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  placeholder="vps.example.com"
                />
              </div>

              <div>
                <label className="form-label">Ngày hết hạn</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú về VPS..."
                />
              </div>

              {selectedInstance.configuration && (
                <div>
                  <label className="form-label">Cấu hình VPS</label>
                  <pre className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(selectedInstance.configuration, null, 2)}
                  </pre>
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

      {/* Modal chi tiết đơn hàng */}
      {showDetail && detailInstance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết đơn hàng #{detailInstance.orderId}</h3>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => {
                  setShowDetail(false);
                  setDetailInstance(null);
                }}
              >
                <i className="mgc_close_line text-xl" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-500 text-xs mb-1">Trạng thái đơn</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailInstance.orderStatus || detailInstance.status)}`}>
                  {getStatusLabel(detailInstance.orderStatus || detailInstance.status)}
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Số tiền</p>
                <p className="font-semibold text-emerald-600">
                  {detailInstance.orderAmount ? Number(detailInstance.orderAmount).toLocaleString('vi-VN') : 0}đ
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Ngày tạo</p>
                <p>{detailInstance.orderCreatedAt ? new Date(detailInstance.orderCreatedAt).toLocaleString('vi-VN') : '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Cập nhật</p>
                <p>{detailInstance.orderUpdatedAt ? new Date(detailInstance.orderUpdatedAt).toLocaleString('vi-VN') : '-'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-500 text-xs mb-1">Khách hàng</p>
                <p className="font-semibold">{detailInstance.userName || '-'}</p>
                <p className="text-xs text-slate-500">{detailInstance.userEmail || ''}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Gói VPS</p>
                <p className="font-semibold">{detailInstance.planName || detailInstance.planId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded">
              <div>
                <p className="text-slate-500 text-xs mb-1">IP</p>
                <p className="font-semibold">{detailInstance.ipAddress || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Hostname</p>
                <p className="font-semibold">{detailInstance.hostname || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Trạng thái VPS</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(detailInstance.status)}`}>
                  {getStatusLabel(detailInstance.status)}
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Ngày hết hạn</p>
                <p>{formatExpire(detailInstance)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Chu kỳ</p>
                <p className="font-semibold">
                  {detailInstance.billingMonths ? `${detailInstance.billingMonths} tháng` : '-'}{" "}
                  {detailInstance.billingDiscountPercent != null ? `( -${detailInstance.billingDiscountPercent}% )` : ''}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Auto renew</p>
                <p className="font-semibold">{detailInstance.billingAutoRenew ? 'Có' : 'Không'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Số tiền chu kỳ</p>
                <p className="font-semibold text-emerald-600">
                  {detailInstance.billingAmount != null
                    ? `${Number(detailInstance.billingAmount).toLocaleString('vi-VN')}đ`
                    : '-'}
                </p>
              </div>
              {detailInstance.configuration?.password && (
                <div>
                  <p className="text-slate-500 text-xs mb-1">Mật khẩu VPS</p>
                  <p className="font-semibold">{detailInstance.configuration.password}</p>
                </div>
              )}
            </div>

            {detailInstance.notes && (
              <div className="mb-4">
                <p className="text-slate-500 text-xs mb-1">Ghi chú</p>
                <p className="text-sm whitespace-pre-wrap">{detailInstance.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="btn border-slate-200 text-slate-700"
                onClick={() => {
                  setShowDetail(false);
                  setDetailInstance(null);
                }}
              >
                Đóng
              </button>
              <button
                className="btn bg-primary text-white"
                onClick={() => {
                  setShowDetail(false);
                  setDetailInstance(null);
                  if (detailInstance) handleEdit(detailInstance);
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VpsAdminOrders;


