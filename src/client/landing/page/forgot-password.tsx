import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';
import Swal from 'sweetalert2';

const LandingForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      Swal.fire('Lỗi', 'Vui lòng nhập email', 'error');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      Swal.fire('Thành công', 'Vui lòng kiểm tra email của bạn để lấy lại mật khẩu', 'success');
      setSent(true);
    } catch (error: any) {
      Swal.fire('Thất bại', error.message || 'Không thể gửi yêu cầu', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostingLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#060a09] py-20 px-4">
        <div className="w-full max-w-[500px] bg-[#111827] rounded-[20px] border border-white/[0.03] shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#FBBF24]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FeatherIcon icon="key" size={32} className="text-[#FBBF24]" />
              </div>
              <h2 className="text-3xl font-black text-white">Quên mật khẩu</h2>
              <p className="text-sm font-bold text-gray-400">Nhập email để nhận link đặt lại mật khẩu</p>
           </div>

           {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                    <div className="relative">
                      <FeatherIcon icon="mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email" 
                          placeholder="your@email.com" 
                          className="w-full h-14 pl-12 pr-4 bg-[#0d1412]/5 border border-white/10 rounded-[15px] text-sm font-bold outline-none focus:border-[#FBBF24] transition-all text-white" 
                      />
                    </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#032030] to-[#FBBF24] text-white rounded-[15px] text-sm font-black uppercase tracking-[2px] shadow-xl shadow-[#FBBF24]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                </button>
              </form>
           ) : (
              <div className="text-center space-y-4">
                 <div className="p-4 bg-[#FBBF24]/10 rounded-2xl border border-[#FBBF24]/20 text-[#FBBF24] text-sm font-bold">
                    Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
                 </div>
                 <Link to="/landing-login" className="inline-block text-[#FBBF24] font-black uppercase tracking-widest text-xs hover:underline">
                    Quay lại đăng nhập
                 </Link>
              </div>
           )}

           <div className="text-center">
              <Link to="/landing-login" className="text-sm font-bold text-[#FBBF24] hover:underline flex items-center justify-center gap-2">
                <FeatherIcon icon="arrow-left" size={14} /> Quay lại đăng nhập
              </Link>
           </div>
        </div>
      </div>
    </HostingLayout>
  );
};

export default LandingForgotPasswordPage;
