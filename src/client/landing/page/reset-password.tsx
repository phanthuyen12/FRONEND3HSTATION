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
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#060a09] py-20 px-4">
        <div className="w-full max-w-[500px] bg-[#111827] rounded-[20px] border border-white/[0.03] shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
           
           <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#FBBF24]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FeatherIcon icon="lock" size={32} className="text-[#FBBF24]" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Đặt lại mật khẩu</h2>
              <p className="text-sm font-bold text-gray-400">Nhập mật khẩu mới của bạn</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <input 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full h-14 bg-[#0d1412]/5 border border-white/10 rounded-[15px] px-5 text-sm font-bold outline-none focus:border-[#FBBF24] transition-all text-white" 
                  />
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                  <input 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full h-14 bg-[#0d1412]/5 border border-white/10 rounded-[15px] px-5 text-sm font-bold outline-none focus:border-[#FBBF24] transition-all text-white" 
                  />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-[#032030] to-[#FBBF24] text-white rounded-[15px] text-sm font-black uppercase tracking-[2px] shadow-xl shadow-[#FBBF24]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU'}
              </button>
           </form>

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

export default LandingResetPasswordPage;
