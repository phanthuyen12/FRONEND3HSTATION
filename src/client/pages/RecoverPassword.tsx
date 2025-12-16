import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

// components
import { FormInput, VerticalForm, AuthLayout, PageBreadcrumb } from '../../components'

// services
import { authService } from '../../config';

// SweetAlert2
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface UserData {
  email: string;
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

const RecoverPassword = () => {
  const [passwordReset, setPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      window.location.href = "/";
    }
  }, []);

  /*
* form validation schema
*/
  const schemaResolver = yupResolver<any>(
    yup.object().shape({
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập địa chỉ email hợp lệ"),
    })
  );
  /*
 * handle form submission
 */
  const onSubmit = async (formData: UserData) => {
    try {
      setLoading(true);
      await authService.forgotPassword(formData.email);
      
      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: 'success',
        title: 'Email đã được gửi',
        text: 'Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
      
      setPasswordReset(true);
    } catch (error: any) {
      console.error("Forgot password failed", error);
      
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: 'error',
        title: 'Gửi email thất bại',
        text: error?.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
      
      throw error; // Let VerticalForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb title="Khôi phục mật khẩu" />

      <AuthLayout
        authTitle="Khôi phục mật khẩu"
        helpText="Nhập địa chỉ email, chúng tôi sẽ gửi hướng dẫn để bạn đặt lại mật khẩu."
        bottomLinks={<BottomLink />}
      >
        {!passwordReset ? (
          <VerticalForm<UserData>
            onSubmit={onSubmit}
            resolver={schemaResolver}
          >

            <FormInput
            label="Địa chỉ email"
            type="email"
            name="email"
            placeholder="Nhập địa chỉ email"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            />

            <div className="flex justify-center mb-6">
              <button type='submit' className="btn w-full text-white bg-primary" disabled={loading}>
                Đặt lại mật khẩu
              </button>
            </div>
          </VerticalForm>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <i className="mgc_check_circle_line text-5xl text-success"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">Vui lòng kiểm tra email</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
            </p>
          </div>
        )}
      </AuthLayout>
    </>
  )
}

export default RecoverPassword

