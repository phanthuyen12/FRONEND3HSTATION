import { useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";

// form validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser, resetAuth } from "../../redux/actions";

// components
import { VerticalForm, FormInput, AuthLayout, PageBreadcrumb } from "../../components";

interface UserData {
  username: string;
  password: string;
}

/* bottom links */
const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      <Link to="/auth/register" className="text-primary ms-1">
        <b>
          Đăng ký 
        </b>
      </Link>
    </p>
  );
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, userLoggedIn, loading } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      loading: state.Auth.loading,
      error: state.Auth.error,
      userLoggedIn: state.Auth.userLoggedIn,
    })
  );

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  /*
  form validation schema
  */
  const schemaResolver = yupResolver(
    yup.object().shape({
      username: yup.string().required("Vui lòng nhập tên đăng nhập hoặc email"),
      password: yup.string().required("Vui lòng nhập mật khẩu"),
    })
  );

  /*
  handle form submissionnewTask
  */
  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData["username"], formData["password"]));
  };

  const location = useLocation();

  // redirection back to where user got redirected from
  const redirectUrl = location?.search?.slice(6) || "/";

  return (
    <>
      {(userLoggedIn || user) && <Navigate to={redirectUrl} />}
      <PageBreadcrumb title="Đăng nhập" />
      <AuthLayout
        authTitle="Đăng nhập"
        helpText="Nhập email và mật khẩu để truy cập hệ thống quản trị."
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ username: "konrix@coderthemes.com", password: "konrix" }}
        >
          <FormInput
            label="Địa chỉ email"
            type="text"
            name="username"
            placeholder="Nhập email của bạn"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Mật khẩu"
            type="password"
            name="password"
            placeholder="Nhập mật khẩu của bạn"
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
            <Link to="/auth/recover-password" className="text-sm text-primary border-b border-dashed border-primary">
              Quên mật khẩu?
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className="btn w-full text-white bg-primary"
              type="submit"
              disabled={loading}
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