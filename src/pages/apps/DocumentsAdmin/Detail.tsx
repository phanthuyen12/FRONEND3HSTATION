import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { documentService, adminElearningService } from "../../../config";
import { Document } from "../../../services/documentService";
import { Category } from "../../../services/adminElearningService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const DocumentsAdminDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    categoryId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const isNew = !id || id === 'new' || id === 'undefined';
  
  // Debug: log id value
  useEffect(() => {
    console.log('Document Detail - id from params:', id, 'isNew:', isNew);
  }, [id, isNew]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await adminElearningService.getCategories();
        setCategories(data || []);
      } catch (err: any) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    const loadDocument = async () => {
      setLoading(true);
      try {
        const data = await documentService.getDocument(id!);
        if (data) {
          setDocument(data);
          setFormData({
            title: data.title,
            description: data.description || '',
            fileUrl: data.fileUrl,
            categoryId: data.categoryId || '',
            status: data.status || 'active'
          });
        }
      } catch (err: any) {
        console.error("Failed to load document:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không tải được thông tin tài liệu',
          confirmButtonText: 'Đóng',
        });
        navigate('/admin/documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, isNew, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Double check: if id is 'new' or undefined, it's a new document
      const isCreating = !id || id === 'new' || id === 'undefined';
      
      if (isCreating) {
        console.log('Creating new document with data:', formData);
        const result = await documentService.createDocument({
          title: formData.title,
          description: formData.description,
          fileUrl: formData.fileUrl,
          categoryId: formData.categoryId || null,
          status: formData.status
        });
        
        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Tài liệu đã được tạo thành công',
            confirmButtonText: 'Đóng',
          });
          navigate('/admin/documents');
        } else {
          throw new Error('Không thể tạo tài liệu');
        }
      } else {
        if (!id || id === 'undefined') {
          throw new Error('ID tài liệu không hợp lệ');
        }
        
        console.log('Updating document with id:', id, 'data:', formData);
        const result = await documentService.updateDocument(id, {
          title: formData.title,
          description: formData.description,
          fileUrl: formData.fileUrl,
          categoryId: formData.categoryId || null,
          status: formData.status
        });
        
        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Tài liệu đã được cập nhật thành công',
            confirmButtonText: 'Đóng',
          });
          navigate('/admin/documents');
        } else {
          throw new Error('Không thể cập nhật tài liệu');
        }
      }
    } catch (err: any) {
      console.error("Failed to save document:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không lưu được tài liệu',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title={isNew ? "Tạo tài liệu mới" : "Chi tiết tài liệu"}
          breadCrumbItems={["Konrix", "Apps", "Tài liệu"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin tài liệu...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        name={isNew ? "Tạo tài liệu mới" : document?.title || "Chi tiết tài liệu"}
        title={isNew ? "Tạo tài liệu mới" : "Chi tiết tài liệu"}
        breadCrumbItems={["Konrix", "Apps", "Tài liệu", isNew ? "Tạo mới" : document?.title || ""]}
      />

      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">
            {isNew ? "Tạo tài liệu mới" : "Chỉnh sửa tài liệu"}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="form-label">Tiêu đề <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">URL File <span className="text-rose-500">*</span></label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  required
                  placeholder="https://example.com/document.pdf"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Nhập URL của file tài liệu (PDF, DOC, PPT, XLS, etc.)
                </p>
              </div>

              <div>
                <label className="form-label">Danh mục</label>
                <div className="flex gap-2">
                  <select
                    className="form-select flex-1"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục (tùy chọn) --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn bg-primary text-white"
                    onClick={() => setShowCreateCategory(true)}
                  >
                    <i className="mgc_add_line mr-1" />
                    Tạo mới
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn danh mục để phân loại tài liệu hoặc tạo danh mục mới
                </p>
              </div>

              {/* Modal tạo danh mục mới */}
              {showCreateCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Tạo danh mục mới</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Tên danh mục <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nhập tên danh mục"
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="btn border-slate-200 text-slate-700 flex-1"
                          onClick={() => {
                            setShowCreateCategory(false);
                            setNewCategoryName('');
                          }}
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          className="btn bg-primary text-white flex-1"
                          onClick={async () => {
                            if (!newCategoryName.trim()) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Thiếu thông tin',
                                text: 'Vui lòng nhập tên danh mục',
                                confirmButtonText: 'Đóng',
                              });
                              return;
                            }

                            try {
                              const newCategory = await adminElearningService.createCategory({
                                name: newCategoryName.trim()
                              });
                              
                              if (newCategory) {
                                // Thêm category mới vào danh sách
                                setCategories([...categories, newCategory]);
                                // Tự động chọn category vừa tạo
                                setFormData({ ...formData, categoryId: String(newCategory.id) });
                                setShowCreateCategory(false);
                                setNewCategoryName('');
                                
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Thành công!',
                                  text: 'Đã tạo danh mục mới',
                                  confirmButtonText: 'Đóng',
                                  timer: 2000,
                                });
                              }
                            } catch (err: any) {
                              Swal.fire({
                                icon: 'error',
                                title: 'Lỗi!',
                                text: err.message || 'Không thể tạo danh mục',
                                confirmButtonText: 'Đóng',
                              });
                            }
                          }}
                        >
                          Tạo danh mục
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Đang hiển thị</option>
                  <option value="inactive">Đã ẩn</option>
                </select>
              </div>

              {!isNew && document && (
                <div className="border-t border-slate-100 pt-4">
                  <h5 className="text-sm font-semibold mb-2">Thông tin bổ sung</h5>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Thời gian tạo:</span>
                      <span className="font-medium">
                        {new Date(document.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cập nhật lần cuối:</span>
                      <span className="font-medium">
                        {new Date(document.updatedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="btn border-slate-200 text-slate-700"
                  onClick={() => navigate('/admin/documents')}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn bg-primary text-white"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : isNew ? "Tạo tài liệu" : "Cập nhật"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DocumentsAdminDetail;

