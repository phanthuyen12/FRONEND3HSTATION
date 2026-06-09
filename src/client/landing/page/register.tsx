import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';

const LandingRegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <HostingLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#060b0a] py-8 px-4">
        <div className="w-full max-w-[760px] bg-[#0d1412] rounded-xl border border-white/[0.03] shadow-sm overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="px-6 md:px-8 py-6 border-b border-white/[0.06] bg-gradient-to-r from-[#032030] to-[#0d1412]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FCD34D]/10 rounded-xl flex items-center justify-center">
                <FeatherIcon icon="info" size={24} className="text-[#FCD34D]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Thông báo đăng ký</h2>
                <p className="text-[13px] font-medium text-gray-300 mt-1">Hệ thống chỉ cấp tài khoản nội bộ bởi Admin.</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="overflow-hidden rounded-[14px] border border-white/[0.06]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                    <th className="px-4 md:px-6 py-4">Trạng thái</th>
                    <th className="px-4 md:px-6 py-4">Nội dung</th>
                    <th className="px-4 md:px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] bg-[#0b100f]">
                  <tr className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 md:px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[2px] text-amber-400">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        Chờ cấp tài khoản
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-5 text-sm md:text-[15px] font-semibold text-white">
                      Vui lòng liên hệ Admin để được cấp tài khoản và gán Rank truy cập khóa học.
                    </td>
                    <td className="px-4 md:px-6 py-5">
                      <Link
                        to="/landing-login"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FCD34D] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-[#fde047]"
                      >
                        <FeatherIcon icon="phone" size={14} />
                        Liên hệ Admin
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-4 md:p-5 text-gray-300">
              <div className="flex items-start gap-3">
                <FeatherIcon icon="shield" size={16} className="mt-0.5 text-[#FCD34D]" />
                <p className="text-sm leading-6">
                  Tài khoản được tạo và quản lý tập trung bởi Admin, không mở đăng ký công khai.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FeatherIcon icon="book-open" size={16} className="mt-0.5 text-[#FCD34D]" />
                <p className="text-sm leading-6">
                  Sau khi được cấp tài khoản, bạn sẽ được gán Rank để truy cập đúng khóa học tương ứng.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-gray-400">
                Bạn đã có tài khoản? <Link to="/landing-login" className="text-[#FCD34D] font-bold hover:underline">Đăng nhập tại đây</Link>
              </p>
              <Link
                to="/landing-login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:border-[#FCD34D]/40 hover:text-[#FCD34D]"
              >
                <FeatherIcon icon="log-in" size={14} />
                Đi tới đăng nhập
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
           3HSTATION © 2026 – Nền tảng MMO hàng đầu
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingRegisterPage;
