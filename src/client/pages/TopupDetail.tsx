import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { topupService } from "../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface Topup {
  code: string;
  amount: number;
  bank: string;
  accountNumber?: string;
  accountName?: string;
  expiresAt?: string;
  createdAt: string;
}

// Map bank name to VietQR bank code
const getBankCode = (bankName: string): string => {
  const bankMap: Record<string, string> = {
    'Vietcombank': '970422',
    'VCB': '970422',
    'Techcombank': '970407',
    'TCB': '970407',
    'BIDV': '970418',
    'Vietinbank': '970415',
    'VTB': '970415',
    'Agribank': '970405',
    'ACB': '970416',
    'TPBank': '970423',
    'MBBank': '970422',
    'MB': '970422',
    'VPBank': '970432',
    'Sacombank': '970403',
    'SHB': '970443',
    'Eximbank': '970431',
  };
  
  // Try exact match first
  if (bankMap[bankName]) {
    return bankMap[bankName];
  }
  
  // Try case-insensitive match
  const upperName = bankName.toUpperCase();
  for (const [key, value] of Object.entries(bankMap)) {
    if (key.toUpperCase() === upperName || upperName.includes(key.toUpperCase())) {
      return value;
    }
  }
  
  // Default to Vietcombank if not found
  return '970422';
};

const TopupDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [topup, setTopup] = useState<Topup | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      loadTopup();
    }
  }, [code]);

  useEffect(() => {
    // Countdown từ 60 giây
    if (topup) {
      setTimeLeft(60);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [topup]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const loadTopup = async () => {
    try {
      setLoading(true);
      const data = await topupService.getTopupByCode(code!);
      setTopup(data);
    } catch (error: any) {
      console.error("Failed to load topup", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tải thông tin nạp tiền',
        confirmButtonText: 'Đóng',
      }).then(() => {
        navigate('/topup');
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(`Đã sao chép ${label}`);
  };

  const getQrCodeUrl = () => {
    if (!topup || !topup.accountNumber || !topup.accountName) {
      return '';
    }
    
    const bankCode = getBankCode(topup.bank);
    const accountNumber = topup.accountNumber.replace(/\s/g, '');
    const accountName = encodeURIComponent(topup.accountName.toUpperCase());
    const addInfo = encodeURIComponent(topup.code);
    
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?accountName=${accountName}&addInfo=${addInfo}`;
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Chi tiết nạp tiền"
          title="Chi tiết nạp tiền"
          breadCrumbItems={["Client", "Nạp tiền", "Chi tiết"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-500">Đang tải...</div>
        </div>
      </>
    );
  }

  if (!topup) {
    return (
      <>
        <PageBreadcrumb
          name="Chi tiết nạp tiền"
          title="Chi tiết nạp tiền"
          breadCrumbItems={["Client", "Nạp tiền", "Chi tiết"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-500">Không tìm thấy thông tin nạp tiền</div>
        </div>
      </>
    );
  }

  const qrCodeUrl = getQrCodeUrl();

  return (
    <>
      <PageBreadcrumb
        name="Chi tiết nạp tiền"
        title="Chi tiết nạp tiền"
        breadCrumbItems={["Client", "Nạp tiền", "Chi tiết"]}
      />

      {/* Thanh hướng dẫn thanh toán */}
      <div className="card mb-4 border-0 bg-sky-50 dark:bg-sky-900/40">
        <div className="p-4 flex items-start gap-3 text-xs md:text-sm text-sky-900 dark:text-sky-100">
          <span className="mt-0.5 text-sky-500">
            <i className="mgc_information_line text-lg" />
          </span>
          <p>
            <span className="font-semibold">Hướng dẫn thanh toán:</span> Vui
            lòng chuyển khoản đúng số tiền và nội dung để được cộng tiền tự
            động. Nếu có vấn đề, vui lòng liên hệ hỗ trợ.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Thông tin chuyển khoản */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title mb-0">Thông tin chuyển khoản</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="text-xs text-slate-500">
              Mã giao dịch: <span className="font-semibold">{topup.code}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Số tiền</p>
                <p className="text-xl font-semibold text-emerald-600">
                  {parseFloat(String(topup.amount || 0)).toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Ngân hàng</p>
                <p className="font-medium text-slate-800">{topup.bank}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Số tài khoản</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-slate-800">{topup.accountNumber || '-'}</p>
                  {topup.accountNumber && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-7 px-2 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
                      onClick={() => handleCopy(topup.accountNumber!, "số tài khoản")}
                    >
                      <i className="mgc_copy_2_line mr-1" />
                      Sao chép
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Chủ tài khoản</p>
                <p className="font-medium text-slate-800">
                  {topup.accountName || '-'}
                </p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs text-slate-500">Nội dung CK</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-slate-800">{topup.code}</p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-7 px-2 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
                    onClick={() => handleCopy(topup.code, "nội dung chuyển khoản")}
                  >
                    <i className="mgc_copy_2_line mr-1" />
                    Sao chép
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Vui lòng ghi đúng nội dung để hệ thống tự động cộng tiền.
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Nội dung chuyển khoản chỉ áp dụng cho 1 lần chuyển khoản, nếu bạn
              cần nạp thêm vui lòng tạo hóa đơn mới bằng cách nhấn vào nút bên
              dưới.
            </p>

            <button
              type="button"
              className="mt-3 w-full md:w-auto btn bg-rose-50 text-rose-600 border border-rose-100"
              onClick={() => navigate('/topup')}
            >
              <span className="mr-1">+</span> Tạo hóa đơn mới
            </button>
          </div>
        </div>

        {/* QR thanh toán */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Quét mã QR để thanh toán</h4>
          </div>
          <div className="p-6 flex flex-col items-center gap-4">
            {qrCodeUrl ? (
              <div className="w-48 h-48 rounded-xl border border-slate-300 flex items-center justify-center bg-white p-2">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback nếu QR code không load được
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-slate-400 text-xs text-center">Không thể tải QR code</span>';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-xl border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 dark:bg-slate-900/40">
                <span className="text-slate-400 text-xs text-center">
                  QR Code không khả dụng
                </span>
              </div>
            )}
            
            {qrCodeUrl && (
              <a
                href={qrCodeUrl}
                download={`topup-${topup.code}.png`}
                className="btn btn-sm bg-slate-900 text-white"
              >
                Tải QR về máy
              </a>
            )}

            <div className="text-center text-xs text-slate-500 space-y-2">
              <p>Thời gian còn lại để thanh toán</p>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <div className="text-2xl font-semibold text-amber-500">
                    {timeLeft > 0 ? Math.floor(timeLeft / 60) : 0}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Phút
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-amber-500">
                    {timeLeft > 0 ? timeLeft % 60 : 0}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Giây
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast thông báo sao chép */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs shadow-lg flex items-center gap-2">
            <i className="mgc_check_circle_line text-emerald-400" />
            <span>{copied}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TopupDetail;

