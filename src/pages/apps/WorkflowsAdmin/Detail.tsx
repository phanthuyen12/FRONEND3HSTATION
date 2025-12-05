import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { workflowsService } from "../../../config";
import { Workflow, WorkflowCategory } from "../../../services/workflowsService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

type EditableWorkflow = Omit<Workflow, 'tags'> & {
  tags: string[];
};

const emptyWorkflow = (): EditableWorkflow => ({
  name: "",
  description: "",
  category_id: "",
  image: "",
  price: "",
  tags: [],
  content: "",
  status: "active",
});

const WorkflowDetailAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new" || id === undefined;

  const [workflow, setWorkflow] = useState<EditableWorkflow>(emptyWorkflow);
  const [categories, setCategories] = useState<WorkflowCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await workflowsService.fetchCategories();
        setCategories(cats);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải danh sách danh mục", error);
      }
    };
    loadCategories();
  }, []);

  // Load workflow data if editing (chỉ khi không phải tạo mới)
  useEffect(() => {
    if (!isNew && id && id !== "new") {
      const loadWorkflow = async () => {
        try {
          setLoading(true);
          const datas:any = await workflowsService.getWorkflow(id);
          const data = datas.data;
          // eslint-disable-next-line no-console
          console.log("Workflow data loaded:", datas.data);
          
          // Parse tags nếu là string
          let tags: string[] = [];
          if (data.tags) {
            if (typeof data.tags === 'string') {
              try {
                const parsed = JSON.parse(data.tags);
                tags = Array.isArray(parsed) ? parsed : [data.tags];
              } catch {
                // Nếu không parse được, coi như là string đơn
                tags = [data.tags];
              }
            } else if (Array.isArray(data.tags)) {
              tags = data.tags;
            }
          }

          // Map dữ liệu từ API vào form - đảm bảo tất cả fields được populate
          const workflowData: EditableWorkflow = {
            name: data.name || "",
            description: data.description || "",
            category_id: data.category_id || data.categoryId || "",
            image: data.image || "",
            price: data.price || "",
            tags: tags,
            content: data.content || "",
            status: data.status || "active",
          };
          
          // eslint-disable-next-line no-console
          console.log("Mapped workflow data:", workflowData);
          
          setWorkflow(workflowData);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Không thể tải workflow", error);
          await Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải thông tin workflow. Vui lòng thử lại.',
            confirmButtonText: 'Đã hiểu',
            confirmButtonColor: '#ef4444',
          });
          navigate("/admin/workflows");
        } finally {
          setLoading(false);
        }
      };
      loadWorkflow();
    } else if (isNew) {
      // Khi tạo mới, set loading = false ngay và reset form
      setWorkflow(emptyWorkflow());
      setLoading(false);
    }
  }, [id, isNew, navigate]);

  const handleFieldChange = (
    field: keyof EditableWorkflow,
    value: string | string[]
  ) => {
    setWorkflow((prev) => ({ ...prev, [field]: value } as EditableWorkflow));
  };

  const handleTagChange = (index: number, value: string) => {
    setWorkflow((prev) => {
      const tags = [...prev.tags];
      tags[index] = value;
      return { ...prev, tags };
    });
  };

  const handleAddTag = () => {
    setWorkflow((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const handleRemoveTag = (index: number) => {
    setWorkflow((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!workflow.name.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập tên workflow.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!workflow.category_id) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn danh mục.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!workflow.price || !workflow.price.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập giá bán.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);

      // Filter out empty tags
      const filteredTags = workflow.tags.filter(tag => tag.trim() !== "");

      if (isNew) {
        // Tạo mới - API yêu cầu categoryId và price là required
        const payload = {
          name: workflow.name.trim(),
          description: workflow.description?.trim() || undefined,
          categoryId: workflow.category_id,
          image: workflow.image?.trim() || undefined,
          price: workflow.price.trim(),
          tags: filteredTags.length > 0 ? filteredTags : undefined,
          content: workflow.content?.trim() || undefined,
          status: workflow.status || "active",
        };
        await workflowsService.createWorkflow(payload);
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã tạo workflow thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
        navigate("/admin/workflows");
      } else {
        // Cập nhật - tất cả fields đều optional
        const payload: any = {};
        if (workflow.name.trim()) payload.name = workflow.name.trim();
        if (workflow.description?.trim()) payload.description = workflow.description.trim();
        if (workflow.category_id) payload.categoryId = workflow.category_id;
        if (workflow.image?.trim()) payload.image = workflow.image.trim();
        if (workflow.price.trim()) payload.price = workflow.price.trim();
        if (filteredTags.length > 0) payload.tags = filteredTags;
        if (workflow.content?.trim()) payload.content = workflow.content.trim();
        if (workflow.status) payload.status = workflow.status;

        await workflowsService.updateWorkflow(id!, payload);
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã cập nhật workflow thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      }

    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Lưu workflow thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Có lỗi khi lưu workflow. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          title="Đang tải..."
          name="Workflows"
          breadCrumbItems={["Konrix", "Apps", "Workflows"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin workflow...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        title={isNew ? "Tạo Workflow mới" : "Cập nhật Workflow"}
        name="Workflows"
        breadCrumbItems={[
          "Konrix",
          "Apps",
          "Workflows",
          isNew ? "Tạo mới" : (workflow.name || "Cập nhật"),
        ]}
      />

      <div className="grid xl:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Thông tin chung */}
        <div className="xl:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title mb-0">
              {isNew ? "Thông tin Workflow mới" : "Thông tin Workflow"}
            </h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Tên Workflow <span className="text-rose-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={workflow.name}
                  onChange={(e) =>
                    handleFieldChange("name", e.target.value)
                  }
                  placeholder="Nhập tên workflow"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Danh mục <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-select"
                  value={workflow.category_id || ""}
                  onChange={(e) =>
                    handleFieldChange("category_id", e.target.value)
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Giá bán
                </label>
                <input
                  className="form-input"
                  value={workflow.price || ""}
                  onChange={(e) =>
                    handleFieldChange("price", e.target.value)
                  }
                  placeholder="Ví dụ: 500000 hoặc 500.000"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Trạng thái
                </label>
                <select
                  className="form-select"
                  value={workflow.status || "active"}
                  onChange={(e) =>
                    handleFieldChange("status", e.target.value)
                  }
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Mô tả
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={workflow.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                placeholder="Mô tả ngắn về workflow"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Nội dung chi tiết
              </label>
              <textarea
                className="form-input"
                rows={6}
                value={workflow.content || ""}
                onChange={(e) =>
                  handleFieldChange("content", e.target.value)
                }
                placeholder="Nội dung chi tiết của workflow (HTML hoặc text)"
              />
            </div>
          </div>
        </div>

        {/* Ảnh & tags */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Ảnh & Tags</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Đường dẫn ảnh / URL
              </label>
              <input
                className="form-input text-xs"
                placeholder="Ví dụ: /images/workflow-1.jpg hoặc URL đầy đủ"
                value={workflow.image || ""}
                onChange={(e) =>
                  handleFieldChange("image", e.target.value)
                }
              />
              {workflow.image && (
                <div className="mt-2">
                  <img
                    src={workflow.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="text-[11px] text-slate-500 mt-1">
                Hiện tại dùng link ảnh có sẵn. Khi có module upload, bạn có thể thay phần này bằng component upload.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">
                Tags (từ khoá)
              </label>
              <div className="space-y-2">
                {workflow.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <input
                      className="form-input text-xs flex-1"
                      value={tag}
                      onChange={(e) =>
                        handleTagChange(idx, e.target.value)
                      }
                      placeholder="Nhập tag"
                    />
                    <button
                      type="button"
                      className="btn btn-xs bg-rose-50 text-rose-600 text-[11px]"
                      onClick={() => handleRemoveTag(idx)}
                    >
                      Xoá
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-xs bg-slate-100 text-xs"
                  onClick={handleAddTag}
                >
                  <i className="mgc_add_circle_line mr-1" />
                  Thêm tag
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn bg-primary text-white text-sm w-full disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Đang lưu..."
                : isNew
                ? "Tạo Workflow"
                : "Cập nhật Workflow"}
            </button>

            {!isNew && (
              <button
                type="button"
                className="btn border text-sm w-full"
                onClick={() => navigate("/admin/workflows")}
              >
                Quay lại danh sách
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowDetailAdmin;
