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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] dark:bg-[#060a09] py-12 px-4">
        
        <div className="w-full max-w-[420px] bg-white dark:bg-[#0d1412] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#00BA4A]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FeatherIcon icon="user-plus" size={24} className="text-[#00BA4A]" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Đăng ký tài khoản</h2>
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Vui lòng nhập thông tin để đăng ký</p>
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
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
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
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
                    />
                 </div>

                 {/* Mật khẩu */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
                    />
                 </div>

                 {/* Nhập lại mật khẩu */}
                 <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nhập lại mật khẩu</label>
                    <input 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
                    />
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
                        className="w-full h-11 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 text-sm font-semibold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all text-gray-900 dark:text-white" 
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
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#00BA4A] focus:ring-[#00BA4A] transition-all cursor-pointer" 
                 />
                 <label htmlFor="terms" className="text-[12px] font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none leading-relaxed">
                    Tôi đồng ý với <Link to="#" className="text-[#00BA4A] font-bold hover:underline">Điều khoản</Link> & <Link to="#" className="text-[#00BA4A] font-bold hover:underline">Chính sách</Link> hệ thống
                 </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-gradient-to-r from-[#032030] to-[#00BA4A] hover:shadow-lg hover:shadow-[#00BA4A]/20 text-white rounded-lg text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
              >
                 {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
              </button>
           </form>

           {/* Footer Link */}
           <div className="text-center pt-2">
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản? <Link to="/landing-login" className="text-[#00BA4A] font-bold hover:underline">Đăng Nhập</Link>
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
