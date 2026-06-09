import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { elearningService } from "../../../config";
import adminRankService, {
  Rank,
  RankCourseAssignment,
} from "../../../services/adminRankService";
import { Course } from "../../../services/elearningService";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

type RankFormState = {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
};

const emptyForm: RankFormState = {
  code: "",
  name: "",
  description: "",
  status: "active",
};

const statusLabel: Record<"active" | "inactive", string> = {
  active: "Hoạt động",
  inactive: "Vô hiệu",
};

const statusColor: Record<"active" | "inactive", string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
};

const toCourseIds = (items?: RankCourseAssignment[]) =>
  (items || []).map((item) => Number(item.course_id)).filter(Boolean);

const RanksAdminList: React.FC = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedRank, setSelectedRank] = useState<(Rank & { courses?: RankCourseAssignment[] }) | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [form, setForm] = useState<RankFormState>(emptyForm);
  const [editingRankId, setEditingRankId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [savingRank, setSavingRank] = useState(false);
  const [savingCourses, setSavingCourses] = useState(false);

  const loadRanks = async () => {
    setLoadingRanks(true);
    try {
      const response = await adminRankService.getRanks({
        limit: 100,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setRanks(response.data || []);
    } catch (error) {
      console.error("Không thể tải danh sách rank", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách Rank.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setLoadingRanks(false);
    }
  };

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await elearningService.getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error("Không thể tải danh sách khóa học", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadRankDetail = async (id: number) => {
    try {
      const detail = await adminRankService.getRank(id);
      setSelectedRank(detail);
      setSelectedCourseIds(toCourseIds(detail.courses));
      setCourseSearch("");
    } catch (error) {
      console.error("Không thể tải chi tiết rank", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải chi tiết Rank.",
        confirmButtonText: "Đã hiểu",
      });
    }
  };

  useEffect(() => {
    loadRanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredRanks = useMemo(() => ranks, [ranks]);

  const filteredCourses = useMemo(() => {
    const keyword = courseSearch.trim().toLowerCase();
    if (!keyword) return courses;
    return courses.filter((course) =>
      (course.title || "").toLowerCase().includes(keyword) ||
      String(course.category || "").toLowerCase().includes(keyword) ||
      String(course.categoryId || "").toLowerCase().includes(keyword)
    );
  }, [courseSearch, courses]);

  const totalRanks = filteredRanks.length;
  const activeRanks = filteredRanks.filter((rank) => rank.status === "active").length;
  const inactiveRanks = filteredRanks.filter((rank) => rank.status === "inactive").length;
  const totalCourses = courses.length;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingRankId(null);
  };

  const handleSelectRank = async (rank: Rank) => {
    setForm({
      code: rank.code || "",
      name: rank.name || "",
      description: rank.description || "",
      status: rank.status || "active",
    });
    setEditingRankId(Number(rank.id));
    await loadRankDetail(Number(rank.id));
  };

  const handleStartAssign = async (rank: Rank) => {
    await loadRankDetail(Number(rank.id));
  };

  const handleSaveRank = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập mã Rank và tên Rank.",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    setSavingRank(true);
    try {
      if (editingRankId) {
        await adminRankService.updateRank(editingRankId, {
          code: form.code.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        });
      } else {
        await adminRankService.createRank({
          code: form.code.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        });
      }

      await loadRanks();
      if (selectedRank && editingRankId && Number(selectedRank.id) === editingRankId) {
        await loadRankDetail(editingRankId);
      }

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: editingRankId ? "Đã cập nhật Rank." : "Đã tạo Rank mới.",
        confirmButtonText: "Đã hiểu",
      });

      resetForm();
    } catch (error: any) {
      console.error("Lưu rank thất bại", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error?.message || "Không thể lưu Rank.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setSavingRank(false);
    }
  };

  const handleToggleStatus = async (rank: Rank) => {
    const nextStatus: "active" | "inactive" =
      rank.status === "active" ? "inactive" : "active";

    const result = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: `Bạn có muốn ${nextStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} Rank này không?`,
      showCancelButton: true,
      confirmButtonText: nextStatus === "active" ? "Kích hoạt" : "Vô hiệu hóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: nextStatus === "active" ? "#10b981" : "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      await adminRankService.updateRank(rank.id, { status: nextStatus });
      await loadRanks();
      if (selectedRank && Number(selectedRank.id) === Number(rank.id)) {
        await loadRankDetail(Number(rank.id));
      }
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã cập nhật trạng thái Rank.",
        confirmButtonText: "Đã hiểu",
      });
    } catch (error: any) {
      console.error("Cập nhật trạng thái rank thất bại", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error?.message || "Không thể cập nhật trạng thái Rank.",
        confirmButtonText: "Đã hiểu",
      });
    }
  };

  const handleDeleteRank = async (rank: Rank) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa Rank "${rank.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await adminRankService.deleteRank(rank.id);
      if (selectedRank && Number(selectedRank.id) === Number(rank.id)) {
        setSelectedRank(null);
        setSelectedCourseIds([]);
      }
      await loadRanks();
      await Swal.fire({
        icon: "success",
        title: "Đã xóa",
        text: "Rank đã được xóa thành công.",
        confirmButtonText: "Đóng",
      });
    } catch (error: any) {
      console.error("Xóa rank thất bại", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error?.message || "Không thể xóa Rank.",
        confirmButtonText: "Đã hiểu",
      });
    }
  };

  const handleToggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSaveRankCourses = async () => {
    if (!selectedRank) return;

    setSavingCourses(true);
    try {
      await adminRankService.setRankCourses(selectedRank.id, selectedCourseIds);
      await loadRankDetail(Number(selectedRank.id));
      await loadRanks();
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã lưu danh sách khóa học cho Rank.",
        confirmButtonText: "Đã hiểu",
      });
    } catch (error: any) {
      console.error("Lưu khóa học cho rank thất bại", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error?.message || "Không thể lưu khóa học cho Rank.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setSavingCourses(false);
    }
  };

  const selectedCourseCount = selectedRank?.courses?.length || selectedCourseIds.length;

  return (
    <>
      <PageBreadcrumb
        title="Quản lý Rank"
        name="Quản lý Rank"
        breadCrumbItems={["Konrix", "Apps", "Rank"]}
      />

      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 mb-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Tổng Rank</p>
          <div className="text-2xl font-semibold text-slate-900">{totalRanks}</div>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Đang hoạt động</p>
          <div className="text-2xl font-semibold text-emerald-600">{activeRanks}</div>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Đã vô hiệu</p>
          <div className="text-2xl font-semibold text-slate-600">{inactiveRanks}</div>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Tổng khóa học</p>
          <div className="text-2xl font-semibold text-sky-600">
            {loadingCourses ? "..." : totalCourses}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {editingRankId ? "Cập nhật Rank" : "Tạo Rank mới"}
                </h3>
                <p className="text-sm text-slate-500">
                  Admin có thể tạo, chỉnh sửa và đổi trạng thái Rank tại đây.
                </p>
              </div>
              <button
                type="button"
                className="btn bg-slate-100 text-slate-800"
                onClick={resetForm}
              >
                <i className="mgc_refresh_2_line mr-1" />
                Làm mới
              </button>
            </div>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mã Rank</label>
              <input
                className="form-input w-full"
                placeholder="Ví dụ: GOLD"
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tên Rank</label>
              <input
                className="form-input w-full"
                placeholder="Ví dụ: Gold Member"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                className="form-input w-full min-h-28"
                placeholder="Mô tả quyền lợi của Rank"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select
                  className="form-select w-full"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="btn bg-emerald-500 text-white w-full"
                  onClick={handleSaveRank}
                  disabled={savingRank}
                >
                  {savingRank ? "Đang lưu..." : editingRankId ? "Cập nhật Rank" : "Tạo Rank"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-1">Gán khóa học theo Rank</h3>
            <p className="text-sm text-slate-500">
              Chọn một Rank bên dưới để bật/tắt quyền truy cập khóa học.
            </p>
          </div>

          <div className="p-4 md:p-5">
            {!selectedRank ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                Chọn một Rank trong bảng bên dưới để bắt đầu gán khóa học.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">{selectedRank.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${statusColor[selectedRank.status]}`}>
                      {statusLabel[selectedRank.status]}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Mã: <span className="font-medium text-slate-700">{selectedRank.code}</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Số khóa học đã gán:{" "}
                    <span className="font-medium text-slate-700">{selectedCourseCount}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tìm khóa học</label>
                  <input
                    className="form-input w-full"
                    placeholder="Nhập tên khóa học..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200">
                  {loadingCourses ? (
                    <div className="p-4 text-sm text-slate-500">
                      Đang tải danh sách khóa học...
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      Không tìm thấy khóa học phù hợp.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {filteredCourses.map((course) => {
                        const courseId = Number(course.id);
                        const checked = selectedCourseIds.includes(courseId);

                        return (
                          <label
                            key={courseId}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleCourse(courseId)}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-slate-900 truncate">
                                {course.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                ID: {courseId}
                                {course.status ? ` • ${course.status}` : ""}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-slate-100 text-slate-800"
                    onClick={() => setSelectedCourseIds([])}
                  >
                    Bỏ chọn tất cả
                  </button>
                  <button
                    type="button"
                    className="btn bg-emerald-500 text-white"
                    onClick={handleSaveRankCourses}
                    disabled={savingCourses}
                  >
                    {savingCourses ? "Đang lưu..." : "Lưu quyền truy cập"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Danh sách Rank</h3>
              <p className="text-sm text-slate-500">
                Quản lý trạng thái và quyền truy cập của từng Rank.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-64"
                  placeholder="Tìm theo mã, tên, mô tả"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="form-select text-xs"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "" | "active" | "inactive")
                }
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Vô hiệu</option>
              </select>
              <button
                type="button"
                className="btn bg-slate-100 text-slate-800 text-sm"
                onClick={loadRanks}
              >
                <i className="mgc_refresh_2_line mr-1" />
                Tải lại
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Mã Rank
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Tên Rank
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Mô tả
                </th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingRanks && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    Đang tải danh sách Rank...
                  </td>
                </tr>
              )}

              {!loadingRanks && filteredRanks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    Chưa có Rank nào hoặc không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              )}

              {!loadingRanks &&
                filteredRanks.map((rank) => (
                  <tr key={rank.id} className="border-t border-slate-200">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {rank.code}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{rank.name}</td>
                    <td className="px-3 py-3 text-slate-600 max-w-[360px]">
                      <span className="line-clamp-2">
                        {rank.description || "Không có mô tả"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${statusColor[rank.status]}`}
                      >
                        {statusLabel[rank.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          className="btn text-xs bg-sky-50 text-sky-700 border border-sky-200"
                          onClick={() => handleSelectRank(rank)}
                        >
                          <i className="mgc_edit_line mr-1" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="btn text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"
                          onClick={() => handleStartAssign(rank)}
                        >
                          <i className="mgc_link_2_line mr-1" />
                          Gán khóa học
                        </button>
                        <button
                          type="button"
                          className={`btn text-xs border ${
                            rank.status === "active"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                          onClick={() => handleToggleStatus(rank)}
                        >
                          {rank.status === "active" ? "Vô hiệu" : "Kích hoạt"}
                        </button>
                        <button
                          type="button"
                          className="btn text-xs bg-rose-50 text-rose-700 border border-rose-200"
                          onClick={() => handleDeleteRank(rank)}
                        >
                          <i className="mgc_delete_2_line mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RanksAdminList;
