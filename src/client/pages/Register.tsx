import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Resolver } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

// components
import { FormInput, VerticalForm, AuthLayout, PageBreadcrumb } from '../../components'

// services
import { authService } from '../../config';

// SweetAlert2
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface UserData {
  name: string;
  email: string;
  password: string;
  ref?: string;
}

/* bottom links */
const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      Bạn đã có tài khoản?
      <Link to="/login" className="text-primary ms-1">
        <b>Đăng nhập</b>
      </Link>
    </p>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [defaultRef, setDefaultRef] = useState<string>('');

  useEffect(() => {
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      navigate("/");
    }

    // Đọc ref từ URL query parameter
    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      setDefaultRef(refFromUrl);
    }
  }, [navigate, searchParams]);

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      name: yup.string().required("Vui lòng nhập họ và tên"),
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập địa chỉ email hợp lệ"),
      password: yup.string().required("Vui lòng nhập mật khẩu"),
      ref: yup.string().optional(),
    })
  );

  /*
 * handle form submission
 */
  const onSubmit = async (formData: UserData) => {
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ref: formData.ref || undefined,
      });

      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Tài khoản của bạn đã được tạo. Chào mừng bạn!',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true,
      });

      // Chuyển sang trang chủ sau khi hiển thị thông báo
      navigate("/");
    } catch (error: any) {
      console.error("Register failed", error);

      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: error?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });

      throw error; // Let VerticalForm handle the error display
    }
  };

  return (
    <>
      <PageBreadcrumb title="Đăng ký" />
      <AuthLayout
        authTitle="Đăng ký"
        helpText="Tạo tài khoản mới để bắt đầu sử dụng các dịch vụ của 3HSTATION."
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver as Resolver<UserData>}
        >

          <FormInput
            label="Họ và tên"
            type="text"
            name="name"
            placeholder="Nhập họ và tên"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Địa chỉ email"
            type="email"
            name="email"
            placeholder="Nhập địa chỉ email"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Mật khẩu"
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Mã giới thiệu (nếu có)"
            type="text"
            name="ref"
            placeholder="Nhập mã giới thiệu hoặc email người giới thiệu"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            defaultValue={defaultRef}
          />
          {defaultRef && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <i className="mgc_info_line mr-1"></i>
                Bạn đang đăng ký với mã giới thiệu: <strong>{defaultRef}</strong>
              </p>
            </div>
          )}

          <div className="mb-4">
            <FormInput 
              label="Tôi đồng ý"
              type="checkbox"
              name="checkbox"
              containerClass="flex items-center"
              labelClassName="ms-2 text-slate-900 dark:text-slate-200"
              className="form-checkbox rounded"
              otherComp={
                <a href="" target="_blank" className="text-gray-400 underline">
                  Điều khoản và điều kiện
                </a>
              }
            />
          </div>

          <div className="flex justify-center mb-6">
            <button type="submit" className="btn w-full text-white bg-primary">
              Đăng ký
            </button>
          </div>

        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default Register
