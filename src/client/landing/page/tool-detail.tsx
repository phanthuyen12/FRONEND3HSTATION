import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import toolKeyService from '../../../services/toolKeyService';
import Swal from 'sweetalert2';

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

const fmt = (n: any) => {
    const num = typeof n === 'string' ? parseFloat(n) : n;
    if (isNaN(num)) return '0đ';
    return num.toLocaleString('vi-VN') + 'đ';
};

const LandingToolDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [tool, setTool] = useState<ToolPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const loadTool = async () => {
      try {
        setLoading(true);
        const res = await toolKeyService.listPackages();
        if (res.success) {
          const found = res.data.find((p: ToolPackage) => String(p.id) === id);
          if (found) {
            setTool(found);
            if (found.prices && found.prices.length > 0) {
              setSelectedPriceId(found.prices[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi tải thông tin tool", error);
      } finally {
        setLoading(false);
      }
    };
    loadTool();
  }, [id]);

  const handleBuy = async () => {
    if (!tool || !selectedPriceId) return;
    
    const pricing = tool.prices.find(p => p.id === selectedPriceId);
    if (!pricing) return;

    const result = await Swal.fire({
      title: 'Xác nhận mua?',
      html: `Bạn sẽ mua gói "<b>${tool.name}</b>"<br/>Thời hạn: <b>${pricing.label}</b> (${pricing.duration_days} ngày)<br/>Giá: <b class="text-primary">${Number(pricing.price).toLocaleString()} VNĐ</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mua ngay',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setBuying(true);
        const res = await toolKeyService.buyPackage(tool.id, selectedPriceId);
        if (res.success) {
          await Swal.fire({
            title: 'Thành công!',
            text: 'Bạn đã mua key thành công. Chuyển đến trang quản lý key của bạn.',
            icon: 'success'
          });
          navigate('/landing-software-management');
        }
      } catch (error: any) {
        Swal.fire('Lỗi', error.message || 'Không thể thực hiện giao dịch', 'error');
      } finally {
        setBuying(false);
      }
    }
  };

  if (loading) {
    return (
      <HostingLayout>
        <div className="min-h-screen bg-[#060a09] flex items-center justify-center">
            <div className="animate-pulse text-gray-400 font-black uppercase tracking-widest text-sm">Đang tải dữ liệu...</div>
        </div>
      </HostingLayout>
    );
  }

  if (!tool) {
    return (
      <HostingLayout>
        <div className="min-h-screen bg-[#060a09] flex flex-col items-center justify-center gap-4">
            <div className="text-gray-400 font-black uppercase tracking-widest text-sm">Không tìm thấy Công cụ</div>
            <Link to="/landing-tools" className="px-6 py-2 bg-[#FBBF24] text-white rounded-lg text-xs font-black uppercase">Quay lại</Link>
        </div>
      </HostingLayout>
    );
  }

  const selectedPricing = tool.prices.find(p => p.id === selectedPriceId);

  return (
    <HostingLayout>
      <div className="min-h-screen bg-[#060a09] pt-0 pb-12">

        {/* ── BREADCRUMBS ── */}
        <div className="hidden md:block container mx-auto px-4 md:px-6 pt-1 pb-2">
          <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
            <Link to="/" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1">
              <FeatherIcon icon="home" size={14} /> Trang chủ
            </Link>
            <FeatherIcon icon="chevron-right" size={12} />
            <Link to="/landing-tools" className="hover:text-[#FBBF24]">Công cụ</Link>
            <FeatherIcon icon="chevron-right" size={12} />
            <span className="text-white font-bold">{tool.name}</span>
          </div>
        </div>

        {/* ── HERO SECTION ── */}
        <div className="bg-gradient-to-r from-[#FBBF24] to-[#032030] dark:from-[#0a1411] dark:to-[#080d0c] py-10 mb-8 border-b border-white/[0.03] text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FBBF24] to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-full md:w-[280px] h-[190px] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <FeatherIcon icon="tool" size={32} className="text-[#FBBF24]" />
                    <span className="text-[10px] font-bold bg-[#FBBF24] px-2 py-0.5 rounded text-white uppercase shadow-lg">License Key</span>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl mb-1">{tool.name}</h3>
                    <div className="bg-[#0d1412]/10 px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase tracking-wider text-white">Active 24/7</div>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-black mb-3 tracking-tight !text-white">{tool.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/[0.03]">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FeatherIcon key={i} icon="star" size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                   <div className="px-3 py-1.5 rounded-lg bg-[#FBBF24] text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg shadow-[#FBBF24]/20">
                    <FeatherIcon icon="zap" size={12} fill="white" /> Tự động kích hoạt
                  </div>
                </div>
                <p className="text-white/70 text-sm max-w-xl leading-relaxed">{tool.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT COLUMN */}
            <div className="w-full lg:flex-1 space-y-6">
              {/* Variation Selection (Prices) */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] overflow-hidden shadow-sm">
                <div className="p-4 flex flex-col divide-y divide-gray-50 dark:divide-white/5">
                  <div className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">Chọn gói bản quyền:</div>
                  {tool.prices.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPriceId(p.id)}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-all ${selectedPriceId === p.id ? 'bg-[#FBBF24]/5' : 'hover:bg-white/5 dark:hover:bg-[#0d1412]/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPriceId === p.id ? 'border-[#FBBF24] bg-[#FBBF24]' : 'border-gray-700'}`}>
                          {selectedPriceId === p.id && <div className="w-2 h-2 rounded-full bg-[#0d1412]" />}
                        </div>
                        <div className="text-sm font-bold text-white">{p.label}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-[#FBBF24]">{fmt(p.price)}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{p.duration_days} ngày sử dụng</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-6 shadow-sm">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <FeatherIcon icon="info" size={16} className="text-[#FBBF24]" /> TÍNH NĂNG & HƯỚNG DẪN
                </h3>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {tool.description}
                  <br /><br />
                  - Kích hoạt bản quyền tự động ngay sau khi thanh toán.<br />
                  - Hỗ trợ cập nhật phiên bản mới nhất vĩnh viễn.<br />
                  - Đổi máy/Reset Key 24/7 (với một số gói cụ thể).
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#0d1412] rounded-xl border border-white/[0.03] p-6 shadow-2xl space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng thanh toán:</div>
                  <div className="text-4xl font-black text-[#FBBF24] tracking-tight">{selectedPricing ? fmt(selectedPricing.price) : '0đ'}</div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
                      <FeatherIcon icon="clock" size={14} /> Thời hạn: {selectedPricing?.label || 'Chưa chọn'}
                  </div>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={buying || !selectedPriceId}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#032030] to-[#FBBF24] hover:bg-opacity-90 !text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#FBBF24]/20 active:scale-95 disabled:opacity-50"
                >
                  {buying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/[0.03]0 border-t-white" /> ĐANG XỬ LÝ...
                      </>
                  ) : (
                      <>
                        <FeatherIcon icon="shopping-cart" size={18} fill="currentColor" /> MUA KEY NGAY
                      </>
                  )}
                </button>

                <div className="space-y-4 pt-6 border-t border-white/[0.03]">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <FeatherIcon icon="shield" size={14} className="text-[#FBBF24]" /> Kích hoạt tự động 100%
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <FeatherIcon icon="headphones" size={14} className="text-[#FBBF24]" /> Hỗ trợ kỹ thuật 24/7
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <FeatherIcon icon="refresh-cw" size={14} className="text-[#FBBF24]" /> Cập nhật vĩnh viễn
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingToolDetailPage;
