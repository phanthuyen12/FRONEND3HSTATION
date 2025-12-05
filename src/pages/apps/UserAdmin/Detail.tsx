import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { userService } from "../../../config";
import { User, UserDetail } from "../../../services/userService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

type EditableUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'joinedAt'> & {
  password?: string;
  joinedAt?: string;
};

const emptyUser = (): EditableUser => ({
  name: "",
  email: "",
  phone: "",
  balance: 0,
  status: "active",
  role: "user",
  password: "",
});

const UserAdminDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new" || id === undefined;

  const [user, setUser] = useState<EditableUser>(emptyUser());
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<number>(0);
  const [balanceNote, setBalanceNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Load user data if editing
  useEffect(() => {
    if (!isNew && id && id !== "new") {
      const loadUser = async () => {
        try {
          setLoading(true);
          const datas:any = await userService.getUser(id);
          const data = datas.data;
          setUserDetail(data);
          setUser({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            balance: data.balance || 0,
            status: data.status || "active",
            role: data.role || "user",
            joinedAt: data.joinedAt || data.createdAt || "",
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Không thể tải user", error);
          await Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải thông tin user. Vui lòng thử lại.',
            confirmButtonText: 'Đã hiểu',
            confirmButtonColor: '#ef4444',
          });
          navigate("/admin/users");
        } finally {
          setLoading(false);
        }
      };
      loadUser();
    } else if (isNew) {
      setUser(emptyUser());
      setLoading(false);
    }
  }, [id, isNew, navigate]);

  const handleUserFieldChange = (field: keyof EditableUser, value: string | number) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    // Validation
    if (!user.name.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập tên user.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!user.email.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập email.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (isNew && !user.password) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập mật khẩu.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);

      if (isNew) {
        // Tạo user mới
        const payload = {
          name: user.name.trim(),
          email: user.email.trim(),
          phone: user.phone?.trim() || undefined,
          password: user.password || "",
          status: user.status || "active",
        };
        await userService.createUser(payload);
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã tạo user thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
        navigate("/admin/users");
      } else {
        // Cập nhật user
        const payload: any = {};
        if (user.name.trim()) payload.name = user.name.trim();
        if (user.email.trim()) payload.email = user.email.trim();
        if (user.phone?.trim()) payload.phone = user.phone.trim();
        if (user.status) payload.status = user.status;

        await userService.updateUser(id!, payload);
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã cập nhật user thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
        // Reload user data
        const data = await userService.getUser(id!);
        setUserDetail(data);
        setUser({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          balance: data.balance || 0,
          status: data.status || "active",
          role: data.role || "user",
          joinedAt: data.joinedAt || data.createdAt || "",
        });
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Lưu user thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Có lỗi khi lưu user. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLock = async () => {
    if (!id || isNew) return;

    const newStatus = user.status === "locked" ? "active" : "locked";
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận',
      text: `Bạn có chắc chắn muốn ${newStatus === "locked" ? "khóa" : "mở khóa"} user này?`,
      showCancelButton: true,
      confirmButtonText: newStatus === "locked" ? "Khóa" : "Mở khóa",
      cancelButtonText: 'Hủy',
      confirmButtonColor: newStatus === "locked" ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      const updated = await userService.toggleLockUser(id, newStatus as 'active' | 'locked');
      setUser((prev) => ({ ...prev, status: updated.status || newStatus }));
      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} user thành công.`,
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Khóa/mở khóa user thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể khóa/mở khóa user. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleAdjustBalance = async (type: 'add' | 'subtract' | 'set') => {
    if (!id || isNew) {
      await Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng lưu user trước khi thao tác số dư.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!balanceAmount || balanceAmount <= 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập số tiền lớn hơn 0.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (type === 'subtract' && (user.balance || 0) < balanceAmount) {
      await Swal.fire({
        icon: 'warning',
        title: 'Lỗi',
        text: 'Số dư không đủ để trừ.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Xác nhận',
      text: `Bạn có chắc chắn muốn ${type === 'add' ? 'cộng' : type === 'subtract' ? 'trừ' : 'set'} ${balanceAmount.toLocaleString('vi-VN')}đ ${type === 'subtract' ? 'từ' : 'vào'} số dư?`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      const updated = await userService.adjustBalance(id, {
        amount: balanceAmount,
        type: type,
        note: balanceNote.trim() || undefined,
      });
      setUser((prev) => ({ ...prev, balance: updated.balance || 0 }));
      setBalanceAmount(0);
      setBalanceNote("");
      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã ${type === 'add' ? 'cộng' : type === 'subtract' ? 'trừ' : 'set'} tiền thành công.`,
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Thao tác số dư thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể thao tác số dư. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          title="Đang tải..."
          name="User"
          breadCrumbItems={["Konrix", "Apps", "Users"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin user...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        title={isNew ? "Tạo user mới" : "Chi tiết user"}
        name="User"
        breadCrumbItems={[
          "Konrix",
          "Apps",
          "Users",
          isNew ? "Tạo mới" : (user.name || "Chi tiết"),
        ]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Thông tin user */}
        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">
              {isNew ? "Tạo user mới" : "Thông tin tài khoản"}{" "}
              {user.status === "locked" && "(ĐANG KHOÁ)"}
            </h4>
            {!isNew && (
              <button
                type="button"
                className="btn btn-sm bg-slate-100 text-xs"
                onClick={handleToggleLock}
              >
                <i className="mgc_lock_line mr-1" />
                {user.status === "locked" ? "Mở khoá" : "Khoá tài khoản"}
              </button>
            )}
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Tên <span className="text-rose-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={user.name}
                  onChange={(e) =>
                    handleUserFieldChange("name", e.target.value)
                  }
                  placeholder="Nhập tên user"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    handleUserFieldChange("email", e.target.value)
                  }
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Số điện thoại
                </label>
                <input
                  className="form-input"
                  value={user.phone || ""}
                  onChange={(e) =>
                    handleUserFieldChange("phone", e.target.value)
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {isNew && (
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className="form-input"
                    type="password"
                    value={user.password || ""}
                    onChange={(e) =>
                      handleUserFieldChange("password", e.target.value)
                    }
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              )}
              {!isNew && (
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Ngày tham gia
                  </label>
                  <input
                    className="form-input"
                    value={user.joinedAt || ""}
                    disabled
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Trạng thái
                </label>
                <select
                  className="form-select"
                  value={user.status || "active"}
                  onChange={(e) =>
                    handleUserFieldChange("status", e.target.value)
                  }
                >
                  <option value="active">Hoạt động</option>
                  <option value="locked">Khóa</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="btn bg-primary text-white text-sm disabled:opacity-60"
              onClick={handleSaveUser}
              disabled={saving}
            >
              {saving
                ? "Đang lưu..."
                : isNew
                ? "Tạo user"
                : "Lưu thông tin user"}
            </button>
          </div>
        </div>

        {/* Số dư & thao tác tiền */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Số dư & thao tác</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Số dư hiện tại</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {(user.balance || 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
            {!isNew && (
              <>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Số tiền thao tác
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={balanceAmount || ""}
                    onChange={(e) =>
                      setBalanceAmount(Number(e.target.value) || 0)
                    }
                    placeholder="Nhập số tiền"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Ghi chú (tùy chọn)
                  </label>
                  <input
                    className="form-input"
                    value={balanceNote}
                    onChange={(e) => setBalanceNote(e.target.value)}
                    placeholder="Ghi chú cho thao tác"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="btn bg-emerald-500 text-white text-xs"
                    onClick={() => handleAdjustBalance("add")}
                  >
                    + Cộng
                  </button>
                  <button
                    type="button"
                    className="btn bg-rose-50 text-rose-600 text-xs"
                    onClick={() => handleAdjustBalance("subtract")}
                  >
                    - Trừ
                  </button>
                  <button
                    type="button"
                    className="btn bg-slate-100 text-slate-600 text-xs"
                    onClick={() => handleAdjustBalance("set")}
                  >
                    = Set
                  </button>
                </div>
              </>
            )}
            {isNew && (
              <p className="text-[11px] text-slate-500">
                Lưu user trước để có thể thao tác số dư.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thống kê (chỉ hiển thị khi edit) */}
      {!isNew && userDetail && (
        <div className="card mb-6">
          <div className="card-header">
            <h4 className="card-title mb-0">Thống kê</h4>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-700">
                <p className="text-xs uppercase font-semibold mb-1">Tổng đơn hàng</p>
                <p className="text-xl font-bold">{userDetail.total || 0}</p>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-blue-700">
                <p className="text-xs uppercase font-semibold mb-1">Khóa học</p>
                <p className="text-xl font-bold">{userDetail.courses || 0}</p>
              </div>
              <div className="rounded-xl bg-purple-50 px-4 py-3 text-purple-700">
                <p className="text-xs uppercase font-semibold mb-1">Workflows</p>
                <p className="text-xl font-bold">{userDetail.workflows || 0}</p>
              </div>
              <div className="rounded-xl bg-green-50 px-4 py-3 text-green-700">
                <p className="text-xs uppercase font-semibold mb-1">VPS</p>
                <p className="text-xl font-bold">{userDetail.vps || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAdminDetail;
