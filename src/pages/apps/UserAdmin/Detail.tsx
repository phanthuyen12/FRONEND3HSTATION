import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { userService, API_URL, rankService } from "../../../config";
import { User, UserDetail } from "../../../services/userService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Rank } from "../../../services/adminRankService";

/* ─── Types ─── */
type EditableUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'joinedAt'> & {
  password?: string;
  joinedAt?: string;
};

interface DetailStats {
  totalOrders: number;
  courses: number;
  workflows: number;
  vps: number;
  totalRevenue: number;
  refCount: number;
  refCommission: number;
}

interface PaginationInfo { page: number; limit: number; total: number; totalPages: number; }
const defaultPagination = (): PaginationInfo => ({ page: 1, limit: 10, total: 0, totalPages: 0 });

/* ─── Mini Pagination ─── */
const MiniPagination: React.FC<{
  pagination: PaginationInfo;
  loading?: boolean;
  onPageChange: (page: number) => void;
}> = ({ pagination, loading, onPageChange }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 border-t border-slate-100">
    <span className="text-[11px] text-slate-500">
      {pagination.total === 0 ? 'Không có dữ liệu' : (
        <>Hiển thị <strong>{((pagination.page - 1) * pagination.limit) + 1}</strong> – <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> của <strong>{pagination.total}</strong></>
      )}
    </span>
    <div className="flex gap-1">
      <button className="btn btn-xs border" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(1)}>«</button>
      <button className="btn btn-xs border" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(pagination.page - 1)}>‹</button>
      {Array.from({ length: Math.min(5, pagination.totalPages || 1) }, (_, i) => {
        const t = pagination.totalPages || 1;
        let p: number;
        if (t <= 5) p = i + 1;
        else if (pagination.page <= 3) p = i + 1;
        else if (pagination.page >= t - 2) p = t - 4 + i;
        else p = pagination.page - 2 + i;
        return (
          <button key={p} className={`btn btn-xs ${pagination.page === p ? 'bg-primary text-white' : 'border'}`}
            disabled={loading} onClick={() => onPageChange(p)}>{p}</button>
        );
      })}
      <button className="btn btn-xs border" disabled={pagination.page >= (pagination.totalPages || 1) || loading} onClick={() => onPageChange(pagination.page + 1)}>›</button>
      <button className="btn btn-xs border" disabled={pagination.page >= (pagination.totalPages || 1) || loading} onClick={() => onPageChange(pagination.totalPages || 1)}>»</button>
    </div>
  </div>
);

/* ─── Helpers ─── */
const fmt = (n: number) => n.toLocaleString('vi-VN');
const statusBadge = (s: string) => s === 'completed' || s === 'active'
  ? <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">{s}</span>
  : s === 'pending'
    ? <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">{s}</span>
    : <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">{s}</span>;

const emptyUser = (): EditableUser => ({ name: "", email: "", phone: "", balance: 0, status: "active", role: "user", password: "" });

const buildUserPayload = (user: EditableUser) => {
  const payload: Record<string, any> = {
    name: user.name.trim(),
    email: user.email.trim(),
    status: user.status,
  };

  const phone = user.phone?.trim();
  if (phone) payload.phone = phone;

  if (user.rankId !== "" && user.rankId !== undefined && user.rankId !== null) {
    payload.rankId = user.rankId;
  }

  return payload;
};

