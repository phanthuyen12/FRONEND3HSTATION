import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { authService, userService } from "../../config";
import { User } from "../../services/authService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [changePasswordMode, setChangePasswordMode] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Lấy user từ localStorage trước
        const localUser = authService.getUser();
        if (localUser) {
          setUser(localUser);
          setFormData({
            name: localUser.name || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
          });
        }

        // Nếu có API getProfile, gọi để lấy thông tin mới nhất
        try {
          const profileData = await authService.getProfile();
          if (profileData) {
            setUser(profileData);
            setFormData({
              name: profileData.name || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
            });
            // Cập nhật localStorage
            localStorage.setItem('auth_user', JSON.stringify(profileData));
          }
        } catch (error) {
          // Nếu API không có, dùng dữ liệu từ localStorage
          // eslint-disable-next-line no-console
          console.log("Using local user data");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      loadProfile();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      await Swal.fire({
        icon: 'warning',
        title: 'Tên không hợp lệ',
        text: 'Tên phải có ít nhất 2 ký tự.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);
      // Cập nhật profile qua authService
      const updated = await authService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
      });

      // Cập nhật state
      setUser(updated);

      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã cập nhật thông tin cá nhân.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Cập nhật profile thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập mật khẩu hiện tại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu mới không hợp lệ',
        text: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không khớp',
        text: 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);
      // TODO: Gọi API đổi mật khẩu khi backend có
      // await authService.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword,
      // });

      await Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Chức năng đổi mật khẩu đang được phát triển. Vui lòng liên hệ admin để được hỗ trợ.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePasswordMode(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Đổi mật khẩu thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Xác nhận đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      await authService.logout();
      await Swal.fire({
        icon: 'success',
        title: 'Đã đăng xuất',
        text: 'Bạn đã đăng xuất thành công.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
      navigate("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Đăng xuất thất bại", error);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title="Hồ sơ cá nhân"
          breadCrumbItems={["Client", "Hồ sơ cá nhân"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin...
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <PageBreadcrumb
        name="Hồ sơ cá nhân"
        title="Hồ sơ cá nhân"
        breadCrumbItems={["Client", "Hồ sơ cá nhân"]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <div className="card">
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-2xl font-semibold text-amber-600">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{user.email}</p>
            </div>
            <div className="w-full border-t border-slate-100 pt-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
              {user.role && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Vai trò:</span>
                  <span className="font-medium">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-sm bg-rose-50 text-rose-600 w-full mt-4"
              onClick={handleLogout}
            >
              <i className="mgc_logout_line mr-1" />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Thông tin cơ bản</h4>
            </div>
            <div className="p-6 grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleFieldChange}
                  disabled={saving}
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  disabled
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Email không thể thay đổi
                </p>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  placeholder="Nhập số điện thoại"
                  disabled={saving}
                />
              </div>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn bg-primary text-white disabled:opacity-60"
                onClick={handleUpdateProfile}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h4 className="card-title mb-0">Đổi mật khẩu</h4>
              {!changePasswordMode && (
                <button
                  type="button"
                  className="btn btn-sm bg-slate-100 text-xs"
                  onClick={() => setChangePasswordMode(true)}
                >
                  Đổi mật khẩu
                </button>
              )}
            </div>
            {changePasswordMode && (
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Mật khẩu hiện tại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      className="form-input pr-10"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      <i className={showPasswords.current ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Mật khẩu mới <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      className="form-input pr-10"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      <i className={showPasswords.new ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input pr-10"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      <i className={showPasswords.confirm ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn bg-primary text-white disabled:opacity-60"
                    onClick={handleChangePassword}
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu mật khẩu mới"}
                  </button>
                  <button
                    type="button"
                    className="btn bg-slate-100 text-slate-700"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
