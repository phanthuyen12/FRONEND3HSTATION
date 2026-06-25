import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import adminFacebookService from "../../../../services/adminFacebookService";
import Swal from "sweetalert2";

const FacebookCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: `Facebook trả về lỗi: ${searchParams.get("error_description") || error}`,
        confirmButtonText: "Đã hiểu",
      }).then(() => {
        navigate("/admin/facebook/posts");
      });
      return;
    }

    if (code && !isProcessed.current) {
      isProcessed.current = true;
      const redirectUri = `${window.location.origin}/admin/facebook/callback`;
      
      // Gọi service để gửi code xuống backend xử lý
      adminFacebookService.connectPage(code, redirectUri)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã kết nối và đồng bộ các trang Facebook thành công!",
            confirmButtonText: "Quay lại Dashboard",
          }).then(() => {
            navigate("/admin/facebook/posts");
          });
        })
        .catch((err: any) => {
          console.error("Lỗi khi exchange code", err);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Quá trình lấy Token từ Facebook thất bại. Vui lòng thử lại.",
            confirmButtonText: "Đã hiểu",
          }).then(() => {
            navigate("/admin/facebook/posts");
          });
        });
    } else if (!code && !isProcessed.current) {
      // Trường hợp người dùng vô tình truy cập URL này mà không có code
      navigate("/admin/facebook/posts");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <h3 className="text-lg font-semibold text-slate-800">Đang xử lý xác thực từ Facebook...</h3>
      <p className="text-slate-500 mt-2">Vui lòng không đóng trình duyệt trong quá trình này.</p>
    </div>
  );
};

export default FacebookCallback;
