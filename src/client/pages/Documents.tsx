import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { documentService, elearningService } from "../../config";
import { Document } from "../../services/documentService";
import { Category } from "../../services/elearningService";

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Load categories từ API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await elearningService.getClientCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Không thể tải danh mục", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const result = await documentService.getClientDocuments({
          categoryId: activeCategory !== "all" ? activeCategory : undefined,
          search: search || undefined,
        });
        console.log("Documents loaded:", result);
        setDocuments(result.data || []);
      } catch (error) {
        console.error("Không thể tải tài liệu", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [activeCategory, search]);

  const filteredDocuments = useMemo(() => {
    return documents;
  }, [documents]);

  const getFileType = (fileUrl: string): string => {
    const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['ppt', 'pptx'].includes(ext)) return 'ppt';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx'].includes(ext)) return 'sheet';
    return 'other';
  };

  const typeBadge = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-rose-100 text-rose-600";
      case "ppt":
        return "bg-amber-100 text-amber-600";
      case "doc":
        return "bg-sky-100 text-sky-600";
      case "sheet":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <PageBreadcrumb
        name="Chia sẻ tài liệu"
        title="Chia sẻ tài liệu"
        breadCrumbItems={["Client", "Chia sẻ tài liệu"]}
      />

      {/* Header & filter tạo điểm nhấn */}
      <div className="card mb-5">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Thư viện tài liệu chia sẻ
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Tài liệu PDF, slide, template… được sắp xếp theo từng chủ đề để
              bạn dễ tìm và tải xuống.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              className={`px-3 py-1.5 rounded-full font-medium border transition ${activeCategory === "all"
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              onClick={() => setActiveCategory("all")}
            >
              Tất cả
            </button>
            {loadingCategories ? (
              <span className="text-slate-500">Đang tải danh mục...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-3 py-1.5 rounded-full font-medium border transition ${activeCategory === String(cat.id)
                      ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                      : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  onClick={() => setActiveCategory(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              className="form-input w-full text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải tài liệu...
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card">
          <div className="p-6 text-sm text-slate-500 text-center">
            {activeCategory !== "all"
              ? `Không có tài liệu nào trong danh mục "${categories.find(c => String(c.id) === activeCategory)?.name || ''}".`
              : "Không tìm thấy tài liệu nào."}
          </div>
        </div>
      ) : (
        <>
          {activeCategory !== "all" && (
            <div className="mb-4 text-sm text-slate-600">
              <span className="font-medium">
                Danh mục: {categories.find(c => String(c.id) === activeCategory)?.name || ''}
              </span>
              <span className="ml-2">
                ({filteredDocuments.length} {filteredDocuments.length === 1 ? 'tài liệu' : 'tài liệu'})
              </span>
            </div>
          )}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {filteredDocuments.map((doc) => {
              const fileType = getFileType(doc.fileUrl);
              return (
                <div key={doc.id} className="card hover:shadow-md transition-shadow">
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold mb-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {doc.description || "Không có mô tả"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${typeBadge(
                          fileType
                        )}`}
                      >
                        {fileType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {doc.categoryName || "Chưa phân loại"}
                      </span>
                      <span>
                        Tạo {formatDate(doc.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-1">
                      <button
                        className="btn btn-sm bg-slate-100 text-slate-700"
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        Xem chi tiết
                      </button>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                      >
                        Tải xuống
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Documents;


