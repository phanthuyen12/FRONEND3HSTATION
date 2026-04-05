import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';
import Swal from 'sweetalert2';

const LandingResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      Swal.fire({
        icon: 'error',
        title: 'Token không hợp lệ',
        text: 'Vui lòng yêu cầu link đặt lại mật khẩu mới.',
        confirmButtonText: 'Đã hiểu',
      }).then(() => {
        navigate('/landing-forgot-password');
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.password || !formData.confirmPassword) {
      Swal.fire('Lỗi', 'Vui lòng nhập mật khẩu mới', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({
        token: token,
        newPassword: formData.password
      });

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Mật khẩu của bạn đã được đặt lại.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/landing-login');
      });
    } catch (error: any) {
      Swal.fire('Thất bại', error.message || 'Token không hợp lệ hoặc đã hết hạn', 'error');
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
                <FeatherIcon icon="lock" size={32} className="text-[#00BA4A]" />
              </div>
              <h2 className="text-3xl font-black text-[#032030] dark:text-white uppercase tracking-tight">Đặt lại mật khẩu</h2>
              <p className="text-sm font-bold text-gray-400">Nhập mật khẩu mới của bạn</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <input 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[15px] px-5 text-sm font-bold outline-none focus:border-[#00BA4A] transition-all text-gray-900 dark:text-white" 
                  />
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                  <input 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[15px] px-5 text-sm font-bold outline-none focus:border-[#00BA4A] transition-all text-gray-900 dark:text-white" 
                  />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-[#032030] to-[#00BA4A] text-white rounded-[15px] text-sm font-black uppercase tracking-[2px] shadow-xl shadow-[#00BA4A]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU'}
              </button>
           </form>

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

export default LandingResetPasswordPage;
