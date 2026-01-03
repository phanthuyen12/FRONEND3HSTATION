import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { workflowsService } from "../../config";
import { Workflow, WorkflowCategory } from "../../services/workflowsService";

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [categories, setCategories] = useState<WorkflowCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsData, workflowsData] = await Promise.all([
          workflowsService.fetchCategories(),
          workflowsService.fetchClientWorkflows({
            category: activeCategory !== "Tất cả" ? activeCategory : undefined,
            search: search.trim() || undefined,
          }),
        ]);
        setCategories(catsData);
        setWorkflows(workflowsData.data || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory, search]);

  const categoryNames = useMemo(
    () => ["Tất cả", ...categories.map((cat) => cat.name)],
    [categories]
  );

  const displayedWorkflows = useMemo(
    () => {
      if (activeCategory === "Tất cả") return workflows;
      const category = categories.find((cat) => cat.name === activeCategory);
      if (!category) return workflows;
      return workflows.filter((w) => String(w.category_id || w.categoryId) === String(category.id));
    },
    [activeCategory, workflows, categories]
  );

  return (
    <>
      <PageBreadcrumb
        name="Workflows"
        title="Workflows"
        breadCrumbItems={["Client", "Workflows"]}
      />

      {/* Header mô tả Workflows */}
      <div className="card mb-5">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Tự động hoá quy trình với Workflows
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
              Các kịch bản đã được thiết kế sẵn giúp bạn tiết kiệm thời gian,
              tăng tỉ lệ chuyển đổi và tối ưu vận hành cho funnel, email, SMS,
              chăm sóc khách hàng…
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                <i className="mgc_search_3_line" />
              </span>
              <input
                className="form-input pl-9 pr-3 py-2 text-xs w-64"
                placeholder="Tìm kiếm workflow..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activeCategory === cat
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                    : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="card h-full animate-pulse bg-slate-50/60"
            >
              <div className="h-40 bg-slate-200 rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {displayedWorkflows.map((wf) => {
            // Parse tags nếu là string
            let tags: string[] = [];
            if (wf.tags) {
              if (typeof wf.tags === 'string') {
                try {
                  tags = JSON.parse(wf.tags);
                } catch {
                  tags = [wf.tags];
                }
              } else if (Array.isArray(wf.tags)) {
                tags = wf.tags;
              }
            }

            return (
              <div key={wf.id} className="card flex flex-col hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={wf.image || "/images/placeholder.jpg"}
                    alt={wf.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/70 text-white text-[11px] px-2 py-1 rounded-full">
                    {categories.find((c) => String(c.id) === String(wf.category_id || wf.categoryId))?.name || wf.category || "Workflow"}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h4 className="text-sm font-semibold line-clamp-2">{wf.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3">
                    {wf.description || ""}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-semibold text-sm">
                      {!wf.price || wf.price === "0" || wf.price === "Miễn phí" || parseFloat(wf.price) === 0
                        ? "Miễn phí"
                        : (typeof wf.price === 'string' && !isNaN(parseFloat(wf.price))
                          ? `${parseFloat(wf.price).toLocaleString('vi-VN')} VNĐ`
                          : wf.price || "Liên hệ")}
                    </span>
                    <Link
                      to={`/workflows/${wf.id}`}
                      className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {displayedWorkflows.length === 0 && !loading && (
            <div className="col-span-full card">
              <div className="p-6 text-center text-slate-500">
                Không tìm thấy workflow nào phù hợp.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Workflows;
