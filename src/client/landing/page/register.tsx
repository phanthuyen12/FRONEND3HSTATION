import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { authService } from '../../../config';
import Swal from 'sweetalert2';

const LandingRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ref: '',
    agreed: false,
  });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      setFormData((prev) => ({ ...prev, ref: refFromUrl }));
    }
  }, [navigate, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Vui lòng nhập tên hiển thị';
    if (!formData.email.trim()) return 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email không hợp lệ';
    if (!formData.phone.trim()) return 'Vui lòng nhập số điện thoại';

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) return 'Số điện thoại cần từ 10 đến 11 số';

    if (formData.password.length < 6) return 'Mật khẩu cần ít nhất 6 ký tự';
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    if (!formData.agreed) return 'Bạn cần đồng ý điều khoản trước khi đăng ký';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateForm();

    if (errorMessage) {
      Swal.fire('Thiếu thông tin', errorMessage, 'warning');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        ref: formData.ref.trim() || undefined,
      });

      await Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        html: 'Tài khoản của bạn đã được tạo và mặc định ở <b>rank BASIC</b>.',
        confirmButtonText: 'Vào hệ thống',
        confirmButtonColor: '#fbbf24',
      });

      navigate('/landing-profile');
    } catch (error: any) {
      console.error(error);
      Swal.fire('Đăng ký thất bại', error?.message || 'Không thể tạo tài khoản lúc này', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostingLayout>
      <div className="min-h-[78vh] flex flex-col items-center justify-center bg-[#060b0a] py-8 px-4">
        <div className="w-full max-w-[420px] bg-[#0d1412] rounded-xl border border-white/[0.03] shadow-sm p-6 md:p-8 space-y-5 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FeatherIcon icon="user-plus" size={26} className="text-[#FBBF24]" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Đăng ký tài khoản</h2>
            <p className="text-[13px] font-medium text-gray-400">
              Tạo tài khoản mới để bắt đầu học tập trên 3HSTATION.
            </p>
          </div>

          <div className="rounded-xl border border-[#FBBF24]/15 bg-[#FBBF24]/8 px-4 py-3 text-[13px] text-[#fde68a]">
            <div className="flex items-start gap-3">
              <FeatherIcon icon="award" size={16} className="mt-0.5 shrink-0 text-[#FBBF24]" />
              <p>
                Sau khi đăng ký, tài khoản của bạn sẽ mặc định ở <b>rank BASIC</b>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tên hiển thị</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Nhập tên của bạn"
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="email@example.com"
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Số điện thoại</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="0912345678"
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
              />
              <p className="text-xs text-gray-500 ml-1">Nhập 10-11 số</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 pr-11 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FBBF24] transition-colors"
                >
                  <FeatherIcon icon={showPassword ? 'eye' : 'eye-off'} size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 ml-1">Tối thiểu 6 ký tự</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 pr-11 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FBBF24] transition-colors"
                >
                  <FeatherIcon icon={showConfirmPassword ? 'eye' : 'eye-off'} size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mã giới thiệu (tùy chọn)</label>
              <input
                name="ref"
                value={formData.ref}
                onChange={handleChange}
                type="text"
                placeholder="Nhập mã giới thiệu nếu có"
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm font-semibold outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]/20 transition-all text-white"
              />
              <p className="text-xs text-gray-500 ml-1">Có thể bỏ qua nếu bạn không có mã giới thiệu</p>
            </div>

            <label className="flex items-start gap-3 pt-1 cursor-pointer">
              <input
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-white/20 text-[#FBBF24] focus:ring-[#FBBF24]"
              />
              <span className="text-sm leading-6 text-gray-400">
                Tôi đồng ý với{' '}
                <Link to="/landing-policy" className="text-[#FBBF24] font-bold hover:underline">
                  Điều khoản sử dụng và Chính sách quyền riêng tư
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-4 bg-[#FBBF24] hover:bg-[#facc15] hover:shadow-lg hover:shadow-[#FBBF24]/20 text-black rounded-lg text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ NGAY'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[13px] font-medium text-gray-400">
              Bạn đã có tài khoản?{' '}
              <Link to="/landing-login" className="text-[#FBBF24] font-bold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
          3HSTATION © 2026 – Tài khoản mới mặc định BASIC
        </div>
      </div>
    </HostingLayout>
  );
};

export default LandingRegisterPage;
