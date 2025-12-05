import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// components
import { FormInput, VerticalForm, AuthLayout, PageBreadcrumb } from '../../components';

// services
import { authService } from '../../config';

interface UserData {
  password: string;
}

/* bottom links */
const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      Not you ? return
      <Link to="/login" className="text-primary ms-1">
        <b>Log In</b>
      </Link>
    </p>
  );
};

const LockScreen = () => {
  const user = authService.getUser();
  const userImage = user ? undefined : undefined; // You can add user image if available

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      password: yup.string().required("Please enter Password"),
    })
  );

  /*
   * handle form submission
   */
  const onSubmit = async (formData: UserData) => {
    try {
      // Try to login with the password
      const user = authService.getUser();
      if (user) {
        await authService.login({
          email: user.email,
          password: formData.password,
        });
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Unlock failed", error);
      throw error; // Let VerticalForm handle the error display
    }
  };

  return (
    <>
      <PageBreadcrumb title='Lock Screen' />
      <AuthLayout
        authTitle='Lock Screen'
        helpText='Enter your password to access the client.'
        bottomLinks={<BottomLink />}
        userImage={userImage}
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}>
          {user && (
            <div className="mb-4 text-center">
              <h4 className="text-slate-900 dark:text-slate-200/50 font-semibold mb-2">Hi ! {user.name}</h4>
            </div>
          )}

          <FormInput
            label='Password'
            type='password'
            name='password'
            placeholder='Enter your password'
            containerClass='mb-4'
            className='form-input'
            labelClassName='block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2'
          />

          <div className="flex justify-center mb-6">
            <button type='submit' className="btn w-full text-white bg-primary"> Log In </button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default LockScreen

