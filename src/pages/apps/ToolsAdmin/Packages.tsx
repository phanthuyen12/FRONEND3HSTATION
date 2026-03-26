import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import adminToolService from "../../../services/adminToolService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface ToolPrice {
  id: number;
  label: string;
  duration_days: number;
  price: number;
}

interface ToolPackage {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  prices: ToolPrice[];
}

const emptyPackage = (): Partial<ToolPackage> => ({
  name: "",
  description: "",
  status: 'active',
  prices: []
});

const ToolPackagesAdmin: React.FC = () => {
  const [packages, setPackages] = useState<ToolPackage[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ToolPackage>>(() => emptyPackage());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // New price form
  const [newPrice, setNewPrice] = useState({ label: "", duration_days: 30, price: 0 });

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await adminToolService.getToolPackages();
      if (res.success) {
        setPackages(res.data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách gói Tool", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return packages;
    const keyword = search.toLowerCase();
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword)
    );
  }, [packages, search]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyPackage());
  };

  const startEdit = (pkg: ToolPackage) => {
    setEditingId(pkg.id);
    setForm(pkg);
  };

  const handleFormChange = (field: keyof ToolPackage, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name || form.name.trim() === "") {
        Swal.fire('Lỗi', 'Vui lòng nhập tên gói', 'error');
        return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await adminToolService.updateToolPackage(editingId, form);
      } else {
        await adminToolService.createToolPackage(form);
      }

      await loadPackages();
      if (!editingId) startCreate(); // reset if created new
      Swal.fire('Thành công', 'Đã lưu gói Tool thành công', 'success');
    } catch (error) {
      console.error("Lưu gói Tool thất bại", error);
      Swal.fire('Lỗi', 'Có lỗi khi lưu gói Tool', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Bạn không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await adminToolService.deleteToolPackage(id);
        await loadPackages();
        Swal.fire('Đã xóa!', 'Gói Tool đã được xóa.', 'success');
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa gói Tool', 'error');
      }
    }
  };

  const handleAddPrice = async () => {
    if (!editingId) {
        Swal.fire('Lỗi', 'Vui lòng lưu gói Tool trước khi thêm bảng giá', 'error');
        return;
    }
    if (!newPrice.label || !newPrice.price) {
        Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin giá', 'error');
        return;
    }

    try {
        await adminToolService.addPackagePrice(editingId, newPrice);
        const updatedPackages = await adminToolService.getToolPackages();
        if (updatedPackages.success) {
            setPackages(updatedPackages.data);
            const currentPkg = updatedPackages.data.find((p: any) => p.id === editingId);
            if (currentPkg) setForm(currentPkg);
        }
        setNewPrice({ label: "", duration_days: 30, price: 0 });
        Swal.fire('Thành công', 'Đã thêm bảng giá', 'success');
    } catch (error) {
        Swal.fire('Lỗi', 'Không thể thêm bảng giá', 'error');
    }
  };

  const handleDeletePrice = async (priceId: number) => {
    try {
        await adminToolService.deletePackagePrice(priceId);
        const updatedPackages = await adminToolService.getToolPackages();
        if (updatedPackages.success) {
            setPackages(updatedPackages.data);
            const currentPkg = updatedPackages.data.find((p: any) => p.id === editingId);
            if (currentPkg) setForm(currentPkg);
        }
        Swal.fire('Đã xóa', 'Đã xóa bảng giá', 'success');
    } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa bảng giá', 'error');
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý Gói Tool & Bảng giá"
        name="Gói Tool"
        breadCrumbItems={["Admin", "Tools", "Packages"]}
      />

      <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title">{editingId ? `Đang chỉnh sửa: ${form.name}` : "Tạo gói phần mềm mẫu"}</h4>
            {editingId && (
              <button className="btn btn-sm bg-light" onClick={startCreate}>Tạo mới</button>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="form-label">Tên phần mềm</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Ví dụ: Tool Auto Edit Website"
              />
            </div>
            <div>
              <label className="form-label">Mô tả chi tiết</label>
              <textarea
                className="form-input"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={3}
                placeholder="Nhập các tính năng nổi bật..."
              />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
            <button
              className="btn bg-primary text-white w-full"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : (editingId ? "Cập nhật thông tin gói" : "Tạo gói mẫu")}
            </button>

            {editingId && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <h5 className="text-lg font-bold mb-4">Cấu hình thời hạn & giá (Bắt buộc cho phí mua)</h5>
                    <div className="bg-light p-4 rounded-lg space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-semibold mb-1 block">Nhãn (Ví dụ: 1 Tháng)</label>
                                <input className="form-input text-sm" value={newPrice.label} onChange={e => setNewPrice({...newPrice, label: e.target.value})} placeholder="3 Tháng, 1 Năm..."/>
                            </div>
                            <div>
                                <label className="text-xs font-semibold mb-1 block">Số ngày</label>
                                <input type="number" className="form-input text-sm" value={newPrice.duration_days} onChange={e => setNewPrice({...newPrice, duration_days: parseInt(e.target.value)})}/>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold mb-1 block">Giá bán (VNĐ)</label>
                            <input type="number" className="form-input text-sm" value={newPrice.price} onChange={e => setNewPrice({...newPrice, price: parseFloat(e.target.value)})}/>
                        </div>
                        <button className="btn btn-sm bg-success text-white w-full" onClick={handleAddPrice}>Thêm mức giá</button>
                    </div>

                    <div className="space-y-2">
                        {form.prices && form.prices.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div>
                                    <div className="font-bold text-primary">{p.label} <span className="text-xs text-slate-400 font-normal">({p.duration_days} ngày)</span></div>
                                    <div className="text-sm font-semibold">{Number(p.price).toLocaleString()} VNĐ</div>
                                </div>
                                <button className="text-danger p-2 hover:bg-danger/10 rounded-full" onClick={() => handleDeletePrice(p.id)}>
                                    <i className="bi bi-trash"></i> Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title">Danh sách phần mềm</h4>
            <input
              className="form-input w-48"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Phần mềm</th>
                  <th className="px-4 py-3">Các mức giá</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
                ) : filtered.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-lg text-primary">{pkg.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{pkg.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                          {pkg.prices && pkg.prices.map(pr => (
                              <span key={pr.id} className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/20 rounded text-[10px] font-bold">
                                  {pr.label}: {Number(pr.price).toLocaleString()}
                              </span>
                          ))}
                          {(!pkg.prices || pkg.prices.length === 0) && <span className="text-xs text-slate-400 italic">Chưa set giá</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] ${pkg.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {pkg.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button className="text-primary font-bold" onClick={() => startEdit(pkg)}>Cấu hình</button>
                      <button className="text-danger font-bold" onClick={() => handleDelete(pkg.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolPackagesAdmin;
