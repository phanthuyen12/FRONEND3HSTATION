import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
}

/* bottom links */
const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">Already have account ?
      <Link to="/login" className="text-primary ms-1">
        <b>Log In</b>
      </Link>
    </p>
  );
};

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      name: yup.string().required(("Please enter Fullname")),
      email: yup
        .string()
        .required("Please enter Email")
        .email("Please enter valid Email"),
      password: yup.string().required(("Please enter Password")),
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
      <PageBreadcrumb title='Register' />
      <AuthLayout
        authTitle='Sign Up'
        helpText="Don't have an account? Create your account, it takes less than a minute"
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
        >

          <FormInput
            label='Full Name'
            type='text'
            name='name'
            placeholder='Enter Full Name'
            containerClass='mb-4'
            className='form-input'
            labelClassName='block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2'
            required
          />

          <FormInput
            label='Email Address'
            type='email'
            name='email'
            placeholder='Enter your Email'
            containerClass='mb-4'
            className='form-input'
            labelClassName='block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2'
            required
          />

          <FormInput
            label='password'
            type='password'
            name='password'
            placeholder='Enter your password'
            containerClass='mb-4'
            className='form-input'
            labelClassName='block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2'
            required
          />

          <div className="mb-4">
            <FormInput
              label='I accept'
              type='checkbox'
              name='checkbox'
              containerClass='flex items-center'
              labelClassName='ms-2 text-slate-900 dark:text-slate-200'
              className='form-checkbox rounded'
              otherComp={<a href="" target='_blank' className="text-gray-400 underline">Terms and Conditions</a>}
            />
          </div>

          <div className="flex justify-center mb-6">
            <button type='submit' className="btn w-full text-white bg-primary"> Register </button>
          </div>

        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default Register
