import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import HostingLayout from "../layouts/HostingLayout";
import FeatherIcon from 'feather-icons-react';
import { topupService } from "../../../config";
import Swal from 'sweetalert2';
import { useTheme } from "../context/ThemeContext";

interface Topup {
  code: string;
  amount: number;
  bank: string;
  accountNumber?: string;
  accountOwner?: string;
  expiresAt?: string;
  createdAt: string;
  status: string;
}

const getBankCode = (bankName: string): string => {
  const bankMap: Record<string, string> = {
    'Vietcombank': '970422', 'VCB': '970422',
    'Techcombank': '970407', 'TCB': '970407',
    'BIDV': '970418', 'Vietinbank': '970415',
    'VTB': '970415', 'Agribank': '970405',
    'ACB': '970416', 'TPBank': '970423',
    'MBBank': '970422', 'MB': '970422',
    'VPBank': '970432', 'Sacombank': '970403',
    'SHB': '970443', 'Eximbank': '970431',
  };
  const upperName = (bankName || '').toUpperCase();
  for (const [key, value] of Object.entries(bankMap)) {
    if (key.toUpperCase() === upperName || upperName.includes(key.toUpperCase())) return value;
  }
  return '970422';
};

const LandingTopupDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [topup, setTopup] = useState<Topup | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins default
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (code) {
      loadTopup();
      loadHistory();
    }
  }, [code]);

  useEffect(() => {
    if (topup) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [topup]);

  const loadTopup = async () => {
    try {
      setLoading(true);
      const data = await topupService.getTopupByCode(code!);
      setTopup({
        ...data,
        accountNumber: data.accountNumber || '10200581',
        accountOwner: data.accountName || 'NGUYEN TAN THANH'
      });
    } catch (error: any) {
      Swal.fire('Lỗi', 'Không thể tải thông tin nạp tiền', 'error').then(() => navigate('/landing-recharge'));
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await topupService.getHistory({ limit: 100 });
      setHistory(res?.data || []);
    } catch (e) { }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({ title: 'Đã sao chép!', text: text, icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return { m: m.toString().padStart(2, '0'), s: s.toString().padStart(2, '0') };
  };

  const qrCodeUrl = topup ? `https://img.vietqr.io/image/${getBankCode(topup.bank)}-${(topup.accountNumber || '').replace(/\s/g, '')}-compact.png?accountName=${encodeURIComponent((topup.accountOwner || '').toUpperCase())}&amount=${topup.amount}&addInfo=${encodeURIComponent(topup.code)}` : '';

  if (loading) return <HostingLayout><div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#00BA4A] border-t-transparent rounded-full animate-spin"></div></div></HostingLayout>;

  if (!topup) return null;

  const timer = formatTime(timeLeft);

  return (
    <HostingLayout>
      <div className="hidden md:block container   md:px-6 pt-1 pb-2 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[2px] ">
          <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5 transition-colors">
            <FeatherIcon icon="home" size={12} /> Trang chủ
          </Link>
          <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
          <Link to="/landing-recharge" className="text-gray-400 hover:text-[#00BA4A] transition-colors">Nạp tiền</Link>
          <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
          <span className="text-gray-900 dark:text-white">Chi tiết nạp #{topup.code}</span>
        </div>
      </div>

      <div className="bg-[#F8FAFB] dark:bg-[#060a09] min-h-screen pb-32 transition-colors duration-500">
        {/* Compact Banner Section */}
        <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-b border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none">
                  CHI TIẾT <span className="text-[#00BA4A]">HÓA ĐƠN</span>
                </h1>
                <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[3px]">
                  Hệ thống xử lý hóa đơn tự động 24/7
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/landing-recharge?pay=recharge-bank" className="px-6 h-12 rounded-xl font-black uppercase tracking-[2px] transition-all text-[10px] flex items-center gap-2 bg-[#00BA4A] text-white shadow-lg shadow-[#00BA4A]/20">
                  <FeatherIcon icon="home" size={14} /> BANK TRANSFER
                </Link>
                <Link to="/landing-recharge?pay=recharge-crypto" className="px-6 h-12 rounded-xl font-black uppercase tracking-[2px] transition-all text-[10px] flex items-center gap-2 bg-white/5 text-white/40 hover:bg-white/10 border border-white/5">
                  <FeatherIcon icon="zap" size={14} /> CRYPTO USDT
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-500 mb-8">
            {/* Information block (LEFT) */}
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="bg-gradient-to-r from-[#00BA4A] to-[#01c67c] px-6 py-4 flex items-center gap-3 text-force-white">
                  <FeatherIcon icon="database" size={18} />
                  <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Thông tin chuyển khoản</h2>
                </div>

                <div className="p-6 md:p-8 flex-1 space-y-5">
                  {/* Row: Amount */}
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Số tiền</span>
                    <span className="px-5 py-2 bg-[#00BA4A] text-force-white text-xl font-black rounded-[8px] tracking-tight">{(topup.amount || 0).toLocaleString('vi-VN')}₫</span>
                  </div>

                  {/* Row: Bank */}
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ngân hàng</span>
                    <span className="text-[16px] font-black dark:text-white uppercase tracking-tight">{topup.bank}</span>
                  </div>

                  {/* Row: Account Number */}
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[8px] text-[15px] font-black dark:text-white family-mono">{topup.accountNumber}</span>
                      <button onClick={() => handleCopy(topup.accountNumber!)} className="p-2.5 bg-[#00BA4A]/5 hover:bg-[#00BA4A]/10 text-[#00BA4A] rounded-lg transition-all group" title="Copy">
                        <FeatherIcon icon="copy" size={16} className="group-hover:scale-110" />
                      </button>
                    </div>
                  </div>

                  {/* Row: Owner */}
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Chủ tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[8px] text-[15px] font-black dark:text-white uppercase">{topup.accountOwner}</span>
                      <button onClick={() => handleCopy(topup.accountOwner!)} className="p-2.5 bg-[#00BA4A]/5 hover:bg-[#00BA4A]/10 text-[#00BA4A] rounded-lg transition-all group" title="Copy">
                        <FeatherIcon icon="copy" size={16} className="group-hover:scale-110" />
                      </button>
                    </div>
                  </div>

                  {/* Row: Content - High visibility */}
                  <div className="flex flex-col gap-3 pt-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nội dung chuyển tiền</span>
                    <div className="flex items-center justify-between bg-[#00BA4A]/5 dark:bg-[#00BA4A]/10 border-2 border-dashed border-[#00BA4A]/30 rounded-[10px] p-5">
                      <span className="text-2xl font-black text-[#00BA4A] tracking-widest">{topup.code}</span>
                      <button onClick={() => handleCopy(topup.code)} className="flex items-center gap-2 px-4 py-2 bg-[#00BA4A] text-force-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#00BA4A]/20 transition-all">
                        <FeatherIcon icon="copy" size={14} /> Sao chép MH
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-gray-400 italic text-center opacity-70">
                    * Chuyển đúng nội dung để được cộng tiền tự động siêu tốc.
                  </p>
                </div>
              </div>

              {/* Create New Prompt */}
              <Link to="/landing-recharge" className="w-full h-14 bg-white dark:bg-[#0d1412] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[10px] flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:border-[#00BA4A] hover:text-[#00BA4A] transition-all">
                <FeatherIcon icon="plus-circle" size={16} /> Tạo hóa đơn nạp tiền mới
              </Link>
            </div>

            {/* QR block (RIGHT) */}
            <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#00BA4A] to-[#01c67c] px-6 py-4 flex items-center gap-3 text-force-white">
                <FeatherIcon icon="command" size={18} />
                <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Quét mã QR để thanh toán</h2>
              </div>

              <div className="p-8 md:p-10 flex flex-col items-center justify-center space-y-8 h-full">
                <div className="p-6 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-gray-50 group transition-transform hover:scale-105 duration-500">
                  <img src={qrCodeUrl} alt="VietQR" className="w-[180px] h-[180px] object-contain" />
                </div>

                <div className="w-full space-y-3">
                  <a href={qrCodeUrl} download={`3hst-qr-${topup.code}.png`} className="w-full h-14 bg-[#00BA4A] text-force-white rounded-[10px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-[#00BA4A]/20 transition-all">
                    <FeatherIcon icon="download" size={18} /> Tải mã QR về máy
                  </a>
                  <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-loose">
                    Quét bằng ứng dụng ngân hàng để thanh toán <br /> <span className="text-[#00BA4A]">An toàn & Chính xác nhất</span>
                  </p>
                </div>

                {/* Improved Timer UX */}
                <div className="w-full flex flex-col items-center gap-3 pt-6 border-t border-gray-50 dark:border-white/5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Thời gian còn lại</div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-[#fb8c00] text-force-white w-16 h-16 rounded-[12px] flex items-center justify-center font-black text-3xl shadow-lg animate-pulse">{timer.m}</div>
                      <div className="text-[9px] font-black text-gray-400 uppercase mt-1 tracking-widest">PHÚT</div>
                    </div>
                    <div className="text-3xl font-black text-gray-300 self-center mb-5">:</div>
                    <div className="flex flex-col items-center">
                      <div className="bg-[#fb8c00] text-force-white w-16 h-16 rounded-[12px] flex items-center justify-center font-black text-3xl shadow-lg">{timer.s}</div>
                      <div className="text-[9px] font-black text-gray-400 uppercase mt-1 tracking-widest">GIÂY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Better Note Area */}
          <div className="bg-orange-50/80 dark:bg-orange-500/5 border-l-4 border-orange-500 p-6 rounded-[10px] mb-12 shadow-sm animate-in fade-in duration-1000">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <FeatherIcon icon="alert-triangle" size={20} />
              <span className="text-[14px] font-black uppercase tracking-widest">Hướng dẫn & Lưu ý quan trọng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-black">1</div>
                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">CHUYỂN KHOẢN <span className="text-orange-600">ĐÚNG SỐ TIỀN</span> VÀ <span className="text-orange-600">NỘI DUNG</span> ĐỂ ĐƯỢC CỘNG TIỀN TỰ ĐỘNG.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-black">2</div>
                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">THỜI GIAN XỬ LÝ GIAO DỊCH TỪ <span className="text-orange-600">1 - 5 PHÚT</span> SAU KHI CHUYỂN KHOẢN THÀNH CÔNG.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-black">3</div>
                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">NẾU QUÁ 5 PHÚT CHƯA NHẬN ĐƯỢC TIỀN, HÃY LIÊN HỆ <span className="text-blue-600">TELEGRAM @NTTHANHZ</span>.</p>
              </div>
            </div>
          </div>

          {/* Bottom History Table */}
          <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in duration-700">
            <div className="bg-gradient-to-r from-[#032030] to-[#04333b] px-6 py-4 flex items-center gap-3 text-force-white">
              <FeatherIcon icon="rotate-ccw" size={18} className="text-[#00BA4A]" />
              <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Lịch sử nạp tiền</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-bold">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Mã giao dịch</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4">Số tiền nạp</th>
                    <th className="px-6 py-4 text-right">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/landing-topup/${t.code}`} className="text-blue-600 font-black hover:text-[#00BA4A] transition-colors">
                          {t.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${t.status === 'da-duyet' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {t.status === 'da-duyet' ? 'Hoàn thành' : 'Đang xử lý'}
                        </span>
                      </td>
                      <td className="px-6 py-4 dark:text-white">{(t.amount || 0).toLocaleString('vi-VN')}₫</td>
                      <td className="px-6 py-4 text-right text-gray-400">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Showing {Math.min(history.length, itemsPerPage)} of {history.length} Results</span>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, Math.ceil(history.length / itemsPerPage)) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#00BA4A] text-white shadow-lg' : 'bg-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HostingLayout>
  );
};

export default LandingTopupDetailPage;
