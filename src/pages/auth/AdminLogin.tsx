import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { VerticalForm, FormInput, AuthLayout, PageBreadcrumb } from "../../components";
import { authService } from "../../config";

type LoginPayload = {
  email: string;
  password: string;
};

const schemaResolver = yupResolver(
  yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
  })
);

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl =
    new URLSearchParams(location.search).get("return") || "/admin/dashboard";

  const onSubmit = async (formData: LoginPayload) => {
    try {
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const role = res?.user?.role;
      if (role !== "admin") {
        // Nếu không phải admin, xoá token và chặn truy cập
        await authService.logout();
        alert("Tài khoản không có quyền admin");
        return;
      }

      navigate(redirectUrl, { replace: true });
    } catch (error: any) {
      alert(error?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <PageBreadcrumb title="Admin Login" name="Admin" breadCrumbItems={["Admin", "Login"]} />
      <AuthLayout
        authTitle="Đăng nhập Admin"
        helpText="Nhập email và mật khẩu để truy cập trang quản trị."
        bottomLinks={
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Quên mật khẩu?{" "}
            <Link to="/auth/recover-password" className="text-primary ms-1">
              Khôi phục
            </Link>
          </p>
        }
      >
        <VerticalForm<LoginPayload>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ email: "", password: "" }}
        >
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="Nhập email"
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

          <div className="flex items-center justify-between mb-6">
            <FormInput
              label="Nhớ đăng nhập"
              type="checkbox"
              name="remember"
              containerClass="flex items-center"
              labelClassName="ms-2"
              className="form-checkbox rounded"
            />
            <Link
              to="/auth/recover-password"
              className="text-sm text-primary border-b border-dashed border-primary"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="flex justify-center">
            <button className="btn w-full text-white bg-primary" type="submit">
              Đăng nhập
            </button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default AdminLogin;



