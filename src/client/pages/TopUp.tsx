import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import TopupHistorySection from "../components/TopupHistorySection";
import { topupService } from "../../config";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

type Method = "bank" | "card";

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  branch?: string | null;
}

const TopUp: React.FC = () => {
  const [method, setMethod] = useState<Method>("bank");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (method === "bank") {
      loadBanks();
    }
  }, [method]);

  const loadBanks = async () => {
    try {
      setLoadingBanks(true);
      const data = await topupService.getBanks();
      setBanks(data || []);
      if (data && data.length > 0) {
        setSelectedBankId(data[0].id);
      }
    } catch (error: any) {
      console.error("Failed to load banks", error);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleCreateTopup = async () => {
    if (!selectedBankId || !amount || parseFloat(amount) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo!',
        text: 'Vui lòng chọn ngân hàng và nhập số tiền hợp lệ',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    try {
      setLoading(true);
      const topup = await topupService.createTopup(parseFloat(amount), selectedBankId);
      // Chuyển sang trang chi tiết với code
      navigate(`/topup/${topup.code}`);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tạo yêu cầu nạp tiền',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Nạp tiền"
        title="Nạp tiền"
        breadCrumbItems={["Client", "Nạp tiền"]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title mb-0">Chọn phương thức thanh toán</h4>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${
                  method === "bank"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
                onClick={() => setMethod("bank")}
              >
                <i className="mgc_bank_line" />
                Chuyển khoản ngân hàng
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${
                  method === "card"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
                onClick={() => setMethod("card")}
              >
                <i className="mgc_credit_card_line" />
                Thẻ ngân hàng / Visa
              </button>
            </div>

            {method === "bank" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Chọn ngân hàng bạn muốn chuyển khoản và nhập số tiền cần nạp.
                </p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Ngân hàng *
                    </label>
                    {loadingBanks ? (
                      <div className="form-input text-slate-400">Đang tải...</div>
                    ) : (
                      <select 
                        className="form-select"
                        value={selectedBankId}
                        onChange={(e) => setSelectedBankId(e.target.value)}
                      >
                        <option value="">-- Chọn ngân hàng --</option>
                        {banks.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.name} - {bank.accountNumber}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Số tiền nạp (VNĐ) *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ví dụ: 500000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="10000"
                      step="1000"
                    />
                  </div>
                </div>
                <button
                  className="btn bg-amber-500 text-white"
                  type="button"
                  onClick={handleCreateTopup}
                  disabled={loading || !selectedBankId || !amount}
                >
                  {loading ? 'Đang tạo...' : 'Tạo hướng dẫn chuyển khoản'}
                </button>
              </div>
            )}

            {method === "card" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Nhập thông tin thẻ ngân hàng / Visa (demo front-end, không lưu
                  dữ liệu thật).
                </p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 mb-1 block">
                      Số thẻ
                    </label>
                    <input
                      className="form-input"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Ngày hết hạn
                    </label>
                    <input className="form-input" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      CVV
                    </label>
                    <input className="form-input" placeholder="***" />
                  </div>
                </div>
                <button className="btn bg-emerald-500 text-white">
                  Thanh toán & nạp tiền
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Lưu ý</h4>
          </div>
          <div className="p-6 text-xs text-slate-500 space-y-2">
            <p>
              Đây là giao diện demo, chưa kết nối cổng thanh toán thực tế. Bạn
              có thể dùng phần này để tích hợp với API thanh toán sau này.
            </p>
            <p>
              Sau khi thanh toán thành công, số dư sẽ được cộng vào tài khoản và
              dùng để mua khoá học, workflows hoặc các dịch vụ khác.
            </p>
          </div>
        </div>
      </div>

      {/* Lịch sử nạp tiền */}
      <TopupHistorySection />
    </>
  );
};

export default TopUp;


