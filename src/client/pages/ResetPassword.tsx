import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

// components
import { FormInput, VerticalForm, AuthLayout, PageBreadcrumb } from '../../components'

// services
import { authService } from '../../config';

// SweetAlert2
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      Quay lại
      <Link to="/login" className="text-primary ms-1">
        <b>Đăng nhập</b>
      </Link>
    </p>
  )
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      window.location.href = "/";
    }

    // Lấy token từ URL query parameter
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      Swal.fire({
        icon: 'error',
        title: 'Token không hợp lệ',
        text: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      }).then(() => {
        navigate('/recover-password');
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver<ResetPasswordData>(
    yup.object().shape({
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
      confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([yup.ref('password')], "Mật khẩu xác nhận không khớp"),
    })
  );

  /*
   * handle form submission
   */
  const onSubmit = async (formData: ResetPasswordData) => {
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Token không hợp lệ. Vui lòng yêu cầu link đặt lại mật khẩu mới.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
      navigate('/recover-password');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({
        token: token,
        newPassword: formData.password,
      });
      
      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: 'success',
        title: 'Đặt lại mật khẩu thành công',
        text: 'Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập với mật khẩu mới.',
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#10b981',
      });
      
      setPasswordReset(true);
      // Chuyển đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Reset password failed", error);
      
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: 'error',
        title: 'Đặt lại mật khẩu thất bại',
        text: error?.message || 'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null; // Đang chuyển hướng
  }

  return (
    <>
      <PageBreadcrumb title="Đặt lại mật khẩu" />

      <AuthLayout
        authTitle="Đặt lại mật khẩu"
        helpText="Nhập mật khẩu mới của bạn. Mật khẩu phải có ít nhất 6 ký tự."
        bottomLinks={<BottomLink />}
      >
        {!passwordReset ? (
          <VerticalForm<ResetPasswordData>
            onSubmit={onSubmit}
            resolver={schemaResolver}
          >
            <FormInput
              label="Mật khẩu mới"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              containerClass="mb-4"
              className="form-input"
              labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
              required
            />

            <FormInput
              label="Xác nhận mật khẩu mới"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              containerClass="mb-4"
              className="form-input"
              labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
              required
            />

            <div className="flex justify-center mb-6">
              <button 
                type='submit' 
                className="btn w-full text-white bg-primary" 
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </div>
          </VerticalForm>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <i className="mgc_check_circle_line text-5xl text-success"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">Đặt lại mật khẩu thành công</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Mật khẩu của bạn đã được đặt lại. Đang chuyển đến trang đăng nhập...
            </p>
          </div>
        )}
      </AuthLayout>
    </>
  )
}

export default ResetPassword




