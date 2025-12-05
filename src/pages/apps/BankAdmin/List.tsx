import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { bankService, Bank } from "../../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const BankAdminList: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    accountName: '',
    branch: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadBanks();
  }, [statusFilter, search]);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const data = await bankService.getBanks({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search || undefined
      });
      setBanks(data.data || []);
    } catch (error: any) {
      console.error("Failed to load banks", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tải danh sách tài khoản ngân hàng',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBank(null);
    setIsEdit(false);
    setFormData({
      name: '',
      accountNumber: '',
      accountName: '',
      branch: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsEdit(true);
    setFormData({
      name: bank.name,
      accountNumber: bank.accountNumber,
      accountName: bank.accountName,
      branch: bank.branch || '',
      status: bank.status
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.accountNumber || !formData.accountName) {
        Swal.fire({
          icon: 'warning',
          title: 'Cảnh báo!',
          text: 'Vui lòng điền đầy đủ thông tin bắt buộc',
          confirmButtonText: 'Đóng',
        });
        return;
      }

      if (isEdit && selectedBank) {
        await bankService.updateBank(selectedBank.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã cập nhật tài khoản ngân hàng thành công',
          confirmButtonText: 'Đóng',
        });
      } else {
        await bankService.createBank(formData);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã tạo tài khoản ngân hàng thành công',
          confirmButtonText: 'Đóng',
        });
      }
      
      setShowModal(false);
      loadBanks();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể lưu tài khoản ngân hàng',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const handleDelete = async (bank: Bank) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa tài khoản ngân hàng "${bank.name}"?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      try {
        await bankService.deleteBank(bank.id);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã xóa tài khoản ngân hàng thành công',
          confirmButtonText: 'Đóng',
        });
        loadBanks();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: error.message || 'Không thể xóa tài khoản ngân hàng',
          confirmButtonText: 'Đóng',
        });
      }
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Quản lý tài khoản ngân hàng"
        title="Quản lý tài khoản ngân hàng"
        breadCrumbItems={["Konrix", "Apps", "Tài khoản ngân hàng"]}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <h4 className="card-title mb-0">Danh sách tài khoản ngân hàng</h4>
          <button
            className="btn bg-primary text-white"
            onClick={handleAdd}
          >
            <i className="mgc_add_line mr-1" />
            Thêm tài khoản
          </button>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                <i className="mgc_search_3_line" />
              </span>
              <input
                type="text"
                className="form-input pl-9 pr-3 py-2 text-sm"
                placeholder="Tìm kiếm theo tên ngân hàng, số tài khoản, tên chủ tài khoản..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải...</div>
          ) : banks.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Không có tài khoản ngân hàng nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Tên ngân hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Số tài khoản</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Tên chủ tài khoản</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Chi nhánh</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {banks.map((bank, index) => (
                    <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{bank.name}</td>
                      <td className="px-4 py-3 text-sm">{bank.accountNumber}</td>
                      <td className="px-4 py-3 text-sm">{bank.accountName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{bank.branch || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bank.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {bank.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="btn btn-sm bg-primary text-white"
                            onClick={() => handleEdit(bank)}
                          >
                            <i className="mgc_edit_line mr-1" />
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm bg-rose-500 text-white"
                            onClick={() => handleDelete(bank)}
                          >
                            <i className="mgc_delete_line mr-1" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? 'Sửa tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Tên ngân hàng *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Vietcombank, Techcombank, BIDV..."
                />
              </div>

              <div>
                <label className="form-label">Số tài khoản *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Nhập số tài khoản"
                />
              </div>

              <div>
                <label className="form-label">Tên chủ tài khoản *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="Nhập tên chủ tài khoản"
                />
              </div>

              <div>
                <label className="form-label">Chi nhánh (tùy chọn)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="Nhập chi nhánh"
                />
              </div>

              <div>
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
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
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankAdminList;

