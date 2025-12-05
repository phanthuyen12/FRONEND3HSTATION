import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { workflowsService } from "../../config";
import { Workflow } from "../../services/workflowsService";

const WorkflowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const loadWorkflow = async () => {
      try {
        setLoading(true);
        const data:any = await workflowsService.getClientWorkflow(id);
        if (data) {
          setWorkflow(data.data);
        }
      } catch (error) {
        console.error("Không thể tải workflow", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflow();
  }, [id]);

  const handleRegister = async () => {
    if (!id || !workflow) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    
    if (!token) {
      alert('Bạn cần đăng nhập để đăng ký workflow. Vui lòng đăng nhập trước.');
      return;
    }
    
    setRegistering(true);
    try {
      await workflowsService.registerWorkflow(id);
      setShowEnrollModal(false);
      alert('Đăng ký workflow thành công! Vui lòng đợi admin duyệt.');
      // Reload page
      window.location.reload();
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Đăng ký workflow thất bại. Vui lòng thử lại.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title="Chi tiết workflow"
          breadCrumbItems={["Client", "Workflows"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin workflow...
          </div>
        </div>
      </>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-10">
        <h4 className="text-lg font-semibold mb-2">Không tìm thấy workflow</h4>
        <p className="text-slate-500 mb-4">
          Vui lòng quay lại danh sách workflows để chọn lại.
        </p>
        <Link to="/workflows" className="btn bg-primary text-white">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const wf = workflow;

  return (
    <>
      <PageBreadcrumb
        name={wf.name}
        title="Chi tiết workflow"
        breadCrumbItems={["Client", "Workflows", wf.name]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="relative">
              <img
                src={wf.image}
                alt={wf.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <span className="absolute top-4 left-4 bg-slate-900/70 text-white text-xs px-3 py-1 rounded-full">
                {wf.category}
              </span>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-semibold mb-1">{wf.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {wf.description}
              </p>
              {wf.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(Array.isArray(wf.tags) ? wf.tags : typeof wf.tags === 'string' ? JSON.parse(wf.tags) : []).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {wf.content && (
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Mô tả chi tiết</h4>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {wf.content}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Thông tin gói workflow</h4>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Loại:</span>
                <span className="font-medium">{wf.category_name || wf.category || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giá trọn gói:</span>
                <span className="font-semibold text-primary">
                  {parseFloat(wf.price as string) === 0
                    ? "Miễn phí"
                    : `${parseFloat(wf.price as string).toLocaleString('vi-VN')}đ`}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Đăng ký & sử dụng</h4>
            </div>
            <div className="p-6 space-y-3">
              <button 
                className="btn bg-amber-500 text-white w-full"
                onClick={() => setShowEnrollModal(true)}
                disabled={registering}
              >
                {registering ? "Đang xử lý..." : "Đăng ký sử dụng workflow này"}
              </button>
              <p className="text-xs text-slate-500">
                Sau khi đăng ký, workflow sẽ xuất hiện trong khu vực cấu hình
                và bạn có thể tuỳ chỉnh theo nhu cầu thực tế. Vui lòng đợi admin duyệt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {showEnrollModal && workflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận đăng ký workflow</h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Workflow:</span> {workflow.name}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Giá:</span>{" "}
                {parseFloat(workflow.price as string) === 0
                  ? "Miễn phí"
                  : `${parseFloat(workflow.price as string).toLocaleString('vi-VN')}đ`}
              </p>
              {parseFloat(workflow.price as string) > 0 && (
                <p className="text-xs text-amber-600">
                  Số tiền sẽ được trừ từ tài khoản của bạn. Sau khi đăng ký, vui lòng đợi admin duyệt.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                className="btn border-slate-200 text-slate-700 flex-1 bg-white"
                onClick={() => setShowEnrollModal(false)}
                disabled={registering}
              >
                Hủy
              </button>
              <button
                className="btn bg-amber-500 text-white flex-1"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Đang xử lý..." : "Xác nhận đăng ký"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowDetail;















