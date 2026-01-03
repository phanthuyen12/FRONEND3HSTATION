import { useEffect, useState } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";

// form validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import { VerticalForm, FormInput, AuthLayout, PageBreadcrumb } from "../../components";

// services
import { authService } from "../../config";

// SweetAlert2
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

interface UserData {
  email: string;
  password: string;
}

/* bottom links */
const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">Bạn Chưa có tài khoản ?
      <Link to="/register" className="text-primary ms-1">
        <b>
          Đăng ký
        </b>
      </Link>
    </p>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // redirection back to where user got redirected from
  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('return');
    return returnUrl ? decodeURIComponent(returnUrl) : "/";
  };

  const redirectUrl = getRedirectUrl();

  // Check if user is already logged in
  const isAuthenticated = authService.isAuthenticated();

  // useEffect(() => {
  //   // Chỉ clear session khi vào trang login lần đầu
  //   // KHÔNG navigate ở đây để tránh vòng lặp reload
  //   const currentAuth = authService.isAuthenticated();

  //   if (!currentAuth) {
  //     // Chỉ clear session nếu chưa đăng nhập
  //     authService.clearSession();
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('authUser');
  //     sessionStorage.removeItem('authToken');
  //     sessionStorage.removeItem('authUser');
  //     console.log('[LOGIN] Đã xóa session data cũ');
  //   }
  //   // Nếu đã authenticated, component <Navigate> ở dưới sẽ tự động redirect
  // }, []);

  /*
  form validation schema
  */
  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập địa chỉ email hợp lệ"),
      password: yup.string().required("Vui lòng nhập mật khẩu"),
    })
  );

  /*
  handle form submission
  */
  const onSubmit = async (formData: UserData) => {
    console.log("Form data submitted:", formData);
    try {
    const response = await authService.login({
      email: formData.email,
      password: formData.password,
    });
    console.log("Đăng nhập thành công:", response);

    // Navigate ngay sau khi login thành công
    // setHasSubmitted(true);
    // setTimeout(() => {
    //   navigate(redirectUrl);
    // }, 100);

    //   // Kiểm tra xem token đã được lưu chưa
      const token = authService.getToken();
      const user = authService.getUser();

    //   console.log("Login response:", response);
      console.log("Token saved:", token ? "Yes" : "No");
    //   console.log("User saved:", user);

      if (!token) {
        throw new Error("Token không được lưu vào localStorage");
      }

      // Hiển thị thông báo thành công và chuyển trang sau khi đóng
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        text: 'Chào mừng bạn trở lại!',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
      }).then(() => {
        // Đảm bảo token đã được lưu trước khi chuyển trang
        if (authService.isAuthenticated()) {
          navigate(redirectUrl);
        } else {
          console.error("Token không tồn tại, không thể chuyển trang");
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể xác thực. Vui lòng thử lại.',
            confirmButtonText: 'Đã hiểu',
            confirmButtonColor: '#ef4444',
          });
        }
      });
    } catch (error: any) {
      console.error("Login failed", error);

      // Xác định thông báo lỗi chi tiết
      let errorMessage = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
      let errorTitle = 'Đăng nhập thất bại';

      if (error?.message) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid credentials') || message.includes('không đúng')) {
          errorMessage = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.';
        } else if (message.includes('not found') || message.includes('không tìm thấy')) {
          errorMessage = 'Tài khoản không tồn tại. Vui lòng kiểm tra lại email.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.';
        } else {
          errorMessage = error.message;
        }
      }

      // Hiển thị modal lỗi với thông tin chi tiết
      await Swal.fire({
        icon: 'error',
        title: errorTitle,
        html: `
          <div class="text-left">
            <p class="mb-2">${errorMessage}</p>
            <p class="text-xs text-slate-500 mt-3">
              <i class="mgc_info_line mr-1"></i>
              Vui lòng kiểm tra lại thông tin đăng nhập hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
          </div>
        `,
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
        width: '500px',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-lg font-semibold',
          htmlContainer: 'text-sm',
        },
        allowOutsideClick: false,
        allowEscapeKey: true,
      });

    throw error; // Let VerticalForm handle the error display
    }
  };

  return (
    <>
      <PageBreadcrumb title="Đăng nhập" />
      <AuthLayout
        authTitle="Đăng nhập"
        helpText="Nhập email và mật khẩu của bạn để truy cập vào bảng điều khiển khách hàng."
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
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

          <div className="flex items-center justify-between mb-4">
            <FormInput
              label="Ghi nhớ đăng nhập"
              type="checkbox"
              name="checkbox"
              containerClass="flex items-center"
              labelClassName="ms-2"
              className="form-checkbox rounded"
            />
            <Link
              to="/recover-password"
              className="text-sm text-primary border-b border-dashed border-primary"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className="btn w-full text-white bg-primary"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default Login
