import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../components";
import toolKeyService from "../../services/toolKeyService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useNavigate } from "react-router-dom";

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

const SoftwareKeys: React.FC = () => {
  const [packages, setPackages] = useState<ToolPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buying, setBuying] = useState<number | null>(null);
  
  // Track selected pricing option for each package
  const [selectedPrices, setSelectedPrices] = useState<Record<number, number>>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await toolKeyService.listPackages();
        if (res.success) {
          setPackages(res.data);
          
          // Pre-select the first price option for each package
          const initialSelections: Record<number, number> = {};
          res.data.forEach((pkg: ToolPackage) => {
            if (pkg.prices && pkg.prices.length > 0) {
              initialSelections[pkg.id] = pkg.prices[0].id;
            }
          });
          setSelectedPrices(initialSelections);
        }
      } catch (error) {
        console.error("Lỗi tải gói phần mềm", error);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const handlePriceSelect = (packageId: number, priceId: number) => {
    setSelectedPrices(prev => ({ ...prev, [packageId]: priceId }));
  };

  const handleBuy = async (pkg: ToolPackage) => {
    const selectedPriceId = selectedPrices[pkg.id];
    const pricing = pkg.prices.find(p => p.id === selectedPriceId);
    
    if (!pricing) {
        Swal.fire('Lỗi', 'Vui lòng chọn thời gian đăng ký', 'error');
        return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận mua?',
      html: `Bạn sẽ mua gói "<b>${pkg.name}</b>"<br/>Thời hạn: <b>${pricing.label}</b> (${pricing.duration_days} ngày)<br/>Giá: <b class="text-primary">${Number(pricing.price).toLocaleString()} VNĐ</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mua ngay',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setBuying(pkg.id);
        const res = await toolKeyService.buyPackage(pkg.id, selectedPriceId);
        if (res.success) {
          await Swal.fire({
            title: 'Thành công!',
            text: 'Bạn đã mua key thành công. Chuyển đến trang quản lý key của bạn.',
            icon: 'success'
          });
          navigate('/my-software-keys');
        }
      } catch (error: any) {
        Swal.fire('Lỗi', error.response?.data?.message || 'Không thể thực hiện giao dịch', 'error');
      } finally {
        setBuying(null);
      }
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Mua Key Phần mềm"
        title="Bảng giá tự động hóa Tool & Key"
        breadCrumbItems={["Client", "Software", "Buy"]}
      />

      <div className="mb-8">
        <div className="card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-primary mb-3 text-center">Hệ thống kích hoạt phần mềm tự động 24/7</h3>
            <p className="text-slate-600 text-center max-w-3xl mx-auto text-lg leading-relaxed">
              Mua key bản quyền cho các công cụ tự động hóa, tool edit website, marketing... 
              Chọn thời gian sử dụng phù hợp với nhu cầu. Hệ thống trừ tiền và cấp Key ngay lập tức.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
             <span className="text-slate-500 font-medium">Đang tải danh sách các gói công cụ...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
              const currentPriceId = selectedPrices[pkg.id];
              const currentPricing = pkg.prices.find(p => p.id === currentPriceId);
              
              return (
                <div key={pkg.id} className="card hover:shadow-2xl transition-all duration-300 border-t-8 border-t-primary flex flex-col h-full bg-white scale-100 hover:scale-[1.02]">
                  <div className="p-6 space-y-6 flex-grow">
                    <div className="text-center">
                      <h4 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight mb-2">{pkg.name}</h4>
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                          {currentPricing ? (
                              <>
                                <div className="text-3xl font-black text-primary mb-1">
                                    {Number(currentPricing.price).toLocaleString()} <span className="text-sm font-normal text-slate-500 uppercase">VNĐ</span>
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentPricing.label} – {currentPricing.duration_days} ngày sử dụng</div>
                              </>
                          ) : (
                              <div className="text-slate-400 italic py-4">Chưa cấu hình mức giá</div>
                          )}
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-6">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6 min-h-[50px]">{pkg.description}</p>
                      
                      <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Chọn thời hạn đăng ký:</label>
                      <div className="space-y-2">
                          {pkg.prices && pkg.prices.map(pr => (
                              <div 
                                key={pr.id} 
                                onClick={() => handlePriceSelect(pkg.id, pr.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                    currentPriceId === pr.id 
                                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary" 
                                    : "border-slate-100 bg-white hover:border-slate-200"
                                }`}
                              >
                                  <div className="flex items-center space-x-3">
                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentPriceId === pr.id ? "border-primary bg-primary" : "border-slate-300"}`}>
                                          {currentPriceId === pr.id && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                                      </div>
                                      <span className={`text-sm font-bold ${currentPriceId === pr.id ? "text-primary" : "text-slate-700"}`}>{pr.label}</span>
                                  </div>
                                  <span className="text-sm font-black text-slate-900">{Number(pr.price).toLocaleString()}đ</span>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto">
                    <button
                      className="btn bg-primary text-white w-full py-3.5 rounded-xl font-black text-sm shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] transition-all uppercase disabled:opacity-50"
                      onClick={() => handleBuy(pkg)}
                      disabled={buying === pkg.id || !currentPricing}
                    >
                      {buying === pkg.id ? (
                          <span className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white mr-2"></div> Đang xử lý...
                          </span>
                      ) : "MUA GÓI NGAY"}
                    </button>
                  </div>
                </div>
              );
          })}
          {packages.length === 0 && (
            <div className="col-span-3 text-center py-20 card bg-white">
                <i className="bi bi-inbox text-5xl text-slate-200 mb-4 block"></i>
                <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">Hiện chưa có gói phần mềm nào được mở bán.</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SoftwareKeys;
