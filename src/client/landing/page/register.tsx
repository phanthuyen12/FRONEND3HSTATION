import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';
import Swal from 'sweetalert2';

const LandingRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ref: searchParams.get('ref') || '',
    agree: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
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
    
    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu nhập lại không khớp', 'error');
      return;
    }

    if (!formData.agree) {
      Swal.fire('Lỗi', 'Vui lòng đồng ý với điều khoản dịch vụ', 'error');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ref: formData.ref || undefined
      });

      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Chào mừng bạn đến với 3HSTATION!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/");
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire('Thất bại', error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostingLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#060b0a] py-8 px-4">
        
        <div className="w-full max-w-[420px] bg-[#0d1412] rounded-xl border border-white/[0.03] shadow-sm p-6 md:p-8 space-y-5 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#FCD34D]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FeatherIcon icon="user-plus" size={24} className="text-[#FCD34D]" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Đăng ký tài khoản</h2>
              <p className="text-[13px] font-medium text-gray-400">Vui lòng nhập thông tin để đăng ký</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                 {/* Họ và tên */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Họ và tên</label>
                    <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Ví dụ: Nguyễn Văn A" 
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D]/20 transition-all text-white" 
                    />
                 </div>

                 {/* Email */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Địa chỉ Email</label>
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="mail@example.com" 
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D]/20 transition-all text-white" 
                    />
                 </div>

                 {/* Mật khẩu */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                    <div className="relative">
                      <input 
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 pr-10 text-sm font-semibold outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D]/20 transition-all text-white" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FCD34D] transition-colors focus:outline-none"
                      >
                        <FeatherIcon icon={showPassword ? "eye" : "eye-off"} size={16} />
                      </button>
                    </div>
                 </div>

                 {/* Nhập lại mật khẩu */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nhập lại mật khẩu</label>
                    <div className="relative">
                      <input 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 pr-10 text-sm font-semibold outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D]/20 transition-all text-white" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FCD34D] transition-colors focus:outline-none"
                      >
                        <FeatherIcon icon={showConfirmPassword ? "eye" : "eye-off"} size={16} />
                      </button>
                    </div>
                 </div>

                 {/* Mã giới thiệu */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mã giới thiệu (nếu có)</label>
                    <input 
                        name="ref"
                        value={formData.ref}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Nhập mã giới thiệu" 
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D]/20 transition-all text-white" 
                    />
                 </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 pt-2 cursor-pointer group">
                 <input 
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    type="checkbox" 
                    id="terms" 
                    className="w-5 h-5 mt-0.5 rounded border-white/20 text-[#FCD34D] focus:ring-[#FCD34D] transition-all cursor-pointer" 
                 />
                 <label htmlFor="terms" className="text-[12px] font-medium text-gray-400 cursor-pointer select-none leading-relaxed">
                    Tôi đồng ý với <Link to="#" className="text-[#FCD34D] font-bold hover:underline">Điều khoản</Link> & <Link to="#" className="text-[#FCD34D] font-bold hover:underline">Chính sách</Link> hệ thống
                 </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-gradient-to-r from-[#032030] to-[#FCD34D] hover:shadow-lg hover:shadow-[#FCD34D]/20 text-white rounded-lg text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
              >
                 {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
              </button>
           </form>

           {/* Footer Link */}
           <div className="text-center pt-2">
              <p className="text-[13px] font-medium text-gray-400">
                Bạn đã có tài khoản? <Link to="/landing-login" className="text-[#FCD34D] font-bold hover:underline">Đăng Nhập</Link>
              </p>
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