/* ═══════════════════════════════════════════════════ */
const UserAdminDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  /* ── Base user state ── */
  const [user, setUser] = useState<EditableUser>(emptyUser());
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [balanceNote, setBalanceNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPwd, setResettingPwd] = useState(false);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [ranksLoading, setRanksLoading] = useState(false);

  /* ── Stats ── */
  const [stats, setStats] = useState<DetailStats | null>(null);

  /* ── Orders: tab-based ── */
  const [activeTab, setActiveTab] = useState<'all' | 'course' | 'workflow' | 'vps' | 'refs'>('all');

  /* ── Orders pagination ── */
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [ordersPagination, setOrdersPagination] = useState<PaginationInfo>(defaultPagination());
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* ── Refs pagination ── */
  const [refsData, setRefsData] = useState<any[]>([]);
  const [refsPagination, setRefsPagination] = useState<PaginationInfo>(defaultPagination());
  const [refsLoading, setRefsLoading] = useState(false);
  const [totalCommission, setTotalCommission] = useState(0);

  /* ──────────────────────────────────────────────── */
  const fetchUser = useCallback(async () => {
    if (isNew || !id) return;
    setLoading(true);
    try {
      const datas: any = await userService.getUser(id);
      const data = datas.data || datas;
      setUserDetail(data);
      const rankId = data.rank?.id ?? data.rankId ?? data.rank_id ?? "";
      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        balance: data.balance || 0,
        status: data.status || "active",
        role: data.role || "user",
        rankId,
        joinedAt: data.joinedAt || data.createdAt || "",
      });
    } catch {
      await Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải thông tin user.', confirmButtonColor: '#ef4444' });
      navigate("/admin/users");
    } finally { setLoading(false); }
  }, [id, isNew, navigate]);

  const fetchRanks = useCallback(async () => {
    setRanksLoading(true);
    try {
      const response = await rankService.getRanks({ limit: 100 });
      setRanks(response.data || []);
    } catch (error) {
      console.error("Không thể tải danh sách rank", error);
    } finally {
      setRanksLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (isNew || !id) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}/detail-stats`);
      const body = await res.json();
      if (body.success) setStats(body.data);
    } catch { /* silent */ }
  }, [id, isNew]);

  const fetchOrders = useCallback(async (tab: typeof activeTab, page: number) => {
    if (isNew || !id || tab === 'refs') return;
    setOrdersLoading(true);
    try {
      const typeParam = tab === 'all' ? '' : `&type=${tab}`;
      const res = await fetch(`${API_URL}/api/users/${id}/orders?page=${page}&limit=10${typeParam}`);
      const body = await res.json();
      if (body.success) {
        setOrdersData(body.data.data || []);
        setOrdersPagination(body.data.pagination || defaultPagination());
      }
    } catch { /* silent */ } finally { setOrdersLoading(false); }
  }, [id, isNew]);

  const fetchRefs = useCallback(async (page: number) => {
    if (isNew || !id) return;
    setRefsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}/refs?page=${page}&limit=10`);
      const body = await res.json();
      if (body.success) {
        setRefsData(body.data.data || []);
        setRefsPagination(body.data.pagination || defaultPagination());
        setTotalCommission(body.data.totalCommission || 0);
      }
    } catch { /* silent */ } finally { setRefsLoading(false); }
  }, [id, isNew]);

  useEffect(() => { fetchUser(); fetchStats(); fetchRanks(); }, [fetchUser, fetchStats, fetchRanks]);

  useEffect(() => {
    if (activeTab === 'refs') fetchRefs(1);
    else fetchOrders(activeTab, 1);
  }, [activeTab, fetchOrders, fetchRefs]);

  /* ── Handlers ── */
  const handleSave = async () => {
    if (!user.name.trim() || !user.email.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập tên và email.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (isNew && !user.password) {
      await Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập mật khẩu.', confirmButtonColor: '#3b82f6' });
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await userService.createUser({
          name: user.name.trim(),
          email: user.email.trim(),
          password: user.password!,
          status: user.status,
          ...(user.phone?.trim() ? { phone: user.phone.trim() } : {}),
          ...(user.rankId !== "" && user.rankId !== undefined && user.rankId !== null
            ? { rankId: user.rankId }
            : {}),
        });
        await Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã tạo user.', confirmButtonColor: '#10b981' });
        navigate("/admin/users");
      } else {
        await userService.updateUser(id!, buildUserPayload(user));
        await Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã cập nhật user.', confirmButtonColor: '#10b981' });
        fetchUser(); fetchStats();
      }
    } catch (e: any) {
      await Swal.fire({ icon: 'error', title: 'Lỗi', text: e?.message || 'Lỗi khi lưu.', confirmButtonColor: '#ef4444' });
    } finally { setSaving(false); }
  };

  const currentRankId = user.rankId || userDetail?.rank?.id || "";
  const currentRank = ranks.find((r) => String(r.id) === String(currentRankId)) || null;

  const handleToggleLock = async () => {
    if (!id || isNew) return;
    const newStatus = user.status === "locked" ? "active" : "locked";
    const r = await Swal.fire({ icon: 'warning', title: 'Xác nhận', text: `${newStatus === "locked" ? "Khóa" : "Mở khóa"} user này?`, showCancelButton: true, confirmButtonText: newStatus === "locked" ? "Khóa" : "Mở khóa", cancelButtonText: 'Hủy', confirmButtonColor: newStatus === "locked" ? '#ef4444' : '#10b981' });
    if (!r.isConfirmed) return;
    await userService.toggleLockUser(id, newStatus as 'active' | 'locked');
    setUser(p => ({ ...p, status: newStatus }));
  };

  const handleBalance = async (type: 'add' | 'subtract' | 'set') => {
    if (!balanceAmount || balanceAmount <= 0) return;
    const r = await Swal.fire({ icon: 'question', title: 'Xác nhận', text: `${type === 'add' ? 'Cộng' : type === 'subtract' ? 'Trừ' : 'Set'} ${fmt(balanceAmount)}đ?`, showCancelButton: true, confirmButtonText: 'Xác nhận', cancelButtonText: 'Hủy', confirmButtonColor: '#10b981' });
    if (!r.isConfirmed) return;
    const updated = await userService.adjustBalance(id!, { amount: balanceAmount, type, note: balanceNote || undefined });
    setUser(p => ({ ...p, balance: updated.balance || 0 }));
    setBalanceAmount(0); setBalanceNote("");
    fetchStats();
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      await Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Mật khẩu phải tối thiểu 6 ký tự.', confirmButtonColor: '#3b82f6' });
      return;
    }
    const r = await Swal.fire({ icon: 'warning', title: 'Xác nhận đổi mật khẩu', text: `Đổi mật khẩu user \"${user.name}\" thành mật khẩu mới?`, showCancelButton: true, confirmButtonText: 'Cập nhật', cancelButtonText: 'Hủy', confirmButtonColor: '#f59e0b' });
    if (!r.isConfirmed) return;
    setResettingPwd(true);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || 'Lỗi');
      setNewPassword("");
      await Swal.fire({ icon: 'success', title: 'Thành công', text: 'Mật khẩu đã được cập nhật.', confirmButtonColor: '#10b981' });
    } catch (e: any) {
      await Swal.fire({ icon: 'error', title: 'Lỗi', text: e?.message || 'Không thể đổi mật khẩu.', confirmButtonColor: '#ef4444' });
    } finally { setResettingPwd(false); }
  };

  if (loading) return <div className="card p-6 text-center text-slate-500">Đang tải...</div>;

  const TABS: { key: typeof activeTab; label: string; count: number | string }[] = [
    { key: 'all', label: 'Tất cả', count: stats?.totalOrders ?? '–' },
    { key: 'course', label: 'Khóa học', count: stats?.courses ?? '–' },
    { key: 'workflow', label: 'Workflow', count: stats?.workflows ?? '–' },
    { key: 'vps', label: 'VPS', count: stats?.vps ?? '–' },
    { key: 'refs', label: 'Refs', count: stats?.refCount ?? '–' },
  ];

  return (
    <>
      <PageBreadcrumb title={isNew ? "Tạo user mới" : "Chi tiết user"} name="User" breadCrumbItems={["Admin", "Users", isNew ? "Tạo mới" : (user.name || "Chi tiết")]} />

      {/* ════ Top row: Info + Balance ════ */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Info card */}
        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">{isNew ? "Tạo user mới" : "Thông tin tài khoản"} {user.status === "locked" && <span className="text-rose-500 text-xs ml-2">(ĐANG KHOÁ)</span>}</h4>
            {!isNew && (
              <button className="btn btn-sm bg-slate-100 text-xs" onClick={handleToggleLock}>
                <i className="mgc_lock_line mr-1" />{user.status === "locked" ? "Mở khoá" : "Khoá"}
              </button>
            )}
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Tên *', key: 'name', type: 'text', placeholder: 'Nhập tên' },
                { label: 'Email *', key: 'email', type: 'email', placeholder: 'Nhập email' },
                { label: 'Số điện thoại', key: 'phone', type: 'text', placeholder: 'Nhập SĐT' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                  <input className="form-input" type={f.type} value={(user as any)[f.key] || ''} onChange={e => setUser(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
              {isNew && (
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Mật khẩu *</label>
                  <input className="form-input" type="password" value={user.password || ''} onChange={e => setUser(p => ({ ...p, password: e.target.value }))} placeholder="Nhập mật khẩu" />
                </div>
              )}
              {!isNew && (
                <>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Ngày tham gia</label>
                    <input className="form-input" value={user.joinedAt || ''} disabled />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">API Token</label>
                    <div className="flex gap-2">
                      <input className="form-input font-mono text-xs" value={(user as any).apiToken || (user as any).api_token || ''} disabled />
                      <button
                        type="button"
                        className="btn btn-sm bg-slate-100 text-primary"
                        onClick={() => {
                          const token = (user as any).apiToken || (user as any).api_token;
                          if (token) {
                            navigator.clipboard.writeText(token);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã copy', showConfirmButton: false, timer: 1500 });
                          }
                        }}
                      >
                        <i className="mgc_copy_line"></i>
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Trạng thái</label>
                <select className="form-select" value={user.status || 'active'} onChange={e => setUser(p => ({ ...p, status: e.target.value as any }))}>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Khóa</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Rank</label>
                <select
                  className="form-select"
                  value={currentRankId ? String(currentRankId) : ""}
                  onChange={e => setUser(p => ({ ...p, rankId: e.target.value ? Number(e.target.value) : "" }))}
                  disabled={ranksLoading}
                >
                  <option value="">{ranksLoading ? "Đang tải..." : "Chưa gán rank"}</option>
                  {ranks.map((rank) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name} ({rank.code})
                    </option>
                  ))}
                </select>
                {!ranksLoading && (currentRank || userDetail?.rank) && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {(() => {
                      const detailRank = userDetail?.rank;
                      return (
                        currentRank?.description ||
                        currentRank?.name ||
                        detailRank?.description ||
                        detailRank?.name ||
                        "Rank hiện tại"
                      );
                    })()}
                  </p>
                )}
                {!ranksLoading && userDetail?.rank && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Đang gán: {userDetail.rank.name}
                    {userDetail.rank.code ? ` (${userDetail.rank.code})` : ""}
                  </p>
                )}
              </div>
            </div>
            <button className="btn bg-primary text-white text-sm disabled:opacity-60" onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : isNew ? "Tạo user" : "Lưu thông tin"}
            </button>
          </div>
        </div>

        {/* Balance card */}
        <div className="card">
          <div className="card-header"><h4 className="card-title mb-0">Số dư & thao tác</h4></div>
          <div className="p-5 space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Số dư hiện tại</p>
              <p className="text-2xl font-semibold text-emerald-600">{fmt(user.balance || 0)}đ</p>
            </div>
            {!isNew && (
              <>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Số tiền</label>
                  <input className="form-input" type="number" min="0" value={balanceAmount || ''} onChange={e => setBalanceAmount(Number(e.target.value) || 0)} placeholder="Nhập số tiền" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Ghi chú</label>
                  <input className="form-input" value={balanceNote} onChange={e => setBalanceNote(e.target.value)} placeholder="Ghi chú (tùy chọn)" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="btn bg-emerald-500 text-white text-xs" onClick={() => handleBalance('add')}>+ Cộng</button>
                  <button className="btn bg-rose-50 text-rose-600 text-xs" onClick={() => handleBalance('subtract')}>− Trừ</button>
                  <button className="btn bg-slate-100 text-slate-600 text-xs" onClick={() => handleBalance('set')}>=  Set</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reset password card */}
      <div className="card mb-5">
        <div className="card-header">
          <h4 className="card-title mb-0">🔑 Đặt lại mật khẩu</h4>
        </div>
        <div className="p-5 text-sm">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <p className="text-xs text-slate-400 mb-3">Admin đặt lại mật khẩu mà không cần mật khẩu cũ của user.</p>
              <label className="text-xs text-slate-500 mb-1 block">Mật khẩu mới <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  className="form-input pr-10"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                  onClick={() => setShowPassword(p => !p)}
                >
                  <i className={showPassword ? 'mgc_eye_close_line' : 'mgc_eye_2_line'} />
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn bg-amber-500 text-white text-sm disabled:opacity-60"
                onClick={handleResetPassword}
                disabled={resettingPwd || !newPassword}
              >
                <i className="mgc_lock_line mr-1" />
                {resettingPwd ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════ Stats summary ════ */}
      {!isNew && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
          {[
            { label: 'Tổng đơn', value: stats?.totalOrders ?? '–', color: 'bg-amber-50 text-amber-700' },
            { label: 'Khóa học', value: stats?.courses ?? '–', color: 'bg-blue-50 text-blue-700' },
            { label: 'Workflow', value: stats?.workflows ?? '–', color: 'bg-purple-50 text-purple-700' },
            { label: 'VPS', value: stats?.vps ?? '–', color: 'bg-sky-50 text-sky-700' },
            { label: 'Doanh thu', value: stats ? `${fmt(stats.totalRevenue)}đ` : '–', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Số Refs', value: stats?.refCount ?? '–', color: 'bg-pink-50 text-pink-700' },
            { label: 'HH từ Ref', value: stats ? `${fmt(stats.refCommission)}đ` : '–', color: 'bg-orange-50 text-orange-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl px-3 py-3 ${s.color}`}>
              <p className="text-[10px] uppercase font-semibold mb-1">{s.label}</p>
              <p className="text-base font-bold truncate">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ════ Tabs + Tables ════ */}
      {!isNew && (
        <div className="card">
          {/* Tab header */}
          <div className="border-b border-slate-200 px-4 pt-3 flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button key={t.key}
                className={`px-3 py-2 text-xs font-medium rounded-t border-b-2 transition-colors ${activeTab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === t.key ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* ─── Orders table ─── */}
          {activeTab !== 'refs' && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-xs divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Mã đơn</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Loại</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600">Số tiền</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Phương thức TT</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Đang tải...</td></tr>
                  ) : ordersData.length === 0 ? (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Không có đơn hàng nào.</td></tr>
                  ) : ordersData.map(o => (
                    <tr key={o.id} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 font-mono text-slate-700">#{o.id}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${o.type === 'course' ? 'bg-blue-100 text-blue-700' : o.type === 'workflow' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                          {o.type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-primary">{fmt(Number(o.amount || 0))}đ</td>
                      <td className="px-3 py-2.5 text-slate-600">{o.payment_method || '–'}</td>
                      <td className="px-3 py-2.5">{statusBadge(o.status || '')}</td>
                      <td className="px-3 py-2.5 text-slate-500">{o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <MiniPagination pagination={ordersPagination} loading={ordersLoading} onPageChange={p => fetchOrders(activeTab, p)} />
            </div>
          )}

          {/* ─── Refs table ─── */}
          {activeTab === 'refs' && (
            <div className="relative overflow-x-auto">
              {/* Tổng hoa hồng */}
              <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-100">
                <span className="text-xs text-orange-700 font-medium">Tổng doanh thu từ Refs</span>
                <span className="text-base font-bold text-orange-700">{fmt(totalCommission)}đ</span>
              </div>
              <table className="w-full text-xs divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Tên</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Email</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">SĐT</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600">Số dư</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600">HH nhận</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {refsLoading ? (
                    <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-400">Đang tải...</td></tr>
                  ) : refsData.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-400">Chưa có ai dùng mã giới thiệu này.</td></tr>
                  ) : refsData.map((r: any) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 font-medium text-slate-800">{r.name}</td>
                      <td className="px-3 py-2.5 text-slate-500">{r.email}</td>
                      <td className="px-3 py-2.5 text-slate-500">{r.phone || '–'}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-primary">{fmt(Number(r.balance || 0))}đ</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-orange-600">{fmt(Number(r.ref_commission || 0))}đ</td>
                      <td className="px-3 py-2.5">{statusBadge(r.status || 'active')}</td>
                      <td className="px-3 py-2.5 text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <MiniPagination pagination={refsPagination} loading={refsLoading} onPageChange={p => fetchRefs(p)} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserAdminDetail;
