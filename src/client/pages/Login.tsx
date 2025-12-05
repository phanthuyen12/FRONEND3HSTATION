import { useEffect } from "react";
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
    <p className="text-gray-500 dark:text-gray-400 text-center">Don't have an account ?
      <Link to="/register" className="text-primary ms-1">
        <b>
          Register
        </b>
      </Link>
    </p>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // redirection back to where user got redirected from
  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('return');
    return returnUrl ? decodeURIComponent(returnUrl) : "/";
  };
  
  const redirectUrl = getRedirectUrl();

  // Check if user is already logged in
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  /*
  form validation schema
  */
  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required("Please enter Email").email("Please enter valid Email"),
      password: yup.string().required("Please enter Password"),
    })
  );

  /*
  handle form submission
  */
  const onSubmit = async (formData: UserData) => {
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Kiểm tra xem token đã được lưu chưa
      const token = authService.getToken();
      const user = authService.getUser();
      
      console.log("Login response:", response);
      console.log("Token saved:", token ? "Yes" : "No");
      console.log("User saved:", user);
      
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
      
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: error?.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
      
      throw error; // Let VerticalForm handle the error display
    }
  };

  return (
    <>
      {isAuthenticated && <Navigate to={redirectUrl} />}
      <PageBreadcrumb title="Login" />
      <AuthLayout
        authTitle="Sign In"
        helpText="Enter your email address and password to access client panel."
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
        >
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <div className="flex items-center justify-between mb-4">
            <FormInput
              label="Remember me"
              type="checkbox"
              name="checkbox"
              containerClass="flex items-center"
              labelClassName="ms-2"
              className="form-checkbox rounded"
            />
            <Link to="/recover-password" className="text-sm text-primary border-b border-dashed border-primary">Forget Password ?</Link>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className="btn w-full text-white bg-primary"
              type="submit"
            >
              Log In
            </button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default Login
