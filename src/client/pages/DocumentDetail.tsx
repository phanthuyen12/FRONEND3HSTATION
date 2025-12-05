import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { documentService } from "../../config";
import { Document } from "../../services/documentService";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const loadDocument = async () => {
      try {
        setLoading(true);
        const data = await documentService.getClientDocument(id);
        if (data) {
          setDocument(data);
        }
      } catch (error) {
        console.error("Không thể tải tài liệu", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  const getFileType = (fileUrl: string | undefined | null): string => {
    if (!fileUrl || typeof fileUrl !== 'string') {
      return 'File';
    }
    const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (['ppt', 'pptx'].includes(ext)) return 'PowerPoint';
    if (['doc', 'docx'].includes(ext)) return 'Word';
    if (['xls', 'xlsx'].includes(ext)) return 'Excel';
    return 'File';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title="Chi tiết tài liệu"
          breadCrumbItems={["Client", "Tài liệu"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin tài liệu...
          </div>
        </div>
      </>
    );
  }

  if (!document) {
    return (
      <>
        <PageBreadcrumb
          name="Không tìm thấy"
          title="Chi tiết tài liệu"
          breadCrumbItems={["Client", "Tài liệu"]}
        />
        <div className="text-center py-10">
          <h4 className="text-lg font-semibold mb-2">Không tìm thấy tài liệu</h4>
          <p className="text-slate-500 mb-4">
            Vui lòng quay lại trang danh sách tài liệu.
          </p>
          <Link to="/documents" className="btn bg-primary text-white">
            Quay lại danh sách
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        name={document.title}
        title="Chi tiết tài liệu"
        breadCrumbItems={["Client", "Tài liệu", document.title]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="card-header">
              <h4 className="card-title mb-0">{document.title}</h4>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h5 className="text-sm font-semibold mb-2 text-slate-700">Mô tả</h5>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {document.description || "Không có mô tả."}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h5 className="text-sm font-semibold mb-3 text-slate-700">Nội dung tài liệu</h5>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    Tài liệu này có thể được xem trực tiếp hoặc tải xuống để sử dụng offline.
                  </p>
                  <p>
                    Định dạng: <span className="font-medium">{getFileType(document.fileUrl)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Xem tài liệu</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-3">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-amber-500 text-white w-full"
                >
                  <i className="mgc_eye_line mr-2" />
                  Xem tài liệu
                </a>
                <a
                  href={document.fileUrl}
                  download
                  className="btn border-slate-200 text-slate-700 w-full bg-white"
                >
                  <i className="mgc_download_line mr-2" />
                  Tải xuống
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Thông tin tài liệu</h4>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Danh mục:</span>
                <span className="font-medium">
                  {document.categoryName || "Chưa phân loại"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Định dạng:</span>
                <span className="font-medium">{getFileType(document.fileUrl)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian tạo:</span>
                <span className="font-medium">{formatDate(document.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cập nhật lần cuối:</span>
                <span className="font-medium">{formatDate(document.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Hành động</h4>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/documents"
                className="btn border-slate-200 text-slate-700 w-full bg-white"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentDetail;

