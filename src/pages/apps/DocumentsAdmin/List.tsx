import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { documentService } from "../../../config";
import { Document } from "../../../services/documentService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const DocumentsAdminList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const data = await documentService.getDocuments({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
        });
        setDocuments(data.data || []);
      } catch (err: any) {
        console.error("Failed to load documents:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không tải được danh sách tài liệu',
          confirmButtonText: 'Đóng',
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [statusFilter, search]);

  const filtered = useMemo(() => {
    return documents;
  }, [documents]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa tài liệu này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Tài liệu đã được xóa thành công',
        confirmButtonText: 'Đóng',
        timer: 2000,
      });
    } catch (err: any) {
      console.error("Failed to delete document:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không xóa được tài liệu',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const handleToggleStatus = async (doc: Document) => {
    const newStatus = doc.status === 'active' ? 'inactive' : 'active';
    try {
      await documentService.updateDocument(doc.id, { status: newStatus });
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: newStatus } : d))
      );
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Tài liệu đã được ${newStatus === 'active' ? 'hiển thị' : 'ẩn'}`,
        confirmButtonText: 'Đóng',
        timer: 2000,
      });
    } catch (err: any) {
      console.error("Failed to update document:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không cập nhật được trạng thái',
        confirmButtonText: 'Đóng',
      });
    }
  };

  const getFileType = (fileUrl: string): string => {
    const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (['ppt', 'pptx'].includes(ext)) return 'PPT';
    if (['doc', 'docx'].includes(ext)) return 'DOC';
    if (['xls', 'xlsx'].includes(ext)) return 'XLS';
    return ext.toUpperCase();
  };

  return (
    <>
      <PageBreadcrumb
        name="Quản lý tài liệu"
        title="Quản lý tài liệu"
        breadCrumbItems={["Konrix", "Apps", "Tài liệu"]}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="card-title mb-0">Danh sách tài liệu</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn bg-primary text-white"
              onClick={() => navigate("/admin/documents/new")}
            >
              <i className="mgc_add_circle_line mr-1" /> Tạo tài liệu mới
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                className="form-input"
                placeholder="Tìm kiếm tài liệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đã ẩn</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-10 text-slate-500">
              Đang tải...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Không tìm thấy tài liệu nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Tiêu đề
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Danh mục
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Loại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Thời gian tạo
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-sm">{doc.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {doc.description || "Không có mô tả"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {doc.categoryName || "Chưa phân loại"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {getFileType(doc.fileUrl)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {doc.status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="btn btn-sm bg-slate-100 text-slate-700"
                            onClick={() => handleToggleStatus(doc)}
                            title={doc.status === 'active' ? 'Ẩn tài liệu' : 'Hiển thị tài liệu'}
                          >
                            <i className={`mgc_${doc.status === 'active' ? 'eye_off' : 'eye'}_line`} />
                          </button>
                          <Link
                            to={`/admin/documents/${doc.id}`}
                            className="btn btn-sm bg-primary text-white"
                          >
                            <i className="mgc_edit_line" />
                          </Link>
                          <button
                            className="btn btn-sm bg-rose-100 text-rose-600"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <i className="mgc_delete_line" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentsAdminList;






