import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { elearningService, workflowsService, vpsService } from "../../config";
import { Course } from "../../services/elearningService";
import { Workflow } from "../../services/workflowsService";

// Using Workflow from service

interface VpsPlan {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  cpu: string | number;
  ram: string | number;
  ssd?: string | number;
  storage?: string | number;
  bandwidth?: string | number;
  unit?: string;
  popular?: boolean;
}

const Landing: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [vpsPlans, setVpsPlans] = useState<VpsPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load courses
      try {
        const coursesData = await elearningService.getCourses();
        setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to load courses", error);
        setCourses([]);
      }

      // Load workflows - use fetchAdminWorkflows for public access
      try {
        const workflowsResponse = await workflowsService.fetchAdminWorkflows({ limit: 6 });
        const workflowsList = workflowsResponse.data || [];
        setWorkflows(workflowsList);
      } catch (error) {
        console.error("Failed to load workflows", error);
        setWorkflows([]);
      }

      // Load VPS plans
      try {
        const vpsData = await vpsService.fetchClientPlans();
        setVpsPlans(Array.isArray(vpsData) ? vpsData : []);
      } catch (error) {
        console.error("Failed to load VPS plans", error);
        setVpsPlans([]);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  return (
    <div className="space-y-16 md:space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-12 md:px-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-amber-600">
                  3H<span className="text-slate-900">Station</span>
                </h1>
              </div>
            </div>
            
            <p className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-medium mb-6">
              <span className="mr-2">🚀</span> Giải pháp toàn diện cho doanh nghiệp
            </p>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tự động hóa & Phát triển
              <br />
              <span className="text-white/90">Doanh nghiệp của bạn</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              3HStation cung cấp giải pháp toàn diện với Workflow tự động hóa, 
              Khóa học chuyên sâu và VPS hiệu năng cao cho doanh nghiệp của bạn.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/workflows"
                className="btn bg-white text-amber-600 hover:bg-white/90 text-base px-8 py-3 rounded-xl shadow-lg font-semibold"
              >
                Khám phá Workflows
              </Link>
              <Link
                to="/courses"
                className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white text-base px-8 py-3 rounded-xl font-semibold"
              >
                Xem Khóa học
              </Link>
              <Link
                to="/vps"
                className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white text-base px-8 py-3 rounded-xl font-semibold"
              >
                Xem VPS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu về 3HStation */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Về 3HStation
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            3HStation là nền tảng cung cấp giải pháp toàn diện cho doanh nghiệp, 
            giúp bạn tự động hóa quy trình, nâng cao kỹ năng nhân viên và tối ưu hóa 
            hạ tầng công nghệ thông tin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="mgc_workflow_line text-3xl text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Workflow Tự động hóa</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Tự động hóa các quy trình nghiệp vụ, giảm thiểu thao tác thủ công, 
              tăng hiệu quả và năng suất làm việc.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="mgc_book_2_line text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Khóa học Chuyên sâu</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Nâng cao kỹ năng nhân viên với các khóa học thực tế, 
              được thiết kế bởi các chuyên gia hàng đầu.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="mgc_server_line text-3xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">VPS Hiệu năng cao</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Hạ tầng VPS mạnh mẽ, ổn định với nhiều gói dịch vụ phù hợp 
              với nhu cầu doanh nghiệp từ nhỏ đến lớn.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Workflow Tự động hóa */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Workflow Tự động hóa
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Tối ưu hóa quy trình làm việc với các workflow được thiết kế sẵn
            </p>
          </div>
          <Link
            to="/workflows"
            className="btn bg-amber-500 hover:bg-amber-600 text-white"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Đang tải...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Chưa có workflow nào
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="card hover:shadow-lg transition-shadow"
              >
                {workflow.image && (
                  <img
                    src={workflow.image}
                    alt={workflow.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-6">
                  {(workflow.category || workflow.categoryId) && (
                    <span className="text-xs font-medium text-amber-600 uppercase mb-2 block">
                      {workflow.category || workflow.categoryId}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {workflow.name}
                  </h3>
                  {workflow.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {workflow.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">
                      {workflow.price || 'Liên hệ'}
                    </span>
                    <Link
                      to={`/workflows/${workflow.id}`}
                      className="btn btn-sm bg-amber-500 text-white"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section: Khóa học */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Khóa học Chuyên sâu
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Nâng cao kỹ năng với các khóa học được thiết kế bởi chuyên gia
            </p>
          </div>
          <Link
            to="/courses"
            className="btn bg-amber-500 hover:bg-amber-600 text-white"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Đang tải...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Chưa có khóa học nào
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="card hover:shadow-lg transition-shadow"
              >
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-6">
                  {course.is_free && (
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded mb-2">
                      Miễn phí
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {course.title}
                  </h3>
                  {course.short_description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {course.short_description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">
                      {course.is_free ? 'Miễn phí' : formatPrice(course.price)}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn btn-sm bg-amber-500 text-white"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section: VPS Plans */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Gói VPS Hiệu năng cao
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Chọn gói VPS phù hợp với nhu cầu doanh nghiệp của bạn
            </p>
          </div>
          <Link
            to="/vps"
            className="btn bg-amber-500 hover:bg-amber-600 text-white"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Đang tải...</div>
        ) : vpsPlans.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Chưa có gói VPS nào
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {vpsPlans.map((plan) => (
              <div
                key={plan.id}
                className="card hover:shadow-lg transition-shadow relative"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      {plan.description}
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">CPU:</span>
                      <span className="font-semibold">{plan.cpu} {typeof plan.cpu === 'string' ? '' : 'cores'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">RAM:</span>
                      <span className="font-semibold">{plan.ram} {typeof plan.ram === 'string' ? '' : 'GB'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Storage:</span>
                      <span className="font-semibold">{plan.storage || plan.ssd || '-'} {typeof plan.storage === 'string' || typeof plan.ssd === 'string' ? '' : 'GB'}</span>
                    </div>
                    {plan.bandwidth && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Bandwidth:</span>
                        <span className="font-semibold">{plan.bandwidth} {typeof plan.bandwidth === 'string' ? '' : 'GB'}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {typeof plan.price === 'string' ? plan.price : formatPrice(plan.price)}
                      </span>
                      <span className="text-sm text-slate-500">/{plan.unit || 'tháng'}</span>
                    </div>
                    <Link
                      to={`/vps`}
                      className="btn w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Đăng ký ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng sử dụng 3HStation
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-amber-600 hover:bg-white/90 text-base px-8 py-3 rounded-xl shadow-lg font-semibold"
            >
              Đăng ký ngay
            </Link>
            <Link
              to="/login"
              className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white text-base px-8 py-3 rounded-xl font-semibold"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
