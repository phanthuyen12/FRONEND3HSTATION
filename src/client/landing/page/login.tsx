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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#060b0a] py-8 px-4">
        
        <div className="w-full max-w-[420px] bg-[#0d1412] rounded-xl border border-white/[0.03] shadow-sm p-6 md:p-8 space-y-5 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FeatherIcon icon="shield" size={24} className="text-[#FBBF24]" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Đăng nhập</h2>
              <p className="text-[13px] font-medium text-gray-400">Vui lòng nhập thông tin đăng nhập</p>
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
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white" 
                    />
                 </div>

                 {/* Password */}
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                       <Link to="/landing-forgot-password" flex-shrink-0 className="text-[11px] font-bold text-gray-400 hover:text-[#FBBF24] transition-colors">Quên?</Link>
                    </div>
                    <div className="relative">
                      <input 
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 pr-10 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FBBF24] transition-colors focus:outline-none"
                      >
                        <FeatherIcon icon={showPassword ? "eye" : "eye-off"} size={16} />
                      </button>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        type="checkbox" 
                        className="w-4.5 h-4.5 rounded border-white/20 text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer" 
                    />
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Ghi nhớ tôi</span>
                 </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-gradient-to-r from-[#032030] to-[#FBBF24] hover:shadow-lg hover:shadow-[#FBBF24]/20 text-white rounded-lg text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
              >
                 {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP NGAY'}
              </button>
           </form>

           {/* Footer Link */}
           <div className="text-center pt-2">
              <p className="text-[13px] font-medium text-gray-400">
                Bạn chưa có tài khoản? <Link to="/landing-register" className="text-[#FBBF24] font-bold hover:underline">Đăng Ký Ngay</Link>
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
