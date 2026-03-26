import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../components";
import toolKeyService from "../../services/toolKeyService";
import adminToolService from "../../services/adminToolService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface ToolKey {
  id: number;
  user_id: number;
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

const MySoftwareKeys: React.FC = () => {
  const [keys, setKeys] = useState<ToolKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [renewing, setRenewing] = useState<number | null>(null);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const res = await toolKeyService.getMyKeys();
      if (res.success) {
        setKeys(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách key của tôi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleRenew = async (key: ToolKey) => {
    try {
        setRenewing(key.id);
        
        // 1. Fetch available prices for this package
        const packagesRes = await toolKeyService.listPackages();
        const pkg = packagesRes.data.find((p: any) => p.id === key.package_id);
        
        if (!pkg || !pkg.prices || pkg.prices.length === 0) {
            Swal.fire('Lỗi', 'Gói phần mềm này hiện không có bảng giá gia hạn.', 'error');
            return;
        }

        // 2. Prepare HTML for Swal
        const optionsHtml = pkg.prices.map((p: any) => 
            `<option value="${p.id}">${p.label} - ${Number(p.price).toLocaleString()} VNĐ</option>`
        ).join('');

        // 3. Show Swal with selection
        const { value: priceId } = await Swal.fire({
            title: 'Chọn thời gian gia hạn',
            html: `
                <div class="text-left mb-3">Gói: <b class="text-primary">${key.package_name}</b></div>
                <select id="swal-price-select" class="form-select w-full">
                    ${optionsHtml}
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Gia hạn ngay',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                return (document.getElementById('swal-price-select') as HTMLSelectElement).value;
            }
        });

        if (priceId) {
            const res = await toolKeyService.renewKey(key.id, parseInt(priceId));
            if (res.success) {
                await Swal.fire('Thành công', 'Key đã được gia hạn thêm thời gian thành công.', 'success');
                loadKeys();
            }
        }
    } catch (error: any) {
        Swal.fire('Lỗi', error.response?.data?.message || error.message || 'Không thể gia hạn', 'error');
    } finally {
        setRenewing(null);
    }
  };

  const copyKey = (token: string) => {
    navigator.clipboard.writeText(token);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Đã copy!',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <>
      <PageBreadcrumb
        name="Quản lý Key của tôi"
        title="Danh sách Key & License"
        breadCrumbItems={["Client", "Software", "My Keys"]}
      />

      <div className="card shadow-lg border-none overflow-hidden">
        <div className="card-header bg-white p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
              <h4 className="card-title text-xl font-black text-slate-800 uppercase tracking-tight">Key phần mềm của bạn</h4>
              <p className="text-xs text-slate-400 font-medium mt-1">Quản lý và gia hạn các bản quyền phần mềm đã mua</p>
          </div>
          <button className="btn btn-sm bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all shadow-sm font-bold px-4" onClick={loadKeys}>
              <i className="mgc_refresh_line mr-1"></i> Làm mới
          </button>
        </div>
        
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Key / Loại phần mềm</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Machine ID (Thiết bị)</th>
                <th className="px-6 py-4">Ngày hết hạn</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                        <span className="text-slate-400 font-medium">Đang truy xuất dữ liệu...</span>
                    </div>
                </td></tr>
              ) : keys.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                    <i className="mgc_sad_line text-5xl mb-3 block"></i>
                    Bạn chưa sở hữu Key bản quyền nào.
                </td></tr>
              ) : keys.map((key) => {
                const isExpired = new Date(key.expires_at) < new Date();
                return (
                    <tr key={key.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                <i className="mgc_key_2_line text-lg"></i>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-mono font-black text-slate-800 text-lg uppercase tracking-wider">{key.key_token}</span>
                                    <button className="text-slate-300 hover:text-primary p-1 bg-slate-50 rounded" onClick={() => copyKey(key.key_token)} title="Copy Key">
                                        <i className="mgc_copy_line"></i>
                                    </button>
                                </div>
                                <div className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-tighter">
                                    {key.package_name}
                                </div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          key.status === 'active' && !isExpired ? 'bg-success/10 text-success border border-success/20' :
                          key.status === 'locked' ? 'bg-danger/10 text-danger border border-danger/20' :
                          'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              key.status === 'active' && !isExpired ? 'bg-success animate-pulse' :
                              key.status === 'locked' ? 'bg-danger' : 'bg-slate-400'
                          }`}></span>
                          {key.status === 'active' && !isExpired ? 'Đang hoạt động' : 
                           key.status === 'locked' ? 'Bị khóa' : 'Đã hết hạn'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          {key.machine_id ? (
                              <div className="flex flex-col gap-1">
                                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded w-fit">
                                    {key.machine_id}
                                  </span>
                                  <div className="text-[10px] text-slate-400 flex items-center">
                                      <i className="mgc_time_line mr-1"></i>
                                      Kích hoạt: {new Date(key.activated_at).toLocaleDateString()}
                                  </div>
                              </div>
                          ) : (
                              <span className="text-xs font-medium text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 italic">
                                  Chờ kích hoạt trên máy
                              </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`p-2 rounded-lg inline-block ${isExpired ? 'bg-danger/5 border border-danger/20' : 'bg-slate-50 border border-slate-100'}`}>
                          <div className={`text-sm font-black ${isExpired ? 'text-danger' : 'text-slate-700'}`}>
                            {new Date(key.expires_at).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase opacity-70">
                              {new Date(key.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                            className="btn btn-sm bg-white text-primary border border-primary/30 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm font-black text-xs px-5 py-2.5 rounded-xl flex items-center ml-auto disabled:opacity-50" 
                            onClick={() => handleRenew(key)}
                            disabled={renewing === key.id}
                        >
                          {renewing === key.id ? (
                               <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                          ) : <i className="mgc_time_line mr-1.5 text-base"></i>}
                          {renewing === key.id ? "Đang xử lý" : "Gia hạn Key"}
                        </button>
                      </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <i className="mgc_information_line text-xl"></i>
              </div>
              <div>
                  <h6 className="font-black text-slate-800 uppercase text-xs mb-2 tracking-widest">Quy định & Hướng dẫn sử dụng:</h6>
                  <div className="grid md:grid-cols-3 gap-6">
                      <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">01.</span>
                          <p className="text-[11px] text-slate-500 leading-normal">Mỗi Key được cấp cho <b>01 thiết bị</b> duy duy nhất. Không sử dụng chung key.</p>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">02.</span>
                          <p className="text-[11px] text-slate-500 leading-normal">Key được kích hoạt tự động qua <b>Machine ID</b> khi bạn mở phần mềm trên máy tính.</p>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="text-primary font-bold">03.</span>
                          <p className="text-[11px] text-slate-500 leading-normal">Gia hạn Key sẽ được <b>cộng dồn</b> vào thời gian còn lại. Có thể gia hạn nhiều lần.</p>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default MySoftwareKeys;
