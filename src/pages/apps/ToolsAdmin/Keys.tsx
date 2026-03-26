import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import adminToolService from "../../../services/adminToolService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface ToolKey {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  package_id: number;
  package_name: string;
  key_token: string;
  status: 'active' | 'expired' | 'locked';
  machine_id: string;
  machine_info: any;
  activated_at: string;
  expires_at: string;
  created_at: string;
}

const ToolKeysAdmin: React.FC = () => {
  const [keys, setKeys] = useState<ToolKey[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const res = await adminToolService.getAllToolKeys();
      if (res.success) {
        setKeys(res.data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách Key", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return keys;
    const keyword = search.toLowerCase();
    return keys.filter(
      (k) =>
        k.key_token.toLowerCase().includes(keyword) ||
        k.user_name?.toLowerCase().includes(keyword) ||
        k.user_email?.toLowerCase().includes(keyword) ||
        k.machine_id?.toLowerCase().includes(keyword)
    );
  }, [keys, search]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminToolService.updateToolKeyStatus(id, status);
      await loadKeys();
      Swal.fire('Thành công', 'Đã cập nhật trạng thái Key', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý Key/License"
        name="Key/License"
        breadCrumbItems={["Admin", "Tools", "Keys"]}
      />

      <div className="card">
        <div className="card-header flex justify-between items-center bg-white p-4">
          <h4 className="card-title text-lg font-semibold">Danh sách Key đã bán</h4>
          <input
            className="form-input w-72"
            placeholder="Tìm theo Key, Tên, Email hoặc Machine ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border border-slate-200">Key Token / Gói</th>
                <th className="px-4 py-3 border border-slate-200">Người mua</th>
                <th className="px-4 py-3 border border-slate-200">Machine ID</th>
                <th className="px-4 py-3 border border-slate-200">Trạng thái</th>
                <th className="px-4 py-3 border border-slate-200">Ngày hết hạn</th>
                <th className="px-4 py-3 border border-slate-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6">Không tìm thấy Key nào.</td></tr>
              ) : filtered.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border border-slate-200">
                    <div className="font-mono text-primary font-bold">{key.key_token}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{key.package_name}</div>
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    <div className="font-medium">{key.user_name}</div>
                    <div className="text-xs text-slate-500">{key.user_email}</div>
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{key.machine_id || "Chưa kích hoạt"}</code>
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                      key.status === 'active' ? 'bg-success/10 text-success' :
                      key.status === 'locked' ? 'bg-danger/10 text-danger' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    <div className={`text-xs ${new Date(key.expires_at) < new Date() ? 'text-danger font-bold' : 'text-slate-700'}`}>
                      {new Date(key.expires_at).toLocaleDateString()}<br/>
                      {new Date(key.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-3 border border-slate-200 text-right">
                    <div className="flex justify-end gap-2">
                      {key.status === 'active' ? (
                        <button className="btn btn-xs bg-danger text-white" onClick={() => updateStatus(key.id, 'locked')}>Khóa</button>
                      ) : (
                        <button className="btn btn-xs bg-success text-white" onClick={() => updateStatus(key.id, 'active')}>Mở khóa</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ToolKeysAdmin;
