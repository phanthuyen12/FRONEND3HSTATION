import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { vpsService } from "../../../config";
import { VpsPlan } from "../../../services/vpsService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

type EditableVpsPlan = VpsPlan;

const emptyPlan = (): EditableVpsPlan => ({
  id: "",
  name: "",
  price: "",
  unit: "VNĐ/tháng",
  cpu: "",
  ram: "",
  ssd: "",
  bandwidth: "",
});

const VpsAdminList: React.FC = () => {
  const [plans, setPlans] = useState<EditableVpsPlan[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditableVpsPlan>(() => emptyPlan());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await vpsService.fetchAdminPlans();
      setPlans(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải danh sách VPS", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return plans;
    const keyword = search.toLowerCase();
    return plans.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.id.toLowerCase().includes(keyword)
    );
  }, [plans, search]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyPlan());
  };

  const startEdit = (plan: EditableVpsPlan) => {
    setEditingId(plan.id);
    setForm(plan);
  };

  const handleFormChange = <K extends keyof EditableVpsPlan>(
    field: K,
    value: EditableVpsPlan[K]
  ) => {
    setForm((prev: EditableVpsPlan) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const save = async () => {
      if (!form.id.trim() || !form.name.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Thiếu thông tin',
          text: 'Vui lòng nhập ít nhất Mã gói (id) và Tên gói.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#3b82f6',
        });
        return;
      }

      try {
        setSaving(true);
        let saved: EditableVpsPlan;

        if (editingId) {
          saved = await vpsService.updatePlan(editingId, form);
        } else {
          saved = await vpsService.createPlan(form);
        }

        // Fetch lại dữ liệu từ server để đảm bảo dữ liệu đầy đủ
        await loadPlans();

        // Giữ lại editingId nếu đang cập nhật, hoặc set editingId cho item mới tạo
        if (!editingId) {
          setEditingId(saved.id);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: editingId ? 'Đã cập nhật gói VPS thành công.' : 'Đã thêm gói VPS thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Lưu gói VPS thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Có lỗi khi lưu gói VPS. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      } finally {
        setSaving(false);
      }
    };

    void save();
  };

  const handleDelete = (id: string) => {
    const performDelete = async () => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xoá gói VPS này?',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
      });

      if (!result.isConfirmed) return;

      try {
        await vpsService.deletePlan(id);
        // Fetch lại dữ liệu từ server
        await loadPlans();
        if (editingId === id) {
          startCreate();
        }
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã xóa gói VPS thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Xoá gói VPS thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể xoá gói VPS. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      }
    };

    void performDelete();
  };

  const handleTogglePopular = (id: string) => {
    const toggle = async () => {
      try {
        const current = plans.find((p) => p.id === id);
        const nextPopular = !current?.popular;
        await vpsService.togglePopular(id, !!nextPopular);
        // Fetch lại dữ liệu từ server
        await loadPlans();
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: nextPopular ? 'Đã đánh dấu gói VPS là phổ biến.' : 'Đã bỏ đánh dấu phổ biến cho gói VPS.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Cập nhật trạng thái phổ biến thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật trạng thái phổ biến. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      }
    };

    void toggle();
  };

  const totalPopular = useMemo(
    () => plans.filter((p) => p.popular).length,
    [plans]
  );
  const totalConfigs = useMemo(
    () => plans.length,
    [plans]
  );

  return (
    <>
      <PageBreadcrumb
        title="Quản lý gói VPS"
        name="Quản lý gói VPS"
        breadCrumbItems={["Konrix", "Apps", "VPS"]}
      />

      {/* Header + stats */}
      <div className="card mb-6">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách gói VPS
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Quản lý cấu hình, giá và gói được đánh dấu phổ biến cho trang
                client.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng gói VPS
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : plans.length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Gói phổ biến
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : totalPopular}
              </p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Cấu hình hiện có
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : totalConfigs}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 grid-cols-1 gap-6">
        {/* Form tạo / cập nhật VPS */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">
              {editingId ? "Cập nhật gói VPS" : "Tạo gói VPS mới"}
            </h4>
            {editingId && (
              <button
                type="button"
                className="btn btn-xs bg-slate-100 text-xs"
                onClick={startCreate}
              >
                Tạo mới
              </button>
            )}
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Mã gói (id)
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="Ví dụ: kvm-1"
                  value={form.id}
                  onChange={(e) =>
                    handleFormChange("id", e.target.value.trim())
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Tên gói
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="Ví dụ: KVM 1"
                  value={form.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Giá
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="120.900"
                  value={form.price}
                  onChange={(e) =>
                    handleFormChange("price", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Đơn vị
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="VNĐ/tháng"
                  value={form.unit}
                  onChange={(e) =>
                    handleFormChange("unit", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Nhãn giảm giá (optional)
              </label>
              <input
                className="form-input text-xs"
                placeholder="Ví dụ: GIẢM GIÁ 60%"
                value={form.discountLabel || ""}
                onChange={(e) =>
                  handleFormChange("discountLabel", e.target.value)
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  CPU
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="1 nhân vCPU"
                  value={form.cpu}
                  onChange={(e) =>
                    handleFormChange("cpu", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  RAM
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="4 GB RAM"
                  value={form.ram}
                  onChange={(e) =>
                    handleFormChange("ram", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Ổ cứng
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="50 GB NVMe SSD"
                  value={form.ssd}
                  onChange={(e) =>
                    handleFormChange("ssd", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Băng thông
                </label>
                <input
                  className="form-input text-xs"
                  placeholder="4 TB băng thông"
                  value={form.bandwidth}
                  onChange={(e) =>
                    handleFormChange("bandwidth", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="popular"
                type="checkbox"
                className="form-checkbox"
                checked={!!form.popular}
                onChange={(e) =>
                  handleFormChange("popular", e.target.checked)
                }
              />
              <label
                htmlFor="popular"
                className="text-xs text-slate-600 select-none"
              >
                Đánh dấu là gói phổ biến
              </label>
            </div>

            <button
              type="button"
              className="btn bg-primary text-white text-sm w-full mt-2 disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật gói VPS"
                : "Thêm gói VPS"}
            </button>

            <p className="text-[11px] text-slate-500">
              Dữ liệu đang lấy trực tiếp từ API VPS (`/vps/plans`). Form này sẽ
              gửi yêu cầu tạo/cập nhật/xoá gói VPS lên backend.
            </p>
          </div>
        </div>

        {/* Danh sách gói VPS */}
        <div className="xl:col-span-2 card">
          <div className="card-header flex flex-wrap items-center justify-between gap-3">
            <h4 className="card-title mb-0">Danh sách gói VPS</h4>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-64"
                  placeholder="Tìm theo mã gói hoặc tên gói"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/60">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Gói VPS
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Tài nguyên
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">
                    Giá
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-t border-slate-100 dark:border-slate-700/60"
                  >
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">
                          ID:{" "}
                          <span className="font-mono text-slate-700">
                            {plan.id}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold uppercase">
                              Phổ biến
                            </span>
                          )}
                        </div>
                        {plan.discountLabel && (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-medium">
                            {plan.discountLabel}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      <div className="flex flex-col gap-1">
                        <span>{plan.cpu}</span>
                        <span>{plan.ram}</span>
                        <span>{plan.ssd}</span>
                        <span>{plan.bandwidth}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-primary">
                      {plan.price}{" "}
                      <span className="text-[11px] text-slate-500">
                        {plan.unit}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="btn btn-xs bg-slate-100 text-xs mr-2"
                        onClick={() => startEdit(plan)}
                      >
                        <i className="mgc_edit_line mr-1" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs bg-emerald-50 text-emerald-600 text-xs mr-2"
                        onClick={() => handleTogglePopular(plan.id)}
                      >
                        {plan.popular ? "Bỏ phổ biến" : "Đánh dấu phổ biến"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <i className="mgc_delete_line mr-1" />
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-slate-500 text-sm"
                    >
                      Không tìm thấy gói VPS nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default VpsAdminList;


