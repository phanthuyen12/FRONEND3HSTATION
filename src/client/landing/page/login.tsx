import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';
import Swal from 'sweetalert2';

const LandingLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('return');
    return returnUrl ? decodeURIComponent(returnUrl) : "/";
  };

  const redirectUrl = getRedirectUrl();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(redirectUrl);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu', 'error');
      return;
    }

    try {
      setLoading(true);
      await authService.login({
        email: formData.email,
        password: formData.password
      });

      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        text: 'Chào mừng bạn trở lại!',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate(redirectUrl);
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire('Thất bại', error.message || 'Email hoặc mật khẩu không chính xác', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostingLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFB] dark:bg-[#060a09] py-16 px-4">
        
        <div className="w-full max-w-[420px] bg-white dark:bg-[#0d1412] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm p-6 md:p-10 space-y-6 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#00BA4A]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FeatherIcon icon="shield" size={24} className="text-[#00BA4A]" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Đăng nhập</h2>
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Vui lòng nhập thông tin đăng nhập</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                 {/* Email / Username */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email / Tài khoản</label>
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
                    />
                 </div>

                 {/* Password */}
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                       <Link to="/landing-forgot-password" flex-shrink-0 className="text-[11px] font-bold text-gray-400 hover:text-[#00BA4A] transition-colors">Quên?</Link>
                    </div>
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        type="checkbox" 
                        className="w-4.5 h-4.5 rounded border-gray-300 text-[#00BA4A] focus:ring-[#00BA4A] cursor-pointer" 
                    />
                    <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors cursor-pointer">Ghi nhớ tôi</span>
                 </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-gradient-to-r from-[#032030] to-[#00BA4A] hover:shadow-lg hover:shadow-[#00BA4A]/20 text-white rounded-lg text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
              >
                 {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP NGAY'}
              </button>
           </form>

           {/* Footer Link */}
           <div className="text-center pt-2">
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                Bạn chưa có tài khoản? <Link to="/landing-register" className="text-[#00BA4A] font-bold hover:underline">Đăng Ký Ngay</Link>
              </p>
           </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
           3HSTATION © 2026 – Bảo mật thông tin 100%
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingLoginPage;
