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
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFB] dark:bg-[#060a09] py-20 px-4">
        <div className="w-full max-w-[500px] bg-white dark:bg-[#111827] rounded-[20px] border border-gray-100 dark:border-white/5 shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#00BA4A]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FeatherIcon icon="key" size={32} className="text-[#00BA4A]" />
              </div>
              <h2 className="text-3xl font-black text-[#032030] dark:text-white">Quên mật khẩu</h2>
              <p className="text-sm font-bold text-gray-400">Nhập email để nhận link đặt lại mật khẩu</p>
           </div>

           {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                    <div className="relative">
                      <FeatherIcon icon="mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email" 
                          placeholder="your@email.com" 
                          className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[15px] text-sm font-bold outline-none focus:border-[#00BA4A] transition-all text-gray-900 dark:text-white" 
                      />
                    </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#032030] to-[#00BA4A] text-white rounded-[15px] text-sm font-black uppercase tracking-[2px] shadow-xl shadow-[#00BA4A]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                </button>
              </form>
           ) : (
              <div className="text-center space-y-4">
                 <div className="p-4 bg-[#00BA4A]/10 rounded-2xl border border-[#00BA4A]/20 text-[#00BA4A] text-sm font-bold">
                    Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
                 </div>
                 <Link to="/landing-login" className="inline-block text-[#00BA4A] font-black uppercase tracking-widest text-xs hover:underline">
                    Quay lại đăng nhập
                 </Link>
              </div>
           )}

           <div className="text-center">
              <Link to="/landing-login" className="text-sm font-bold text-[#00BA4A] hover:underline flex items-center justify-center gap-2">
                <FeatherIcon icon="arrow-left" size={14} /> Quay lại đăng nhập
              </Link>
           </div>
        </div>
      </div>
    </HostingLayout>
  );
};

export default LandingForgotPasswordPage;
